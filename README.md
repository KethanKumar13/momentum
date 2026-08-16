<div align="center">

<img src="./client/public/logo.svg" alt="Momentum logo" width="80" height="80" />

# Momentum

**Small habits. Real momentum.**

_Turn long-term goals into daily habits, and daily habits into consistent action._


![Client CI](https://github.com/KethanKumar13/momentum/actions/workflows/client-ci.yml/badge.svg)
![Server CI](https://github.com/KethanKumar13/momentum/actions/workflows/server-ci.yml/badge.svg)
![Made with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Made with .NET](https://img.shields.io/badge/.NET-8-512BD4?logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Postgres-16-4169E1?logo=postgresql&logoColor=white)

</div>

---

## Why Momentum

Todoist has tasks. Habitica has habits. Notion has everything, badly.
**Momentum has the loop:** goals → habits → daily check-in → weekly review → insights → back to goals.

One calm, focused app for the whole cycle. No gamification chaos. No AI hallucinations. Just the small daily actions that compound into a real life change.

## Feature overview

|  | Feature | What it does |
|---|---|---|
| 🎯 | **Long-term goals** | Outcome + a clear "why" + target date |
| 🔥 | **Habits and streaks** | Daily, weekly-count, or specific-day habits. Streaks that survive skips but break on misses |
| 📓 | **Journal** | Daily entries with mood, tags, and a monthly calendar view |
| 📅 | **Weekly review** | Auto-computed stats plus wins, struggles, and next-week focus |
| 📊 | **Insights** | GitHub-style heatmap, mood distribution, top habits, goal progress |
| 🌗 | **Themes** | Dark, light, or system |
| 📱 | **PWA** | Install on iOS / Android / desktop home screen |
| 🔒 | **Privacy-first** | Your data stays yours. JSON and CSV export any time |
| 🔑 | **Auth** | Email + password with Google OAuth. Password reset via email |
| 🌐 | **i18n-ready** | Timezone-aware "today" boundaries |



</div>

## Tech stack

**Frontend**

- React 19, Vite 8, JavaScript with modern ESM
- React Router v6, TanStack Query v5, Zustand
- Framer Motion, Lucide icons, Fluent Emoji SVGs
- CSS Modules with a design-token system
- Vitest + Testing Library, ESLint 9 flat config, Prettier, Husky
- PWA via vite-plugin-pwa

**Backend**

- ASP.NET Core 8 Web API, C# 12
- Entity Framework Core 8 with PostgreSQL (Neon-hosted)
- Identity + JWT + HttpOnly cookies + Google OAuth
- Hangfire for scheduled reminders and jobs
- Resend for transactional email
- Sentry for error tracking, Serilog for logs
- FluentValidation, Mapster, xUnit

**Infra**

- Client on Vercel / Netlify / Cloudflare Pages
- API on Fly.io / Railway / Render
- Postgres on Neon
- CI/CD via GitHub Actions

See [`docs/architecture.md`](./docs/architecture.md) for the full picture.

## Quick start

### Prerequisites

- Node.js 20+ and npm
- .NET 8 SDK
- PostgreSQL 16+ (local or a free Neon database)

### Clone

```bash
git clone https://github.com/KethanKumar13/momentum.git
cd momentum
```

### Run the API

```bash
cd server/Momentum.Api

# One-time secrets
dotnet user-secrets set "ConnectionStrings:Postgres" "Host=localhost;Database=momentum;Username=postgres;Password=postgres"
dotnet user-secrets set "Jwt:Key"           "your-256-bit-secret-goes-here-please-change-me"
dotnet user-secrets set "Google:ClientId"   "..."
dotnet user-secrets set "Google:ClientSecret" "..."
dotnet user-secrets set "Client:BaseUrl"    "http://localhost:5173"

dotnet ef database update
dotnet run
```

The API is now on `http://localhost:5080`.

### Run the client

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` and sign up. That's it.

### Run tests

```bash
# Frontend
cd client
npm run test
npm run lint

# Backend
cd server
dotnet test
```

## Project structure

```
momentum/
├── client/                  ← React app (Vite + PWA)
│   ├── public/              ← Static assets, PWA icons, logo.svg
│   ├── src/
│   │   ├── components/      ← Feature-scoped components
│   │   ├── pages/           ← Route components
│   │   ├── hooks/           ← TanStack Query hooks
│   │   ├── services/        ← API clients
│   │   ├── context/         ← Auth context
│   │   ├── theme/           ← Design tokens + theme provider
│   │   └── lib/             ← Analytics, utils, formatters
│   └── vite.config.js
│
├── server/                  ← ASP.NET Core 8 API
│   ├── Momentum.Api/        ← Web API host + controllers
│   ├── Momentum.Api.Tests/  ← xUnit tests
│   └── Momentum.sln
│
├── docs/                    ← Architecture diagrams
├── .github/                 ← Workflows, issue + PR templates
└── README.md
```


---

<div align="center">

**Momentum**  ·  Small habits. Real momentum.

[Website](https://momentum.app)  ·
[Twitter](https://twitter.com/kethankumar13)  ·
[LinkedIn](https://linkedin.com/in/kethankumar13)

</div>