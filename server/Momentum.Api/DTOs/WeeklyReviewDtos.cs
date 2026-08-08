using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.DTOs;

public record UpsertWeeklyReviewRequest(
    [MaxLength(2000)] string? Wins,
    [MaxLength(2000)] string? Struggles,
    [MaxLength(2000)] string? NextWeekFocus
);

public record WeeklyReviewResponse(
    Guid     Id,
    DateOnly WeekStart,
    string?  Wins,
    string?  Struggles,
    string?  NextWeekFocus,
    DateTime CreatedAt,
    DateTime UpdatedAt,

    // Auto-computed stats for the week
    WeekStatsResponse Stats
);

public record WeekStatsResponse(
    int    TotalHabits,
    int    HabitCompletions,
    int    HabitCompletionPct,
    int    BestStreak,
    int    JournalEntries,
    int    GoalsProgressed,
    string MostConsistentHabit
);
