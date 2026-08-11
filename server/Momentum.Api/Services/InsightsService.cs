using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class InsightsService
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;
    private readonly StreakService _streaks;
    private readonly TimezoneService _tz;
    private readonly UserManager<User> _users;

    public InsightsService(
        AppDbContext db,
        FrequencyService freq,
        StreakService streaks,
        TimezoneService tz,
        UserManager<User> users)
    {
        _db = db;
        _freq = freq;
        _streaks = streaks;
        _tz = tz;
        _users = users;
    }

    public async Task<InsightsResponse> GetAsync(Guid userId, int days = 35)
    {
        var user = await _users.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        var today = _tz.Today(user);
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
            ? habits.Max(_streaks.LongestStreak)
            : 0;

        var currentBestStreak = habits.Count > 0
            ? habits.Max(h => _streaks.CurrentStreak(h, today))
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
            TotalHabitLogsAllTime: totalLogs);

        var heatmap = Enumerable.Range(0, days)
            .Select(i =>
            {
                var date = startDate.AddDays(i);

                var count = habits.Count(h =>
                    h.Logs.Any(l =>
                        l.Date == date &&
                        l.Status == "done"));

                return new HeatmapDayResponse(
                    date,
                    count,
                    habits.Count);
            })
            .ToList();

        var last30Start = today.AddDays(-29);

        var topHabits = habits
            .Select(h => new HabitStreakResponse(
                Id: h.Id,
                Title: h.Title,
                Icon: h.Icon,
                Color: h.Color,
                CurrentStreak: _streaks.CurrentStreak(h, today),
                LongestStreak: _streaks.LongestStreak(h),
                TotalLogs: h.Logs.Count,
                ConsistencyPct: _streaks.ConsistencyPct(
                    h,
                    last30Start,
                    today,
                    _freq)))
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
                LinkedHabitsCount: g.Habits.Count))
            .ToList();

        return new InsightsResponse(
            summary,
            heatmap,
            topHabits,
            goalList);
    }
}
