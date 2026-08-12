using FluentAssertions;
using Momentum.Api.Services;
using Momentum.Api.Tests.Helpers;

namespace Momentum.Api.Tests;

public class StreakServiceTests
{
    private readonly StreakService _streaks = new();

    [Fact]
    public void CurrentStreak_EmptyLogs_ReturnsZero()
    {
        var habit = TestHabit.Build();
        var today = new DateOnly(2026, 8, 12);

        _streaks.CurrentStreak(habit, today).Should().Be(0);
        _streaks.LongestStreak(habit).Should().Be(0);
    }

    [Fact]
    public void CurrentStreak_ConsecutiveDone_CountsAll()
    {
        var today = new DateOnly(2026, 8, 12);
        var habit = TestHabit.Build(
            logs: new[]
            {
                (today.AddDays(-3), "done"),
                (today.AddDays(-2), "done"),
                (today.AddDays(-1), "done"),
                (today,              "done"),
            });

        _streaks.CurrentStreak(habit, today).Should().Be(4);
    }

    [Fact]
    public void CurrentStreak_SkipPreservesStreak()
    {
        var today = new DateOnly(2026, 8, 12);
        var habit = TestHabit.Build(
            logs: new[]
            {
                (today.AddDays(-2), "done"),
                (today.AddDays(-1), "skip"),
                (today,              "done"),
            });

        _streaks.CurrentStreak(habit, today).Should().Be(3);
    }

    [Fact]
    public void CurrentStreak_MissBreaksStreak()
    {
        var today = new DateOnly(2026, 8, 12);
        var habit = TestHabit.Build(
            logs: new[]
            {
                (today.AddDays(-3), "done"),
                (today.AddDays(-2), "done"),
                (today.AddDays(-1), "miss"),
                (today,              "done"),
            });

        _streaks.CurrentStreak(habit, today).Should().Be(1);
    }

    [Fact]
    public void CurrentStreak_GapBreaksStreak()
    {
        var today = new DateOnly(2026, 8, 12);
        var habit = TestHabit.Build(
            logs: new[]
            {
                (today.AddDays(-5), "done"),
                (today.AddDays(-4), "done"),
                (today.AddDays(-1), "done"),
                (today,              "done"),
            });

        _streaks.CurrentStreak(habit, today).Should().Be(2);
    }

    [Fact]
    public void LongestStreak_FindsMaximumRun()
    {
        var today = new DateOnly(2026, 8, 12);
        var habit = TestHabit.Build(
            logs: new[]
            {
                (new DateOnly(2026, 1, 1), "done"),
                (new DateOnly(2026, 1, 2), "done"),
                (new DateOnly(2026, 1, 3), "done"),
                (new DateOnly(2026, 1, 4), "done"),
                (new DateOnly(2026, 1, 5), "done"),

                (new DateOnly(2026, 3, 1), "done"),
                (new DateOnly(2026, 3, 2), "done"),

                (today.AddDays(-1), "done"),
                (today,            "done"),
            });

        _streaks.LongestStreak(habit).Should().Be(5);
    }

    [Fact]
    public void LongestStreak_TreatsSkipAsKept()
    {
        var habit = TestHabit.Build(
            logs: new[]
            {
                (new DateOnly(2026, 1, 1), "done"),
                (new DateOnly(2026, 1, 2), "skip"),
                (new DateOnly(2026, 1, 3), "done"),
            });

        _streaks.LongestStreak(habit).Should().Be(3);
    }

    [Fact]
    public void CurrentStreak_DstSpringForward_WorksWithDateOnly()
    {
        // DST US spring-forward = 2026-03-08. DateOnly is calendar-based so
        // the "day" concept is unaffected by DST — streak should count normally.
        var today = new DateOnly(2026, 3, 10);
        var habit = TestHabit.Build(
            logs: new[]
            {
                (new DateOnly(2026, 3, 7),  "done"),
                (new DateOnly(2026, 3, 8),  "done"),
                (new DateOnly(2026, 3, 9),  "done"),
                (new DateOnly(2026, 3, 10), "done"),
            });

        _streaks.CurrentStreak(habit, today).Should().Be(4);
    }

    [Fact]
    public void ConsistencyPct_NoDueDays_ReturnsZero()
    {
        // A weekly habit with days=[Sunday=7] and a window Monday..Friday
        // has zero due days → 0%.
        var habit = TestHabit.Build(
            frequencyType: "specific_days",
            frequencyConfig: "{\"days\":[7]}");

        var pct = _streaks.ConsistencyPct(
            habit,
            new DateOnly(2026, 8, 10),
            new DateOnly(2026, 8, 14),
            new FrequencyService());

        pct.Should().Be(0);
    }

    [Fact]
    public void ConsistencyPct_HalfDone_Returns50()
    {
        var habit = TestHabit.Build(
            frequencyType: "daily",
            logs: new[]
            {
                (new DateOnly(2026, 8, 10), "done"),
                (new DateOnly(2026, 8, 11), "done"),
                (new DateOnly(2026, 8, 14), "done"),
            });

        var pct = _streaks.ConsistencyPct(
            habit,
            new DateOnly(2026, 8, 10),
            new DateOnly(2026, 8, 14),
            new FrequencyService());

        pct.Should().Be(60);
    }
}
