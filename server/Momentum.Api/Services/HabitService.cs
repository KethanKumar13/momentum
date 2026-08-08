using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class HabitService
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;

    public HabitService(AppDbContext db, FrequencyService freq)
    {
        _db   = db;
        _freq = freq;
    }

    // ── List (active) ─────────────────────────────────────────
    public async Task<List<HabitResponse>> GetAllAsync(Guid userId)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var habits = await _db.Habits
            .Where(h => h.UserId == userId && h.ArchivedAt == null)
            .Include(h => h.Logs)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        return habits.Select(h => ToResponse(h, today)).ToList();
    }

    // ── Get one ───────────────────────────────────────────────
    public async Task<HabitResponse> GetAsync(Guid id, Guid userId)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var habit = await _db.Habits
            .Include(h => h.Logs)
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        return ToResponse(habit, today);
    }

    // ── Get raw entity (for controller side-effects) ──────────
    public async Task<Habit?> GetRawAsync(Guid id, Guid userId) =>
        await _db.Habits
            .AsNoTracking()
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

    // ── Create ────────────────────────────────────────────────
    public async Task<HabitResponse> CreateAsync(
        CreateHabitRequest req,
        Guid userId)
    {
        var habit = new Habit
        {
            UserId          = userId,
            Title           = req.Title,
            Type            = req.Type,
            FrequencyType   = req.FrequencyType,
            FrequencyConfig = req.FrequencyConfig,
            ReminderTime    = req.ReminderTime,
            Color           = req.Color,
            Icon            = req.Icon,
            GoalId          = req.GoalId,
        };

        _db.Habits.Add(habit);
        await _db.SaveChangesAsync();

        return ToResponse(habit, DateOnly.FromDateTime(DateTime.UtcNow));
    }

    // ── Update ────────────────────────────────────────────────
    public async Task<HabitResponse> UpdateAsync(
        Guid id,
        UpdateHabitRequest req,
        Guid userId)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var habit = await _db.Habits
            .Include(h => h.Logs)
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        if (req.Title           is not null) habit.Title           = req.Title;
        if (req.Type            is not null) habit.Type            = req.Type;
        if (req.FrequencyType   is not null) habit.FrequencyType   = req.FrequencyType;
        if (req.FrequencyConfig is not null) habit.FrequencyConfig = req.FrequencyConfig;
        if (req.ReminderTime.HasValue)       habit.ReminderTime    = req.ReminderTime;
        if (req.Color           is not null) habit.Color            = req.Color;
        if (req.Icon            is not null) habit.Icon             = req.Icon;

        habit.GoalId    = req.GoalId;
        habit.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToResponse(habit, today);
    }

    // ── Archive ───────────────────────────────────────────────
    public async Task ArchiveAsync(Guid id, Guid userId)
    {
        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        habit.ArchivedAt = DateTime.UtcNow;
        habit.UpdatedAt  = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    // ── Delete ────────────────────────────────────────────────
    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        _db.Habits.Remove(habit);
        await _db.SaveChangesAsync();
    }

    // ── Get logs ──────────────────────────────────────────────
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

    // ── Log (upsert) ──────────────────────────────────────────
    public async Task<HabitLogResponse> LogAsync(
        Guid habitId,
        LogHabitRequest req,
        Guid userId)
    {
        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId)
            ?? throw new KeyNotFoundException("Habit not found.");

        var date = req.Date ?? DateOnly.FromDateTime(DateTime.UtcNow);

        var log = await _db.HabitLogs
            .FirstOrDefaultAsync(l => l.HabitId == habitId && l.Date == date);

        if (log is null)
        {
            log = new HabitLog
            {
                HabitId = habitId,
                UserId  = userId,
                Date    = date,
                Status  = req.Status,
                Note    = req.Note,
            };

            _db.HabitLogs.Add(log);
        }
        else
        {
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
            log.Note   = req.Note;
        }

        await _db.SaveChangesAsync();
        return ToLogResponse(log);
    }

    // ── Unlog ─────────────────────────────────────────────────
    public async Task UnlogAsync(
        Guid habitId,
        DateOnly date,
        Guid userId)
    {
        var log = await _db.HabitLogs
            .FirstOrDefaultAsync(l =>
                l.HabitId == habitId &&
                l.Date    == date &&
                l.UserId  == userId);

        if (log is not null)
        {
            _db.HabitLogs.Remove(log);
            await _db.SaveChangesAsync();
        }
    }

    // ── Streak helpers ────────────────────────────────────────
    private static int ComputeCurrentStreak(
        Habit habit,
        DateOnly today)
    {
        var doneDates = habit.Logs
            .Where(l => l.Status is "done" or "skip")
            .Select(l => l.Date)
            .ToHashSet();

        int streak = 0;
        var day    = today;

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
        ComputeCurrentStreak(h, today),
        ComputeLongestStreak(h),
        h.ArchivedAt,
        h.CreatedAt,
        h.UpdatedAt
    );

    private static HabitLogResponse ToLogResponse(HabitLog l) => new(
        l.Id,
        l.HabitId,
        l.Date,
        l.Status,
        l.Note,
        l.CreatedAt
    );
}