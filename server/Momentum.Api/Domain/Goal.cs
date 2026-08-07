namespace Momentum.Api.Domain;

public class Goal
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public string Title { get; set; } = default!;

    public string? Why { get; set; }

    public string Category { get; set; } = default!; // Health|Career|Learning|Finance|Relationships|Personal

    public DateOnly? TargetDate { get; set; }

    public string Status { get; set; } = "active"; // active|paused|done

    public int ProgressPct { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = default!;

    public List<Habit> Habits { get; set; } = new();
}