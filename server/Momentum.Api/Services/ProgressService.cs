using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;

namespace Momentum.Api.Services;

public class ProgressService
{
    private readonly AppDbContext _db;

    public ProgressService(AppDbContext db) => _db = db;

    /// <summary>
    /// Recomputes and saves the ProgressPct for a goal.
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
            goal.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return;
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var startDate = today.AddDays(-30);

        var consistencies = goal.Habits.Select(habit =>
        {
            var dueDays = Enumerable.Range(0, 30)
                .Select(i => startDate.AddDays(i))
                .Count(_ => true);

            var doneDays = habit.Logs.Count(l =>
                l.Date >= startDate &&
                l.Date <= today &&
                l.Status == "done");

            return dueDays == 0
                ? 0.0
                : (double)doneDays / dueDays * 100;
        });

        goal.ProgressPct = (int)Math.Round(consistencies.Average());
        goal.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }
}