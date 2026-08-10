using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;

namespace Momentum.Api.Services;

/// <summary>
/// Enforces free-plan limits.
/// Free: max 3 goals, max 5 habits.
/// Pro: unlimited.
/// </summary>
public class PlanGatingService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public PlanGatingService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    private int MaxGoals => _config.GetValue<int>("Plan:Free:MaxGoals", 3);
    private int MaxHabits => _config.GetValue<int>("Plan:Free:MaxHabits", 5);

    public async Task AssertCanCreateGoalAsync(Guid userId, string plan)
    {
        if (plan == "pro") return;

        var count = await _db.Goals
            .CountAsync(g => g.UserId == userId);

        if (count >= MaxGoals)
        {
            throw new InvalidOperationException(
                $"Free plan allows up to {MaxGoals} goals. Upgrade to Pro for unlimited goals.");
        }
    }

    public async Task AssertCanCreateHabitAsync(Guid userId, string plan)
    {
        if (plan == "pro") return;

        var count = await _db.Habits
            .CountAsync(h => h.UserId == userId && h.ArchivedAt == null);

        if (count >= MaxHabits)
        {
            throw new InvalidOperationException(
                $"Free plan allows up to {MaxHabits} active habits. Upgrade to Pro for unlimited habits.");
        }
    }
}
