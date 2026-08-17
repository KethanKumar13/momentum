# Momentum — End-to-End Sequence Diagram

One diagram, the whole loop:
**Sign in → Set goals → Daily habits → Journal → Weekly review → Insights → Reminders.**

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 User
    participant C as 💻 Client<br/>(React PWA)
    participant API as ⚙️ API<br/>(ASP.NET Core 8)
    participant DB as 🗄️ PostgreSQL<br/>(Neon)
    participant H as ⏰ Hangfire<br/>(Scheduler)
    participant M as ✉️ Resend<br/>(Email)

    %% ---------- 1. AUTH ----------
    rect rgb(232, 244, 255)
    Note over U,M: 1️⃣  Sign in (Email/Password or Google OAuth)
    U->>C: Enter credentials / Continue with Google
    C->>API: POST /auth/login
    API->>DB: Validate user
    DB-->>API: user record
    API-->>C: 200 OK + JWT (HttpOnly cookie)
    C-->>U: Land on Dashboard
    end

    %% ---------- 2. GOALS ----------
    rect rgb(240, 255, 240)
    Note over U,DB: 2️⃣  Create a long-term goal
    U->>C: Add goal (outcome, "why", target date)
    C->>API: POST /goals
    API->>DB: INSERT Goal
    DB-->>API: goal
    API-->>C: 201 Created
    end

    %% ---------- 3. DAILY HABITS ----------
    rect rgb(255, 249, 230)
    Note over U,DB: 3️⃣  Daily habit check-in
    U->>C: Open "Today"
    C->>API: GET /habits/today
    API->>DB: SELECT habits + today's logs
    DB-->>API: habit list
    API-->>C: 200 OK
    U->>C: Tap ✓ on a habit
    C->>API: POST /habits/{id}/log
    API->>DB: INSERT log + recompute streak 🔥
    DB-->>API: new streak
    API-->>C: 200 OK
    C-->>U: Streak animates ↑
    end

    %% ---------- 4. JOURNAL ----------
    rect rgb(250, 240, 255)
    Note over U,DB: 4️⃣  Journal entry (mood + tags)
    U->>C: Write daily entry
    C->>API: POST /journal
    API->>DB: UPSERT JournalEntry
    DB-->>API: entry saved
    API-->>C: 201 Created
    end

    %% ---------- 5. WEEKLY REVIEW ----------
    rect rgb(255, 235, 235)
    Note over U,DB: 5️⃣  Weekly review (auto stats + reflection)
    U->>C: Open "Weekly Review"
    C->>API: GET /review/week
    API->>DB: Aggregate habits, mood, goals
    DB-->>API: stats
    API-->>C: {completion %, top habits, mood avg}
    U->>C: Add wins / struggles / next-week focus
    C->>API: POST /review/week
    API->>DB: INSERT WeeklyReview
    API-->>C: 201 Created
    end

    %% ---------- 6. INSIGHTS ----------
    rect rgb(235, 245, 255)
    Note over U,DB: 6️⃣  Insights (heatmap + charts)
    U->>C: Open "Insights"
    C->>API: GET /insights
    API->>DB: Aggregate long-range data
    DB-->>API: series
    API-->>C: heatmap + goal progress
    C-->>U: Render 📊
    end

    %% ---------- 7. REMINDERS ----------
    rect rgb(245, 245, 245)
    Note over H,U: 7️⃣  Scheduled reminders (background job)
    H->>API: Trigger hourly job
    API->>DB: Find users with due reminders (tz-aware)
    DB-->>API: pending users
    API->>M: Send reminder email
    M-->>U: "Don't break the chain ✨"
    end

    Note over U,DB: 🔁 The loop repeats — small habits compound into real momentum.
```

## Legend

| Actor | Role |
|---|---|
| 👤 **User** | Interacts with the app on web / installed PWA |
| 💻 **Client** | React 19 + Vite PWA (TanStack Query, Zustand, Framer Motion) |
| ⚙️ **API** | ASP.NET Core 8 Web API (Identity + JWT, EF Core, FluentValidation) |
| 🗄️ **PostgreSQL** | Neon-hosted database — goals, habits, logs, journal, reviews |
| ⏰ **Hangfire** | Background scheduler for reminders & recurring jobs |
| ✉️ **Resend** | Transactional email (verification, reset, reminders) |