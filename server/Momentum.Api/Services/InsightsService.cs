using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class InsightsService
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;

    public InsightsService(AppDbContext db, FrequencyService freq)
    {
        _db = db;
        _freq = freq;
    }

    public async Task<InsightsResponse> GetAsync(Guid userId, int days = 35)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var startDate = today.AddDays(-(days - 1));

        var habits = await _db.Habits
            .Where(h => h.UserId == userId && h.ArchivedAt == null)
            .Include(h => h.Logs)
            .ToListAsync();

        var goals = await _db.Goals
            .Where(g => g.UserId == userId)
            .Include(g => g.Habits)
            .ToListAsync();

        var completedToday = habits.Count(h =>
            h.Logs.Any(l => l.Date == today && l.Status == "done"));

        var completionRate = habits.Count > 0
            ? (int)Math.Round((double)completedToday / habits.Count * 100)
            : 0;

        var longestStreak = habits.Count > 0
            ? habits.Max(h => ComputeLongestStreak(h))
            : 0;

        var currentBestStreak = habits.Count > 0
            ? habits.Max(h => ComputeCurrentStreak(h, today))
            : 0;

        var completedGoals = goals.Count(g => g.ProgressPct >= 100);

        var avgGoalProgress = goals.Count > 0
            ? (int)Math.Round(goals.Average(g => (double)g.ProgressPct))
            : 0;

        var totalLogs = habits.Sum(h => h.Logs.Count);

        var summary = new InsightsSummaryResponse(
            TotalHabits: habits.Count,
            CompletedToday: completedToday,
            CompletionRatePct: completionRate,
            LongestStreak: longestStreak,
            CurrentStreak: currentBestStreak,
            TotalGoals: goals.Count,
            CompletedGoals: completedGoals,
            AvgGoalProgressPct: avgGoalProgress,
            TotalHabitLogsAllTime: totalLogs
        );

        var heatmap = Enumerable.Range(0, days)
            .Select(i =>
            {
                var date = startDate.AddDays(i);

                var count = habits.Count(h =>
                    h.Logs.Any(l => l.Date == date && l.Status == "done"));

                return new HeatmapDayResponse(date, count, habits.Count);
            })
            .ToList();

        var last30Start = today.AddDays(-29);

        var last30Days = Enumerable.Range(0, 30)
            .Select(i => last30Start.AddDays(i))
            .ToList();

        var topHabits = habits
            .Select(h =>
            {
                var dueDays = last30Days.Count(d => _freq.IsDueToday(h, d));

                var doneDays = h.Logs.Count(l =>
                    l.Date >= last30Start &&
                    l.Date <= today &&
                    l.Status == "done");

                var consistency = dueDays > 0
                    ? Math.Round((double)doneDays / dueDays * 100, 1)
                    : 0;

                return new HabitStreakResponse(
                    Id: h.Id,
                    Title: h.Title,
                    Icon: h.Icon,
                    Color: h.Color,
                    CurrentStreak: ComputeCurrentStreak(h, today),
                    LongestStreak: ComputeLongestStreak(h),
                    TotalLogs: h.Logs.Count,
                    ConsistencyPct: consistency
                );
            })
            .OrderByDescending(h => h.CurrentStreak)
            .ThenByDescending(h => h.ConsistencyPct)
            .Take(5)
            .ToList();

        var goalList = goals
            .OrderByDescending(g => g.ProgressPct)
            .Select(g => new GoalProgressResponse(
                Id: g.Id,
                Title: g.Title,
                Category: g.Category,
                Status: g.Status,
                ProgressPct: g.ProgressPct,
                LinkedHabitsCount: g.Habits.Count
            ))
            .ToList();

        return new InsightsResponse(
            summary,
            heatmap,
            topHabits,
            goalList
        );
    }

    private static int ComputeCurrentStreak(Habit habit, DateOnly today)
    {
        var doneDates = habit.Logs
            .Where(l => l.Status is "done" or "skip")
            .Select(l => l.Date)
            .ToHashSet();

        int streak = 0;
        var day = today;

        while (doneDates.Contains(day))
        {
            streak++;
            day = day.AddDays(-1);
        }

        return streak;
    }

    private static int ComputeLongestStreak(Habit habit)
    {
        var doneDates = habit.Logs
            .Where(l => l.Status is "done" or "skip")
            .Select(l => l.Date)
            .OrderBy(d => d)
            .ToList();

        if (!doneDates.Any())
            return 0;

        int longest = 1;
        int current = 1;

        for (int i = 1; i < doneDates.Count; i++)
        {
            if (doneDates[i] == doneDates[i - 1].AddDays(1))
            {
                current++;

                if (current > longest)
                    longest = current;
            }
            else
            {
                current = 1;
            }
        }

        return longest;
    }
}
