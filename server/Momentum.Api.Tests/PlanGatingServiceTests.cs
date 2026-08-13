using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.Services;

namespace Momentum.Api.Tests;

public class PlanGatingServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public PlanGatingServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new AppDbContext(options);

        _config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Plan:Free:MaxGoals"] = "3",
                ["Plan:Free:MaxHabits"] = "5",
            })
            .Build();
    }

    public void Dispose() => _db.Dispose();

    // ── Goals ────────────────────────────────────────────────
    [Fact]
    public async Task Free_UnderGoalCap_Allowed()
    {
        var userId = Guid.NewGuid();

        _db.Goals.Add(new Goal
        {
            UserId = userId,
            Title = "A",
            Category = "X"
        });

        _db.Goals.Add(new Goal
        {
            UserId = userId,
            Title = "B",
            Category = "X"
        });

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateGoalAsync(userId, "free");

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task Free_AtGoalCap_Throws()
    {
        var userId = Guid.NewGuid();

        for (int i = 0; i < 3; i++)
        {
            _db.Goals.Add(new Goal
            {
                UserId = userId,
                Title = $"G{i}",
                Category = "X"
            });
        }

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateGoalAsync(userId, "free");

        await act.Should()
            .ThrowAsync<InvalidOperationException>()
            .WithMessage("*3 goals*");
    }

    [Fact]
    public async Task Pro_AlwaysAllowed_ForGoals()
    {
        var userId = Guid.NewGuid();

        for (int i = 0; i < 100; i++)
        {
            _db.Goals.Add(new Goal
            {
                UserId = userId,
                Title = $"G{i}",
                Category = "X"
            });
        }

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateGoalAsync(userId, "pro");

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task Free_OtherUsersGoals_DontCount()
    {
        var me = Guid.NewGuid();
        var stranger = Guid.NewGuid();

        for (int i = 0; i < 10; i++)
        {
            _db.Goals.Add(new Goal
            {
                UserId = stranger,
                Title = $"G{i}",
                Category = "X"
            });
        }

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateGoalAsync(me, "free");

        await act.Should().NotThrowAsync();
    }

    // ── Habits ───────────────────────────────────────────────
    [Fact]
    public async Task Free_UnderHabitCap_Allowed()
    {
        var userId = Guid.NewGuid();

        for (int i = 0; i < 4; i++)
        {
            _db.Habits.Add(new Habit
            {
                UserId = userId,
                Title = $"H{i}",
                FrequencyType = "daily"
            });
        }

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateHabitAsync(userId, "free");

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task Free_AtHabitCap_Throws()
    {
        var userId = Guid.NewGuid();

        for (int i = 0; i < 5; i++)
        {
            _db.Habits.Add(new Habit
            {
                UserId = userId,
                Title = $"H{i}",
                FrequencyType = "daily"
            });
        }

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateHabitAsync(userId, "free");

        await act.Should()
            .ThrowAsync<InvalidOperationException>()
            .WithMessage("*5 active habits*");
    }

    [Fact]
    public async Task Free_ArchivedHabitsDontCount()
    {
        var userId = Guid.NewGuid();

        // 5 archived — should not count
        for (int i = 0; i < 5; i++)
        {
            _db.Habits.Add(new Habit
            {
                UserId = userId,
                Title = $"H{i}",
                FrequencyType = "daily",
                ArchivedAt = DateTime.UtcNow,
            });
        }

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateHabitAsync(userId, "free");

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task Pro_AlwaysAllowed_ForHabits()
    {
        var userId = Guid.NewGuid();

        for (int i = 0; i < 50; i++)
        {
            _db.Habits.Add(new Habit
            {
                UserId = userId,
                Title = $"H{i}",
                FrequencyType = "daily"
            });
        }

        await _db.SaveChangesAsync();

        var svc = new PlanGatingService(_db, _config);
        var act = () => svc.AssertCanCreateHabitAsync(userId, "pro");

        await act.Should().NotThrowAsync();
    }
}
