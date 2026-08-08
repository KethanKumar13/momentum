using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class JournalService
{
    private readonly AppDbContext _db;

    public JournalService(AppDbContext db) => _db = db;

    // ── List all entries (desc) ───────────────────────────────
    public async Task<List<JournalEntryResponse>> GetAllAsync(Guid userId)
    {
        var entries = await _db.JournalEntries
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Date)
            .ToListAsync();

        return entries.Select(ToResponse).ToList();
    }

    // ── Get one by date ───────────────────────────────────────
    public async Task<JournalEntryResponse?> GetByDateAsync(
        Guid userId, DateOnly date)
    {
        var entry = await _db.JournalEntries
            .FirstOrDefaultAsync(e =>
                e.UserId == userId && e.Date == date);

        return entry is null ? null : ToResponse(entry);
    }

    // ── Upsert (PUT by date) ──────────────────────────────────
    public async Task<JournalEntryResponse> UpsertAsync(
        Guid userId, DateOnly date, UpsertJournalRequest req)
    {
        var entry = await _db.JournalEntries
            .FirstOrDefaultAsync(e =>
                e.UserId == userId && e.Date == date);

        if (entry is null)
        {
            entry = new JournalEntry
            {
                UserId  = userId,
                Date    = date,
                Content = req.Content,
                Mood    = req.Mood,
                Title   = req.Title,
                Tags    = req.Tags,
            };

            _db.JournalEntries.Add(entry);
        }
        else
        {
            entry.Content   = req.Content;
            entry.Mood      = req.Mood;
            entry.Title     = req.Title;
            entry.Tags      = req.Tags;
            entry.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return ToResponse(entry);
    }

    // ── Delete ────────────────────────────────────────────────
    public async Task DeleteAsync(Guid userId, DateOnly date)
    {
        var entry = await _db.JournalEntries
            .FirstOrDefaultAsync(e =>
                e.UserId == userId && e.Date == date);

        if (entry is not null)
        {
            _db.JournalEntries.Remove(entry);
            await _db.SaveChangesAsync();
        }
    }

    // ── Calendar summary ──────────────────────────────────────
    public async Task<List<JournalCalendarDay>> GetCalendarAsync(
        Guid userId, int year, int month)
    {
        var start = new DateOnly(year, month, 1);
        var end   = start.AddMonths(1).AddDays(-1);

        var entries = await _db.JournalEntries
            .Where(e =>
                e.UserId == userId &&
                e.Date   >= start &&
                e.Date   <= end)
            .OrderBy(e => e.Date)
            .Select(e => new JournalCalendarDay(e.Date, e.Mood, e.Title))
            .ToListAsync();

        return entries;
    }

    // ── Entries for a date range (used by WeeklyReview) ──────
    public async Task<List<JournalEntry>> GetRangeAsync(
        Guid userId, DateOnly from, DateOnly to) =>
        await _db.JournalEntries
            .Where(e =>
                e.UserId == userId &&
                e.Date   >= from &&
                e.Date   <= to)
            .ToListAsync();

    // ── Map ───────────────────────────────────────────────────
    private static JournalEntryResponse ToResponse(JournalEntry e) => new(
        e.Id,
        e.Date,
        e.Content,
        e.Mood,
        e.Title,
        e.Tags,
        e.CreatedAt,
        e.UpdatedAt
    );
}
