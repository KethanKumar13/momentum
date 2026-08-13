using System.Text.Json;
using System.Text.Json.Serialization;
using Momentum.Api.Domain;

namespace Momentum.Api.Services;

public class FrequencyService
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    /// <summary>
    /// Returns true if the habit is due on the given local date.
    /// </summary>
    public bool IsDueToday(Habit habit, DateOnly localDate) =>
        habit.FrequencyType switch
        {
            "daily"         => true,
            "weekly_count"  => IsWeeklyCountDue(habit, localDate),
            "specific_days" => IsSpecificDayDue(habit, localDate),
            _               => true,
        };

    // weekly_count: {"count": 3}
    // Due until the habit has been marked done N times in the current ISO week.
    private static bool IsWeeklyCountDue(Habit habit, DateOnly localDate)
    {
        try
        {
            var cfg = JsonSerializer.Deserialize<WeeklyCountConfig>(
                habit.FrequencyConfig, JsonOpts);

            int count = cfg?.Count ?? 1;

            var weekStart = TimezoneService.IsoWeekStart(localDate);
            var weekEnd = weekStart.AddDays(6);

            int doneSoFar = habit.Logs.Count(l =>
                l.Date >= weekStart &&
                l.Date <= weekEnd &&
                l.Status == "done");

            return doneSoFar < count;
        }
        catch
        {
            return true;
        }
    }

    // specific_days: {"days": [1,3,5]} — 1=Monday … 7=Sunday (ISO).
    private static bool IsSpecificDayDue(Habit habit, DateOnly localDate)
    {
        try
        {
            var cfg = JsonSerializer.Deserialize<SpecificDaysConfig>(
                habit.FrequencyConfig, JsonOpts);

            int dow = (int)localDate.DayOfWeek;  // Sunday=0..Saturday=6
            int iso = dow == 0 ? 7 : dow;

            return cfg?.Days?.Contains(iso) ?? false;
        }
        catch
        {
            return false;
        }
    }

    private record WeeklyCountConfig(
        [property: JsonPropertyName("count")] int Count);

    private record SpecificDaysConfig(
        [property: JsonPropertyName("days")] List<int> Days);
}
