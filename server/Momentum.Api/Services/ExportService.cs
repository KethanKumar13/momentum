using System.Globalization;
using System.Text;
using System.Text.Json;
using CsvHelper;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;

namespace Momentum.Api.Services;

public class ExportService
{
    private readonly AppDbContext _db;

    public ExportService(AppDbContext db) => _db = db;

    // ── JSON export — everything ──────────────────────────────
    public async Task<string> ExportJsonAsync(Guid userId)
    {
        var habits = await _db.Habits
            .Where(h => h.UserId == userId)
            .Include(h => h.Logs)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        var goals = await _db.Goals
            .Where(g => g.UserId == userId)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        var journal = await _db.JournalEntries
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Date)
            .ToListAsync();

        var reviews = await _db.WeeklyReviews
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.WeekStart)
            .ToListAsync();

        var payload = new
        {
            exportedAt = DateTime.UtcNow,
            goals = goals.Select(g => new
            {
                g.Id,
                g.Title,
                g.Why,
                g.Category,
                g.Status,
                g.ProgressPct,
                g.TargetDate,
                g.CreatedAt,
                g.UpdatedAt,
            }),
            habits = habits.Select(h => new
            {
                h.Id,
                h.Title,
                h.Type,
                h.FrequencyType,
                h.Color,
                h.Icon,
                h.CreatedAt,
                logs = h.Logs.Select(l => new
                {
                    l.Date,
                    l.Status,
                    l.Note,
                }),
            }),
            journal = journal.Select(e => new
            {
                e.Date,
                e.Title,
                e.Mood,
                e.Tags,
                content = e.Content,
            }),
            weeklyReviews = reviews.Select(r => new
            {
                r.WeekStart,
                r.Wins,
                r.Struggles,
                r.NextWeekFocus,
            }),
        };

        return JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });
    }

    // ── CSV export — habit logs flat table ────────────────────
    public async Task<string> ExportHabitLogsCsvAsync(Guid userId)
    {
        var rows = await _db.HabitLogs
            .Where(l => l.Habit.UserId == userId)
            .Include(l => l.Habit)
            .OrderBy(l => l.Date)
            .Select(l => new
            {
                Date = l.Date.ToString(),
                HabitTitle = l.Habit.Title,
                Status = l.Status,
                Note = l.Note ?? "",
            })
            .ToListAsync();

        using var mem = new StringWriter();
        using var writer = new CsvWriter(mem, CultureInfo.InvariantCulture);

        writer.WriteHeader(rows.FirstOrDefault()?.GetType() ?? typeof(object));
        await writer.NextRecordAsync();

        foreach (var row in rows)
        {
            writer.WriteRecord(row);
            await writer.NextRecordAsync();
        }

        return mem.ToString();
    }
}
