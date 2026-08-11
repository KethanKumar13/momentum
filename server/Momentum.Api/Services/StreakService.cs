using Momentum.Api.Domain;

namespace Momentum.Api.Services;

/// <summary>
/// Pure streak computations. All inputs are already in the user's local time.
///
/// Rules (from PRD §13.2):
///   - "done" and "skip" both preserve a streak.
///   - "miss" (or absence) breaks it.
///   - Current streak = consecutive days ending at 'today' where the habit
///     was done or skipped.
///   - Longest streak = max historical run of consecutive done/skip days.
/// </summary>
public class StreakService
{
    public int CurrentStreak(Habit habit, DateOnly today)
    {
        var kept = habit.Logs
            .Where(l => l.Status is "done" or "skip")
            .Select(l => l.Date)
            .ToHashSet();

        int streak = 0;
        var day = today;

        while (kept.Contains(day))
        {
            streak++;
            day = day.AddDays(-1);
        }

        return streak;
    }

    public int LongestStreak(Habit habit)
    {
        var kept = habit.Logs
            .Where(l => l.Status is "done" or "skip")
            .Select(l => l.Date)
            .OrderBy(d => d)
            .ToList();

        if (kept.Count == 0) return 0;

        int longest = 1;
        int current = 1;

        for (int i = 1; i < kept.Count; i++)
        {
            if (kept[i] == kept[i - 1].AddDays(1))
            {
                current++;
                if (current > longest) longest = current;
            }
            else
            {
                current = 1;
            }
        }

        return longest;
    }

    /// <summary>
    /// Consistency % over a window (default last 30 days).
    /// done ÷ dueDays. Returns 0 if no due days.
    /// </summary>
    public double ConsistencyPct(
        Habit habit,
        DateOnly windowStart,
        DateOnly windowEnd,
        FrequencyService freq)
    {
        int dueDays = 0;
        for (var d = windowStart; d <= windowEnd; d = d.AddDays(1))
        {
            if (freq.IsDueToday(habit, d)) dueDays++;
        }

        if (dueDays == 0) return 0;

        int doneDays = habit.Logs.Count(l =>
            l.Date >= windowStart &&
            l.Date <= windowEnd &&
            l.Status == "done");

        return Math.Round((double)doneDays / dueDays * 100, 1);
    }
}
