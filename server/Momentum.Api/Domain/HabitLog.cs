namespace Momentum.Api.Domain;

public class HabitLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid HabitId { get; set; }

    public Guid UserId { get; set; }

    public DateOnly Date { get; set; }

    public string Status { get; set; } = "done"; // done|skip|miss

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Habit Habit { get; set; } = default!;
}