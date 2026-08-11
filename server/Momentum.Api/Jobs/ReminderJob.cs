using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Services;

namespace Momentum.Api.Jobs;

/// <summary>
/// Runs daily at 8 AM UTC — sends reminder emails to users who have
/// habits due today and haven't logged them yet.
/// </summary>
public class ReminderJob
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;
    private readonly EmailService _email;
    private readonly ILogger<ReminderJob> _logger;

    public ReminderJob(
        AppDbContext db,
        FrequencyService freq,
        EmailService email,
        ILogger<ReminderJob> logger)
    {
        _db = db;
        _freq = freq;
        _email = email;
        _logger = logger;
    }

    public async Task RunAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        _logger.LogInformation("ReminderJob running for {Date}", today);

        // Materialize first — EF cannot translate GroupBy(h => h.User)
        var habits = await _db.Habits
            .Where(h => h.ArchivedAt == null)
            .Include(h => h.User)
            .Include(h => h.Logs)
            .ToListAsync();

        var groups = habits.GroupBy(h => h.User);

        foreach (var group in groups)
        {
            var user = group.Key;
            if (user is null || string.IsNullOrEmpty(user.Email))
                continue;

            var dueAndUnlogged = group
                .Where(h =>
                    _freq.IsDueToday(h, today) &&
                    !h.Logs.Any(l => l.Date == today && l.Status == "done"))
                .ToList();

            if (dueAndUnlogged.Count == 0)
                continue;

            await _email.SendDailyReminderAsync(
                user.Email,
                user.Name ?? "there",
                dueAndUnlogged.Count);

            _logger.LogInformation(
                "Sent reminder to {Email} — {Count} habits due",
                user.Email,
                dueAndUnlogged.Count);
        }
    }
}
