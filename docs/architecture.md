# Architecture

_A concise overview of how Momentum is built._

## System diagram

```
                          ┌──────────────────────┐
                          │      Browser         │
                          │  (React 19 PWA)      │
                          └──────────┬───────────┘
                                     │ HTTPS
                                     │ (HttpOnly JWT cookie)
                                     ▼
                          ┌──────────────────────┐
                          │   ASP.NET Core 8 API │
                          │  (Momentum.Api)      │
                          └──────────┬───────────┘
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
     ┌────────────────┐    ┌──────────────────┐   ┌──────────────────┐
     │  PostgreSQL    │    │    Hangfire      │   │  External APIs   │
     │  (Neon)        │    │  (reminders/jobs)│   │  Resend, Google  │
     └────────────────┘    └──────────────────┘   └──────────────────┘
```

## Component overview

### Frontend (`/client`)

| Layer | Responsibility | Tech |
|---|---|---|
| Pages | Route components (`LandingPage`, `TodayPage`, …) | React Router v6 |
| Components | Feature-scoped UI (habits, goals, journal, insights) | React + CSS Modules |
| Hooks | Data fetching + mutations | TanStack Query v5 |
| Services | Thin API clients (`habitService`, `authService`) | fetch wrapper |
| Context | Auth session, theme | React Context |
| Analytics | Event capture (opt-in) | PostHog |
| PWA | Offline shell, install prompt | vite-plugin-pwa |

### Backend (`/server/Momentum.Api`)

| Layer | Responsibility |
|---|---|
| Controllers | HTTP endpoints under `/api/*` |
| Services | Domain logic (StreakService, PlanService, TimezoneService, EmailService) |
| DTOs | Request/response contracts with FluentValidation |
| Domain | EF Core entities (User, Habit, HabitLog, Goal, JournalEntry, WeeklyReview) |
| Data | AppDbContext, migrations |
| Extensions | Auth, CORS, Hangfire, Serilog, Sentry setup |
| Jobs | Recurring Hangfire jobs (daily reminder, weekly review nudge) |

### Data model (simplified)

```
User ─┬─ Habit ────── HabitLog
      ├─ Goal ─────── (many Habits)
      ├─ JournalEntry
      ├─ WeeklyReview
      ├─ Checkin
      └─ RefreshToken
```

### Auth flow

1. Password: `POST /api/auth/signup|login` → issue access + refresh JWT as HttpOnly cookies.
2. Google: `GET /api/auth/google` → challenge → `/signin-google` → callback → issue same cookie pair → redirect to client.
3. `GET /api/auth/me` on every app load to hydrate the client session.
4. Silent refresh via `POST /api/auth/refresh` when access token nears expiry.

### Streaks

- Streaks are computed on demand from `HabitLog` rows in `StreakService`.
- Rules: daily habits require a log every scheduled day; weekly-count habits require N logs in the ISO week; specific-day habits require a log on each configured day.
- A skip does not break the streak. A miss does. Skips are tagged by `HabitLog.status = 'skip'`.

### Timezone handling

- `User.Timezone` (IANA) is the source of truth.
- The server converts UTC to the user's local day boundary via `TimezoneService.LocalDate(userTz, utcNow)`.
- The frontend never computes "today" on its own; it asks `/api/today`.

## Deployment

| Piece | Where |
|---|---|
| Client | Vercel (auto-deploy on `main`) |
| API | Fly.io (`fly deploy` on tag) |
| DB | Neon (pooled Postgres) |
| Email | Resend |
| Errors | Sentry (client + server) |
| Analytics | PostHog (opt-in) |

## Non-functional requirements

- **P95 API latency** < 200 ms on cached queries
- **Client bundle** < 350 KB gzipped for initial route
- **Lighthouse score** > 90 on all categories for `/`
- **Uptime target** 99.9%
- **Data export** available at any time in Settings → JSON or CSV

## Trade-offs and open questions

- **CSS Modules over Tailwind:** more verbose per-file, but keeps the design-token system explicit.
- **Hangfire over Quartz:** simpler UI, good enough for scheduled jobs at this scale.
- **JSON.stringified frequencyConfig:** simpler schema now, but limits SQL-side querying later.
- **Single-region deploy:** fine for beta. Multi-region needed above ~10k DAU.
