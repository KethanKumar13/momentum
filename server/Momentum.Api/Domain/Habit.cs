namespace Momentum.Api.Domain;

public class Habit
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public Guid? GoalId { get; set; }

    public string Title { get; set; } = default!;

    public string Type { get; set; } = "build"; // build|break

    public string FrequencyType { get; set; } = "daily"; // daily|weekly_count|specific_days

    public string FrequencyConfig { get; set; } = "{}"; // JSONB — e.g. {"count":3} or {"days":[1,3,5]}

    public TimeOnly? ReminderTime { get; set; }

    public string Color { get; set; } = "#7C5CFF";

    public string? Icon { get; set; }

    public DateTime? ArchivedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = default!;

    public Goal? Goal { get; set; }

    public List<HabitLog> Logs { get; set; } = new();
}