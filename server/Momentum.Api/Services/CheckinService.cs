using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class CheckinService
{
    private readonly AppDbContext _db;

    public CheckinService(AppDbContext db) => _db = db;

    public async Task<CheckinResponse?> GetAsync(Guid userId, DateOnly date)
    {
        var c = await _db.DailyCheckins
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.Date == date);

        return c is null ? null : ToResponse(c);
    }

    public async Task<List<CheckinResponse>> RangeAsync(
        Guid userId,
        DateOnly from,
        DateOnly to)
    {
        var list = await _db.DailyCheckins
            .Where(c =>
                c.UserId == userId &&
                c.Date >= from &&
                c.Date <= to)
            .OrderBy(c => c.Date)
            .ToListAsync();

        return list.Select(ToResponse).ToList();
    }

    public async Task<CheckinResponse> UpsertAsync(
        Guid userId,
        UpsertCheckinRequest req)
    {
        if (req.Mood is < 1 or > 5)
            throw new ArgumentException("Mood must be 1..5.");

        if (req.Energy is < 1 or > 5)
            throw new ArgumentException("Energy must be 1..5.");

        var existing = await _db.DailyCheckins
            .FirstOrDefaultAsync(c =>
                c.UserId == userId &&
                c.Date == req.Date);

        if (existing is null)
        {
            existing = new DailyCheckin
            {
                UserId = userId,
                Date = req.Date,
                Mood = req.Mood,
                Energy = req.Energy,
                SleepHours = req.SleepHours,
            };

            _db.DailyCheckins.Add(existing);
        }
        else
        {
            existing.Mood = req.Mood;
            existing.Energy = req.Energy;
            existing.SleepHours = req.SleepHours;
        }

        await _db.SaveChangesAsync();

        return ToResponse(existing);
    }

    private static CheckinResponse ToResponse(DailyCheckin c) => new(
        c.Id,
        c.Date,
        c.Mood,
        c.Energy,
        c.SleepHours,
        c.CreatedAt);
}
