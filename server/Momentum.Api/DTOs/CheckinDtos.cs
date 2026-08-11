namespace Momentum.Api.DTOs;

public record UpsertCheckinRequest(
    DateOnly Date,
    int Mood,          // 1..5
    int Energy,        // 1..5
    double? SleepHours);

public record CheckinResponse(
    Guid Id,
    DateOnly Date,
    int Mood,
    int Energy,
    double? SleepHours,
    DateTime CreatedAt);
