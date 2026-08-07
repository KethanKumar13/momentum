# Momentum

> Small habits. Real momentum.

Build better habits. Achieve meaningful goals. Stay consistent every day.

---

## Quick Start

### Frontend

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

### Backend

```bash
cd server/Momentum.Api
cp appsettings.Development.json.example appsettings.Development.json
# fill in your Neon connection string
dotnet ef database update
dotnet run         # http://localhost:5080
```

---

## Scripts

| Command                                                     | What it does                  |
| ----------------------------------------------------------- | ----------------------------- |
| `cd client && npm run dev`                                  | Start frontend dev server     |
| `cd client && npm run build`                                | Build frontend for production |
| `cd client && npm run lint`                                 | Run ESLint                    |
| `cd server/Momentum.Api && dotnet run`                      | Start API                     |
| `cd server && dotnet test`                                  | Run all tests                 |
| `cd server/Momentum.Api && dotnet ef migrations add <Name>` | Add migration                 |

---

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | React 19, Vite 8, React Router v7, Zustand, CSS Modules |
| Backend  | ASP.NET Core 8, EF Core 8, PostgreSQL (Neon)            |
| Auth     | JWT httpOnly cookies + Google OAuth                     |
| CI/CD    | GitHub Actions → Vercel (client) + Render (server)      |