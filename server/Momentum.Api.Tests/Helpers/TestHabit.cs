using Momentum.Api.Domain;

namespace Momentum.Api.Tests.Helpers;

internal static class TestHabit
{
    public static Habit Build(
        string frequencyType = "daily",
        string frequencyConfig = "{}",
        params (DateOnly date, string status)[] logs)
    {
        var habit = new Habit
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test habit",
            FrequencyType = frequencyType,
            FrequencyConfig = frequencyConfig,
        };

        foreach (var (date, status) in logs)
        {
            habit.Logs.Add(new HabitLog
            {
                Id = Guid.NewGuid(),
                HabitId = habit.Id,
                UserId = habit.UserId,
                Date = date,
                Status = status,
            });
        }

        return habit;
    }
}
