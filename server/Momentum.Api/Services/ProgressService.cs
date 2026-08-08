using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;

namespace Momentum.Api.Services;

public class ProgressService
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;

    public ProgressService(AppDbContext db, FrequencyService freq)
    {
        _db   = db;
        _freq = freq;
    }

    /// <summary>
    /// Recomputes and saves ProgressPct for a goal.
    /// Progress = average consistency % of linked habits over last 30 days.
    /// </summary>
    public async Task RecomputeAsync(Guid goalId)
    {
        var goal = await _db.Goals
            .Include(g => g.Habits)
            .ThenInclude(h => h.Logs)
            .FirstOrDefaultAsync(g => g.Id == goalId);

        if (goal is null) return;

        if (!goal.Habits.Any())
        {
            goal.ProgressPct = 0;
            goal.UpdatedAt   = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return;
        }

        var today     = DateOnly.FromDateTime(DateTime.UtcNow);
        var startDate = today.AddDays(-29);

        var last30 = Enumerable.Range(0, 30)
            .Select(i => startDate.AddDays(i))
            .ToList();

        var consistencies = goal.Habits.Select(habit =>
        {
            var dueDays = last30.Count(d => _freq.IsDueToday(habit, d));

            if (dueDays == 0) return 0.0;

            var doneDays = habit.Logs.Count(l =>
                l.Date >= startDate &&
                l.Date <= today &&
                l.Status == "done");

            return (double)doneDays / dueDays * 100.0;
        });

        goal.ProgressPct = (int)Math.Round(consistencies.Average());
        goal.UpdatedAt   = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }
}