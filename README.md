# Momentum

**Small habits. Real momentum.**

A full-stack habit tracker that connects your goals, daily habits, and weekly reflections, so the person you want to become is someone you're actively building.




[Live Demo](#) · [Report Bug](https://github.com/KethanKumar13/momentum/issues) · [Request Feature](https://github.com/KethanKumar13/momentum/issues)

---

## What is Momentum?

Most habit apps track streaks. Momentum builds systems.

You set a **goal**, link **habits** to it, log your progress daily, and every Sunday a **weekly review** shows you exactly how consistent you were — computed automatically from your logs. No manual input. No guessing.

---

## Features

- 🎯 **Goals** — set long-term goals with a target date and status
- ⚡ **Habits** — daily, weekly, or specific-day frequency with streak tracking
- ✅ **Today Screen** — see exactly which habits are due today, mark them done with one tap
- 📓 **Journal** — rich text entries (Tiptap), mood tagging, searchable, calendar view
- 📊 **Weekly Review** — auto-computed stats (habit completion %, best streak, journal days) + reflection prompts
- 🔥 **Insights** — heatmap of activity, top habits by consistency, goals progress
- 🔐 **Auth** — JWT in httpOnly cookies with automatic refresh token rotation

---

## Stack

|               |                                                                |
| ------------- | -------------------------------------------------------------- |
| **Frontend**  | React 19, Vite 8, React Router v7, React Query v5, CSS Modules |
| **Rich Text** | Tiptap v3                                                      |
| **Backend**   | ASP.NET Core 8, EF Core 8                                      |
| **Database**  | PostgreSQL (Neon)                                              |
| **Auth**      | JWT httpOnly cookies + refresh rotation                        |
| **CI**        | GitHub Actions                                                 |

---

## Getting Started

**Prerequisites:** Node 20+, .NET 8 SDK, PostgreSQL

```bash
# 1. Clone
git clone https://github.com/KethanKumar13/momentum.git && cd momentum

# 2. Install client deps
cd client && npm install && cd ..

# 3. Create server config (gitignored)
cat > server/Momentum.Api/appsettings.Development.json << 'EOF'
{
  "ConnectionStrings": { "Postgres": "YOUR_CONNECTION_STRING" },
  "Jwt": { "Key": "your-secret-key-min-32-chars-here!!" },
  "Cors": { "AllowedOrigins": ["http://localhost:5173"] }
}
EOF

# 4. Create client config (gitignored)
echo "VITE_API_URL=http://localhost:5080/api" > client/.env.local

# 5. Migrate & run
cd server/Momentum.Api && dotnet ef database update && dotnet run &
cd client && npm run dev
```

App → `http://localhost:5173` · API → `http://localhost:5080`

---

## Project Structure

```
momentum/
├── client/src/
│   ├── components/     # UI components (habits, goals, journal, insights)
│   ├── hooks/          # React Query hooks per feature
│   ├── pages/          # Route-level pages
│   └── services/       # Axios API wrappers
└── server/Momentum.Api/
    ├── Controllers/    # REST endpoints
    ├── Services/       # Business logic (streaks, progress, insights)
    ├── Domain/         # EF Core entities
    └── Data/           # AppDbContext + migrations
```

---

## Architecture Decisions

- **One entry per day** for journal — PUT `/api/journal/:date` is an upsert, keeping the model simple
- **Progress auto-computed** — `ProgressService` recomputes goal progress every time a habit is logged, no manual input
- **Streaks computed at query time** — stored in memory per request, not persisted, so they're always accurate
- **React Query over Zustand** for all server state — optimistic updates on habit logging for instant UI feedback
- **httpOnly cookies** for JWT — access token (15min) + refresh token (7 days) with rotation on every refresh

---

Built by [Kethan Kumar](https://github.com/KethanKumar13)