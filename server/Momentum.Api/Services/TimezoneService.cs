using Momentum.Api.Domain;

namespace Momentum.Api.Services;

/// <summary>
/// Centralises timezone conversion so streaks, heatmaps, and "today"
/// are computed in the user's local time, not server UTC.
/// </summary>
public class TimezoneService
{
    /// <summary>
    /// Today (DateOnly) in the user's local timezone.
    /// Falls back to UTC if the tz is invalid.
    /// </summary>
    public DateOnly Today(User user) => Today(user.Timezone);

    public DateOnly Today(string? timezoneId)
    {
        var tz = ResolveTz(timezoneId);
        var local = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
        return DateOnly.FromDateTime(local);
    }

    /// <summary>
    /// ISO week start (Monday) containing the given local date.
    /// </summary>
    public static DateOnly IsoWeekStart(DateOnly date)
    {
        // C# DayOfWeek: Sunday=0..Saturday=6. ISO Monday=1..Sunday=7.
        int dow = (int)date.DayOfWeek;
        int daysFromMonday = dow == 0 ? 6 : dow - 1;
        return date.AddDays(-daysFromMonday);
    }

    private static TimeZoneInfo ResolveTz(string? id)
    {
        if (string.IsNullOrWhiteSpace(id)) return TimeZoneInfo.Utc;
        try { return TimeZoneInfo.FindSystemTimeZoneById(id); }
        catch { return TimeZoneInfo.Utc; }
    }
}
