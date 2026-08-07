namespace Momentum.Api.Domain;

public class TaskItem
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public Guid? HabitId { get; set; }

    public string Title { get; set; } = default!;

    public DateOnly Date { get; set; }

    public string Status { get; set; } = "todo"; // todo|done

    public string? Priority { get; set; } // low|medium|high

    public int FocusMinutes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = default!;

    public Habit? Habit { get; set; }
}