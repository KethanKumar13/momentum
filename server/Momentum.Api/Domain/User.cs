using Microsoft.AspNetCore.Identity;

namespace Momentum.Api.Domain;

public class User : IdentityUser<Guid>
{
    public string? Name { get; set; }

    public string Timezone { get; set; } = "Asia/Kolkata";

    public string Theme { get; set; } = "dark";

    public string Plan { get; set; } = "free";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Goal> Goals { get; set; } = [];

    public List<Habit> Habits { get; set; } = [];

    public List<DailyCheckin> Checkins { get; set; } = [];

    public List<JournalEntry> JournalEntries { get; set; } = [];

    public List<WeeklyReview> WeeklyReviews { get; set; } = [];

    public List<TaskItem> Tasks { get; set; } = [];
}