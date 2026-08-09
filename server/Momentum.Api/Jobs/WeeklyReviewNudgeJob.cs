using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Services;

namespace Momentum.Api.Jobs;

/// <summary>
/// Runs every Sunday at 6 PM — nudges users to write their weekly review.
/// Computes habit completion % for the week automatically.
/// </summary>
public class WeeklyReviewNudgeJob
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;
    private readonly EmailService _email;
    private readonly ILogger<WeeklyReviewNudgeJob> _logger;

    public WeeklyReviewNudgeJob(
        AppDbContext db,
        FrequencyService freq,
        EmailService email,
        ILogger<WeeklyReviewNudgeJob> logger)
    {
        _db = db;
        _freq = freq;
        _email = email;
        _logger = logger;
    }

    public async Task RunAsync()
    {
        // Monday = week start, Sunday = week end (today)
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var dayOfWeek = (int)today.DayOfWeek;
        var daysSinceMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1;

        var weekStart = today.AddDays(-daysSinceMonday);
        var weekEnd = today;

        _logger.LogInformation(
            "WeeklyReviewNudgeJob: week {Start}–{End}",
            weekStart,
            weekEnd);

        var usersWithHabits = await _db.Habits
            .Where(h => h.ArchivedAt == null)
            .Include(h => h.User)
            .Include(h => h.Logs)
            .GroupBy(h => h.User)
            .ToListAsync();

        foreach (var group in usersWithHabits)
        {
            var user = group.Key;
            var habits = group.ToList();

            if (string.IsNullOrEmpty(user.Email))
                continue;

            var weekDays = Enumerable.Range(0, 7)
                .Select(i => weekStart.AddDays(i))
                .ToList();

            var totalDue = habits.Sum(h =>
                weekDays.Count(d => _freq.IsDueToday(h, d)));

            var completions = habits.Sum(h =>
                h.Logs.Count(l =>
                    l.Date >= weekStart &&
                    l.Date <= weekEnd &&
                    l.Status == "done"));

            var pct = totalDue > 0
                ? (int)Math.Round((double)completions / totalDue * 100)
                : 0;

            await _email.SendWeeklyReviewNudgeAsync(
                user.Email,
                user.Name ?? "there",
                pct);

            _logger.LogInformation(
                "Sent weekly nudge to {Email} — {Pct}% completion",
                user.Email,
                pct);
        }
    }
}
