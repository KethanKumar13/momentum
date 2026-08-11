namespace Momentum.Api.DTOs;

public record CreateTaskRequest(
    string Title,
    DateOnly Date,
    Guid? HabitId,
    string? Priority);

public record UpdateTaskRequest(
    string? Title,
    DateOnly? Date,
    string? Status,        // todo | done
    string? Priority,
    int? FocusMinutes);

public record TaskResponse(
    Guid Id,
    string Title,
    DateOnly Date,
    string Status,
    string? Priority,
    int FocusMinutes,
    Guid? HabitId,
    DateTime CreatedAt);
