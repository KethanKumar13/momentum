using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.DTOs;

public record CreateGoalRequest(
    [Required, MaxLength(200)] string Title,
    [MaxLength(500)] string? Why,
    [Required] string Category,
    DateOnly? TargetDate,
    string Status = "active"
);

public record UpdateGoalRequest(
    [MaxLength(200)] string? Title,
    [MaxLength(500)] string? Why,
    string? Category,
    DateOnly? TargetDate,
    string? Status,
    int? ProgressPct
);

public record GoalResponse(
    Guid Id,
    string Title,
    string? Why,
    string Category,
    DateOnly? TargetDate,
    string Status,
    int ProgressPct,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<HabitSummary> LinkedHabits
);

public record HabitSummary(
    Guid Id,
    string Title,
    string? Icon,
    string Color
);