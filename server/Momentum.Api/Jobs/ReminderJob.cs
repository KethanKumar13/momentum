using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.Services;

namespace Momentum.Api.Jobs;

/// <summary>
/// Runs daily at 8 AM — sends reminder emails to users
/// who have habits due today and haven't logged them yet.
/// Scheduled in Program.cs via Hangfire RecurringJob.
/// </summary>
public class ReminderJob
{
    private readonly AppDbContext _db;
    private readonly UserManager<User> _users;
    private readonly FrequencyService _freq;
    private readonly EmailService _email;
    private readonly ILogger<ReminderJob> _logger;

    public ReminderJob(
        AppDbContext db,
        UserManager<User> users,
        FrequencyService freq,
        EmailService email,
        ILogger<ReminderJob> logger)
    {
        _db = db;
        _users = users;
        _freq = freq;
        _email = email;
        _logger = logger;
    }

    public async Task RunAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        _logger.LogInformation(
            "ReminderJob running for {Date}",
            today);

        // Load all active users who have habits
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

            // Habits due today that haven't been logged
            var dueAndUnlogged = habits
                .Where(h =>
                    _freq.IsDueToday(h, today) &&
                    !h.Logs.Any(l =>
                        l.Date == today &&
                        l.Status == "done"))
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
