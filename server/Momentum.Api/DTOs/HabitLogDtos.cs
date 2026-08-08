using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.DTOs;

public record LogHabitRequest(
    string Status = "done",
    [MaxLength(500)] string? Note = null,
    DateOnly? Date = null
);

public record HabitLogResponse(
    Guid Id,
    Guid HabitId,
    DateOnly Date,
    string Status,
    string? Note,
    DateTime CreatedAt
);