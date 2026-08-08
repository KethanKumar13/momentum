namespace Momentum.Api.DTOs;

// -- Summary stats ---------------------------------------------
public record InsightsSummaryResponse(
    int TotalHabits,
    int CompletedToday,
    int CompletionRatePct,
    int LongestStreak,
    int CurrentStreak,
    int TotalGoals,
    int CompletedGoals,
    int AvgGoalProgressPct,
    int TotalHabitLogsAllTime
);

// -- Heatmap ---------------------------------------------------
public record HeatmapDayResponse(
    DateOnly Date,
    int Count,
    int Total
);

// -- Per-habit streak leaderboard ------------------------------
public record HabitStreakResponse(
    Guid Id,
    string Title,
    string? Icon,
    string Color,
    int CurrentStreak,
    int LongestStreak,
    int TotalLogs,
    double ConsistencyPct
);

// -- Goal progress list ----------------------------------------
public record GoalProgressResponse(
    Guid Id,
    string Title,
    string Category,
    string Status,
    int ProgressPct,
    int LinkedHabitsCount
);

// -- Full insights payload -------------------------------------
public record InsightsResponse(
    InsightsSummaryResponse Summary,
    List<HeatmapDayResponse> Heatmap,
    List<HabitStreakResponse> TopHabits,
    List<GoalProgressResponse> Goals
);
