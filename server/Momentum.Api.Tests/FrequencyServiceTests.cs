using FluentAssertions;
using Momentum.Api.Services;
using Momentum.Api.Tests.Helpers;

namespace Momentum.Api.Tests;

public class FrequencyServiceTests
{
    private readonly FrequencyService _freq = new();

    // ── Daily ────────────────────────────────────────────────
    [Fact]
    public void Daily_AlwaysDue()
    {
        var habit = TestHabit.Build(frequencyType: "daily");

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 10)).Should().BeTrue();
        _freq.IsDueToday(habit, new DateOnly(2026, 12, 25)).Should().BeTrue();
    }

    // ── Weekly count ─────────────────────────────────────────
    [Fact]
    public void WeeklyCount_NoLogsThisWeek_IsDue()
    {
        var habit = TestHabit.Build(
            frequencyType: "weekly_count",
            frequencyConfig: "{\"count\":3}");

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 12))
             .Should().BeTrue();
    }

    [Fact]
    public void WeeklyCount_LessThanNDoneThisWeek_IsDue()
    {
        // ISO week containing 2026-08-12 (Wed) starts Monday 2026-08-10.
        var habit = TestHabit.Build(
            frequencyType: "weekly_count",
            frequencyConfig: "{\"count\":3}",
            logs: new[]
            {
                (new DateOnly(2026, 8, 10), "done"),
                (new DateOnly(2026, 8, 11), "done"),
            });

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 12))
             .Should().BeTrue();
    }

    [Fact]
    public void WeeklyCount_NDoneThisWeek_NotDue()
    {
        var habit = TestHabit.Build(
            frequencyType: "weekly_count",
            frequencyConfig: "{\"count\":3}",
            logs: new[]
            {
                (new DateOnly(2026, 8, 10), "done"),
                (new DateOnly(2026, 8, 11), "done"),
                (new DateOnly(2026, 8, 12), "done"),
            });

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 13))
             .Should().BeFalse();
    }

    [Fact]
    public void WeeklyCount_LogsFromLastWeek_DontCarryOver()
    {
        // Last week = Mon 2026-08-03..Sun 2026-08-09.
        var habit = TestHabit.Build(
            frequencyType: "weekly_count",
            frequencyConfig: "{\"count\":2}",
            logs: new[]
            {
                (new DateOnly(2026, 8, 4), "done"),
                (new DateOnly(2026, 8, 5), "done"),
                (new DateOnly(2026, 8, 6), "done"),
            });

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 12))
             .Should().BeTrue();
    }

    [Fact]
    public void WeeklyCount_InvalidConfig_DefaultsToDue()
    {
        var habit = TestHabit.Build(
            frequencyType: "weekly_count",
            frequencyConfig: "not-json");

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 12))
             .Should().BeTrue();
    }

    // ── Specific days ────────────────────────────────────────
    [Theory]
    [InlineData("2026-08-10", 1, true)]
    [InlineData("2026-08-11", 1, false)]
    [InlineData("2026-08-16", 7, true)]
    [InlineData("2026-08-10", 7, false)]
    public void SpecificDays_IsoWeekday(string dateStr, int day, bool expected)
    {
        var habit = TestHabit.Build(
            frequencyType: "specific_days",
            frequencyConfig: $"{{\"days\":[{day}]}}");

        var d = DateOnly.Parse(dateStr);
        _freq.IsDueToday(habit, d).Should().Be(expected);
    }

    [Fact]
    public void SpecificDays_MultipleDays_AnyMatch()
    {
        var habit = TestHabit.Build(
            frequencyType: "specific_days",
            frequencyConfig: "{\"days\":[1,3,5]}");

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 10)).Should().BeTrue();
        _freq.IsDueToday(habit, new DateOnly(2026, 8, 11)).Should().BeFalse();
        _freq.IsDueToday(habit, new DateOnly(2026, 8, 12)).Should().BeTrue();
        _freq.IsDueToday(habit, new DateOnly(2026, 8, 14)).Should().BeTrue();
        _freq.IsDueToday(habit, new DateOnly(2026, 8, 15)).Should().BeFalse();
    }

    [Fact]
    public void SpecificDays_InvalidConfig_NotDue()
    {
        var habit = TestHabit.Build(
            frequencyType: "specific_days",
            frequencyConfig: "not-json");

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 12))
             .Should().BeFalse();
    }

    [Fact]
    public void UnknownFrequency_TreatsAsDue()
    {
        var habit = TestHabit.Build(frequencyType: "weird");

        _freq.IsDueToday(habit, new DateOnly(2026, 8, 12)).Should().BeTrue();
    }
}
