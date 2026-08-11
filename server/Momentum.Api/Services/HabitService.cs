using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class HabitService
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;
    private readonly StreakService _streaks;
    private readonly TimezoneService _tz;
    private readonly UserManager<User> _users;
    private readonly PlanGatingService _gating;

    public HabitService(
        AppDbContext db,
        FrequencyService freq,
        StreakService streaks,
        TimezoneService tz,
        UserManager<User> users,
        PlanGatingService gating)
    {
        _db = db;
        _freq = freq;
        _streaks = streaks;
        _tz = tz;
        _users = users;
        _gating = gating;
    }

    // ── List (active) ─────────────────────────────────────────
    public async Task<List<HabitResponse>> GetAllAsync(Guid userId)
    {
        var user = await _users.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        var today = _tz.Today(user);

        var habits = await _db.Habits
            .Where(h => h.UserId == userId && h.ArchivedAt == null)
            .Include(h => h.Logs)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        return habits.Select(h => ToResponse(h, today)).ToList();
    }

    public async Task<HabitResponse> GetAsync(Guid id, Guid userId)
    {
        var user = await _users.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        var today = _tz.Today(user);

        var habit = await _db.Habits
            .Include(h => h.Logs)
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        return ToResponse(habit, today);
    }

    public async Task<Habit?> GetRawAsync(Guid id, Guid userId) =>
        await _db.Habits.AsNoTracking()
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

    // ── Create (with plan gating) ─────────────────────────────
    public async Task<HabitResponse> CreateAsync(CreateHabitRequest req, Guid userId)
    {
        var user = await _users.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        await _gating.AssertCanCreateHabitAsync(userId, user.Plan);

        var habit = new Habit
        {
            UserId = userId,
            Title = req.Title,
            Type = req.Type,
            FrequencyType = req.FrequencyType,
            FrequencyConfig = req.FrequencyConfig,
            ReminderTime = req.ReminderTime,
            Color = req.Color,
            Icon = req.Icon,
            GoalId = req.GoalId,
        };

        _db.Habits.Add(habit);
        await _db.SaveChangesAsync();

        return ToResponse(habit, _tz.Today(user));
    }

    public async Task<HabitResponse> UpdateAsync(
        Guid id,
        UpdateHabitRequest req,
        Guid userId)
    {
        var user = await _users.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        var today = _tz.Today(user);

        var habit = await _db.Habits
            .Include(h => h.Logs)
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        if (req.Title is not null)
            habit.Title = req.Title;

        if (req.Type is not null)
            habit.Type = req.Type;

        if (req.FrequencyType is not null)
            habit.FrequencyType = req.FrequencyType;

        if (req.FrequencyConfig is not null)
            habit.FrequencyConfig = req.FrequencyConfig;

        if (req.ReminderTime.HasValue)
            habit.ReminderTime = req.ReminderTime;

        if (req.Color is not null)
            habit.Color = req.Color;

        if (req.Icon is not null)
            habit.Icon = req.Icon;

        habit.GoalId = req.GoalId;
        habit.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return ToResponse(habit, today);
    }

    public async Task ArchiveAsync(Guid id, Guid userId)
    {
        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        habit.ArchivedAt = DateTime.UtcNow;
        habit.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        _db.Habits.Remove(habit);
        await _db.SaveChangesAsync();
    }

    public async Task<List<HabitLogResponse>> GetLogsAsync(
        Guid habitId,
        Guid userId)
    {
        var exists = await _db.Habits
            .AnyAsync(h => h.Id == habitId && h.UserId == userId);

        if (!exists)
            throw new KeyNotFoundException("Habit not found.");

        var logs = await _db.HabitLogs
            .Where(l => l.HabitId == habitId)
            .OrderByDescending(l => l.Date)
            .ToListAsync();

        return logs.Select(ToLogResponse).ToList();
    }

    public async Task<HabitLogResponse> LogAsync(
        Guid habitId,
        LogHabitRequest req,
        Guid userId)
    {
        var user = await _users.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found.");

        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        var date = req.Date ?? _tz.Today(user);

        var log = await _db.HabitLogs
            .FirstOrDefaultAsync(l =>
                l.HabitId == habitId &&
                l.Date == date);

        if (log is null)
        {
            log = new HabitLog
            {
                HabitId = habitId,
                UserId = userId,
                Date = date,
                Status = req.Status,
                Note = req.Note,
            };

            _db.HabitLogs.Add(log);
        }
        else
        {
            // Toggle-off: same status "done" posted twice removes the log
            if (log.Status == req.Status && req.Status == "done")
            {
                _db.HabitLogs.Remove(log);
                await _db.SaveChangesAsync();

                return new HabitLogResponse(
                    Guid.Empty,
                    habitId,
                    date,
                    "none",
                    null,
                    DateTime.UtcNow);
            }

            log.Status = req.Status;
            log.Note = req.Note;
        }

        await _db.SaveChangesAsync();

        return ToLogResponse(log);
    }

    public async Task UnlogAsync(
        Guid habitId,
        DateOnly date,
        Guid userId)
    {
        var log = await _db.HabitLogs
            .FirstOrDefaultAsync(l =>
                l.HabitId == habitId &&
                l.Date == date &&
                l.UserId == userId);

        if (log is not null)
        {
            _db.HabitLogs.Remove(log);
            await _db.SaveChangesAsync();
        }
    }

    // ── Heatmap (per-habit yearly) ────────────────────────────
    public async Task<List<object>> GetHeatmapAsync(
        Guid habitId,
        Guid userId,
        int year)
    {
        var habit = await _db.Habits
            .Include(h => h.Logs)
            .FirstOrDefaultAsync(h =>
                h.Id == habitId &&
                h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        var start = new DateOnly(year, 1, 1);
        var end = new DateOnly(year, 12, 31);

        var days = new List<object>();

        for (var d = start; d <= end; d = d.AddDays(1))
        {
            var log = habit.Logs.FirstOrDefault(l => l.Date == d);

            days.Add(new
            {
                date = d,
                status = log?.Status ?? "none",
            });
        }

        return days;
    }

    // ── Map ───────────────────────────────────────────────────
    private HabitResponse ToResponse(
        Habit h,
        DateOnly today) => new(
        h.Id,
        h.Title,
        h.Type,
        h.FrequencyType,
        h.FrequencyConfig,
        h.ReminderTime,
        h.Color,
        h.Icon,
        h.GoalId,
        _freq.IsDueToday(h, today),
        _streaks.CurrentStreak(h, today),
        _streaks.LongestStreak(h),
        h.ArchivedAt,
        h.CreatedAt,
        h.UpdatedAt);

    private static HabitLogResponse ToLogResponse(HabitLog l) => new(
        l.Id,
        l.HabitId,
        l.Date,
        l.Status,
        l.Note,
        l.CreatedAt);
}
