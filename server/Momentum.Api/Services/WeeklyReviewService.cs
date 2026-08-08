using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class WeeklyReviewService
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;

    public WeeklyReviewService(AppDbContext db, FrequencyService freq)
    {
        _db = db;
        _freq = freq;
    }

    // ── Get review for a week start ───────────────────────────
    public async Task<WeeklyReviewResponse?> GetAsync(
        Guid userId, DateOnly weekStart)
    {
        var review = await _db.WeeklyReviews
            .FirstOrDefaultAsync(r =>
                r.UserId == userId &&
                r.WeekStart == weekStart);

        var stats = await ComputeStatsAsync(userId, weekStart);

        if (review is null)
            return new WeeklyReviewResponse(
                Guid.Empty,
                weekStart,
                null,
                null,
                null,
                DateTime.UtcNow,
                DateTime.UtcNow,
                stats);

        return ToResponse(review, stats);
    }

    // ── List past reviews ─────────────────────────────────────
    public async Task<List<WeeklyReviewResponse>> GetAllAsync(Guid userId)
    {
        var reviews = await _db.WeeklyReviews
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.WeekStart)
            .Take(12)
            .ToListAsync();

        var result = new List<WeeklyReviewResponse>();

        foreach (var r in reviews)
        {
            var stats = await ComputeStatsAsync(userId, r.WeekStart);
            result.Add(ToResponse(r, stats));
        }

        return result;
    }

    // ── Upsert ────────────────────────────────────────────────
    public async Task<WeeklyReviewResponse> UpsertAsync(
        Guid userId,
        DateOnly weekStart,
        UpsertWeeklyReviewRequest req)
    {
        var review = await _db.WeeklyReviews
            .FirstOrDefaultAsync(r =>
                r.UserId == userId &&
                r.WeekStart == weekStart);

        if (review is null)
        {
            review = new WeeklyReview
            {
                UserId = userId,
                WeekStart = weekStart,
                Wins = req.Wins,
                Struggles = req.Struggles,
                NextWeekFocus = req.NextWeekFocus,
            };

            _db.WeeklyReviews.Add(review);
        }
        else
        {
            review.Wins = req.Wins;
            review.Struggles = req.Struggles;
            review.NextWeekFocus = req.NextWeekFocus;
            review.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        var stats = await ComputeStatsAsync(userId, weekStart);

        return ToResponse(review, stats);
    }

    // ── Auto-compute stats for a week ─────────────────────────
    private async Task<WeekStatsResponse> ComputeStatsAsync(
        Guid userId,
        DateOnly weekStart)
    {
        var weekEnd = weekStart.AddDays(6);

        var habits = await _db.Habits
            .Where(h => h.UserId == userId && h.ArchivedAt == null)
            .Include(h => h.Logs)
            .ToListAsync();

        var weekDays = Enumerable.Range(0, 7)
            .Select(i => weekStart.AddDays(i))
            .ToList();

        var completions = habits.Sum(h =>
            h.Logs.Count(l =>
                l.Date >= weekStart &&
                l.Date <= weekEnd &&
                l.Status == "done"));

        var totalDue = habits.Sum(h =>
            weekDays.Count(d => _freq.IsDueToday(h, d)));

        var completionPct = totalDue > 0
            ? (int)Math.Round((double)completions / totalDue * 100)
            : 0;

        var bestStreak = habits.Count > 0
            ? habits.Max(h => ComputeCurrentStreak(h, weekEnd))
            : 0;

        var journalEntries = await _db.JournalEntries
            .CountAsync(e =>
                e.UserId == userId &&
                e.Date >= weekStart &&
                e.Date <= weekEnd);

        var goalsProgressed = await _db.Goals
            .CountAsync(g =>
                g.UserId == userId &&
                g.UpdatedAt >= weekStart.ToDateTime(TimeOnly.MinValue) &&
                g.UpdatedAt <= weekEnd.ToDateTime(TimeOnly.MaxValue));

        var mostConsistent = habits
            .OrderByDescending(h =>
                h.Logs.Count(l =>
                    l.Date >= weekStart &&
                    l.Date <= weekEnd &&
                    l.Status == "done"))
            .FirstOrDefault();

        return new WeekStatsResponse(
            TotalHabits: habits.Count,
            HabitCompletions: completions,
            HabitCompletionPct: completionPct,
            BestStreak: bestStreak,
            JournalEntries: journalEntries,
            GoalsProgressed: goalsProgressed,
            MostConsistentHabit: mostConsistent?.Title ?? ""
        );
    }

    private static int ComputeCurrentStreak(
        Habit habit,
        DateOnly asOf)
    {
        var done = habit.Logs
            .Where(l => l.Status is "done" or "skip")
            .Select(l => l.Date)
            .ToHashSet();

        int streak = 0;
        var day = asOf;

        while (done.Contains(day))
        {
            streak++;
            day = day.AddDays(-1);
        }

        return streak;
    }

    private static WeeklyReviewResponse ToResponse(
        WeeklyReview r,
        WeekStatsResponse stats) => new(
            r.Id,
            r.WeekStart,
            r.Wins,
            r.Struggles,
            r.NextWeekFocus,
            r.CreatedAt,
            r.UpdatedAt,
            stats);
}
