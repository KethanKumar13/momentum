using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.DTOs;

public record CreateHabitRequest(
    [Required, MaxLength(200)] string Title,
    string Type = "build",
    string FrequencyType = "daily",
    string FrequencyConfig = "{}",
    TimeOnly? ReminderTime = null,
    string Color = "#7C5CFF",
    string? Icon = null,
    Guid? GoalId = null
);

public record UpdateHabitRequest(
    [MaxLength(200)] string? Title,
    string? Type,
    string? FrequencyType,
    string? FrequencyConfig,
    TimeOnly? ReminderTime,
    string? Color,
    string? Icon,
    Guid? GoalId
);

public record HabitResponse(
    Guid Id,
    string Title,
    string Type,
    string FrequencyType,
    string FrequencyConfig,
    TimeOnly? ReminderTime,
    string Color,
    string? Icon,
    Guid? GoalId,
    bool IsDueToday,
    int CurrentStreak,
    int LongestStreak,
    DateTime? ArchivedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt
);