using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.Services;

namespace Momentum.Api.Tests;

public class ProgressServiceTests : IDisposable
{
    private readonly AppDbContext _db;

    public ProgressServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new AppDbContext(options);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task Recompute_NoHabits_ZeroPercent()
    {
        var userId = Guid.NewGuid();

        var goal = new Goal
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "G",
            Category = "Health",
            ProgressPct = 42,
        };

        _db.Goals.Add(goal);
        await _db.SaveChangesAsync();

        var svc = new ProgressService(_db, new FrequencyService());
        await svc.RecomputeAsync(goal.Id);

        var reloaded = await _db.Goals.FindAsync(goal.Id);
        reloaded!.ProgressPct.Should().Be(0);
    }

    [Fact]
    public async Task Recompute_MissingGoal_NoThrow()
    {
        var svc = new ProgressService(_db, new FrequencyService());
        var act = () => svc.RecomputeAsync(Guid.NewGuid());

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task Recompute_HabitAllDone_Returns100()
    {
        var userId = Guid.NewGuid();

        var goal = new Goal
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Fit",
            Category = "Health",
        };

        var habit = new Habit
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GoalId = goal.Id,
            Title = "Run",
            FrequencyType = "daily",
            FrequencyConfig = "{}",
        };

        // Mark every day of last 30 as done
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        for (int i = 0; i < 30; i++)
        {
            habit.Logs.Add(new HabitLog
            {
                Id = Guid.NewGuid(),
                HabitId = habit.Id,
                UserId = userId,
                Date = today.AddDays(-i),
                Status = "done",
            });
        }

        _db.Goals.Add(goal);
        _db.Habits.Add(habit);
        await _db.SaveChangesAsync();

        var svc = new ProgressService(_db, new FrequencyService());
        await svc.RecomputeAsync(goal.Id);

        var reloaded = await _db.Goals.FindAsync(goal.Id);
        reloaded!.ProgressPct.Should().Be(100);
    }

    [Fact]
    public async Task Recompute_HalfDone_ReturnsAround50()
    {
        var userId = Guid.NewGuid();

        var goal = new Goal
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Fit",
            Category = "Health",
        };

        var habit = new Habit
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GoalId = goal.Id,
            Title = "Run",
            FrequencyType = "daily",
            FrequencyConfig = "{}",
        };

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Only every other day done
        for (int i = 0; i < 30; i += 2)
        {
            habit.Logs.Add(new HabitLog
            {
                Id = Guid.NewGuid(),
                HabitId = habit.Id,
                UserId = userId,
                Date = today.AddDays(-i),
                Status = "done",
            });
        }

        _db.Goals.Add(goal);
        _db.Habits.Add(habit);
        await _db.SaveChangesAsync();

        var svc = new ProgressService(_db, new FrequencyService());
        await svc.RecomputeAsync(goal.Id);

        var reloaded = await _db.Goals.FindAsync(goal.Id);
        reloaded!.ProgressPct.Should().BeInRange(45, 55);
    }

    [Fact]
    public async Task Recompute_AveragesAcrossHabits()
    {
        var userId = Guid.NewGuid();

        var goal = new Goal
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Fit",
            Category = "Health",
        };

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var habit100 = new Habit
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GoalId = goal.Id,
            Title = "A",
            FrequencyType = "daily",
            FrequencyConfig = "{}",
        };

        for (int i = 0; i < 30; i++)
        {
            habit100.Logs.Add(new HabitLog
            {
                Id = Guid.NewGuid(),
                HabitId = habit100.Id,
                UserId = userId,
                Date = today.AddDays(-i),
                Status = "done",
            });
        }

        var habit0 = new Habit
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GoalId = goal.Id,
            Title = "B",
            FrequencyType = "daily",
            FrequencyConfig = "{}",
        };

        // no logs

        _db.Goals.Add(goal);
        _db.Habits.AddRange(habit100, habit0);
        await _db.SaveChangesAsync();

        var svc = new ProgressService(_db, new FrequencyService());
        await svc.RecomputeAsync(goal.Id);

        var reloaded = await _db.Goals.FindAsync(goal.Id);
        reloaded!.ProgressPct.Should().Be(50); // (100 + 0) / 2
    }
}
