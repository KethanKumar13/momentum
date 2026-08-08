using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class GoalService
{
    private readonly AppDbContext _db;

    public GoalService(AppDbContext db) => _db = db;

    // ── List ──────────────────────────────────────────────────
    public async Task<List<GoalResponse>> GetAllAsync(Guid userId)
    {
        var goals = await _db.Goals
            .Where(g => g.UserId == userId)
            .Include(g => g.Habits)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        return goals.Select(ToResponse).ToList();
    }

    // ── Get one ───────────────────────────────────────────────
    public async Task<GoalResponse> GetAsync(Guid id, Guid userId)
    {
        var goal = await _db.Goals
            .Include(g => g.Habits)
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        return ToResponse(goal);
    }

    // ── Create ────────────────────────────────────────────────
    public async Task<GoalResponse> CreateAsync(
        CreateGoalRequest req,
        Guid userId)
    {
        var goal = new Goal
        {
            UserId = userId,
            Title = req.Title,
            Why = req.Why,
            Category = req.Category,
            TargetDate = req.TargetDate,
            Status = req.Status,
        };

        _db.Goals.Add(goal);
        await _db.SaveChangesAsync();

        return ToResponse(goal);
    }

    // ── Update ────────────────────────────────────────────────
    public async Task<GoalResponse> UpdateAsync(
        Guid id,
        UpdateGoalRequest req,
        Guid userId)
    {
        var goal = await _db.Goals
            .Include(g => g.Habits)
            .FirstOrDefaultAsync(
                g => g.Id == id && g.UserId == userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        if (req.Title is not null)
            goal.Title = req.Title;

        if (req.Why is not null)
            goal.Why = req.Why;

        if (req.Category is not null)
            goal.Category = req.Category;

        if (req.TargetDate.HasValue)
            goal.TargetDate = req.TargetDate;

        if (req.Status is not null)
            goal.Status = req.Status;

        if (req.ProgressPct.HasValue)
            goal.ProgressPct = req.ProgressPct.Value;

        goal.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return ToResponse(goal);
    }

    // ── Delete ────────────────────────────────────────────────
    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var goal = await _db.Goals
            .FirstOrDefaultAsync(
                g => g.Id == id && g.UserId == userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        _db.Goals.Remove(goal);

        await _db.SaveChangesAsync();
    }

    // ── Map ───────────────────────────────────────────────────
    private static GoalResponse ToResponse(Goal g) => new(
        g.Id,
        g.Title,
        g.Why,
        g.Category,
        g.TargetDate,
        g.Status,
        g.ProgressPct,
        g.CreatedAt,
        g.UpdatedAt,
        g.Habits
            .Select(h => new HabitSummary(
                h.Id,
                h.Title,
                h.Icon,
                h.Color))
            .ToList()
    );
}