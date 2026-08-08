using System.Text.Json;
using Momentum.Api.Domain;

namespace Momentum.Api.Services;

public class FrequencyService
{
    /// <summary>
    /// Returns true if the habit is due on the given local date.
    /// </summary>
    public bool IsDueToday(Habit habit, DateOnly localDate)
    {
        return habit.FrequencyType switch
        {
            "daily" => true,
            "weekly_count" => IsWeeklyCountDue(habit, localDate),
            "specific_days" => IsSpecificDayDue(habit, localDate),
            _ => true,
        };
    }

    // weekly_count: {"count": 3}
    // Due if the number of "done" logs this ISO week < count
    private static bool IsWeeklyCountDue(Habit habit, DateOnly localDate)
    {
        try
        {
            var cfg = JsonSerializer.Deserialize<WeeklyCountConfig>(
                habit.FrequencyConfig
            );

            int count = cfg?.Count ?? 1;

            var weekStart = localDate.AddDays(
                -(int)localDate.DayOfWeek
            );

            var weekEnd = weekStart.AddDays(6);

            int doneSoFar = habit.Logs.Count(l =>
                l.Date >= weekStart &&
                l.Date <= weekEnd &&
                l.Status == "done"
            );

            return doneSoFar < count;
        }
        catch
        {
            return true;
        }
    }

    // specific_days: {"days": [1,3,5]}
    // 1=Monday … 7=Sunday (ISO)
    private static bool IsSpecificDayDue(
        Habit habit,
        DateOnly localDate)
    {
        try
        {
            var cfg = JsonSerializer.Deserialize<SpecificDaysConfig>(
                habit.FrequencyConfig
            );

            int dow = (int)localDate.DayOfWeek; // 0=Sun … 6=Sat
            int iso = dow == 0 ? 7 : dow;

            return cfg?.Days?.Contains(iso) ?? false;
        }
        catch
        {
            return false;
        }
    }

    private record WeeklyCountConfig(int Count);

    private record SpecificDaysConfig(List<int> Days);
}