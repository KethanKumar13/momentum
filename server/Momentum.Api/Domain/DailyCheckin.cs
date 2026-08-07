namespace Momentum.Api.Domain;

public class DailyCheckin
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public DateOnly Date { get; set; }

    public int Mood { get; set; } // 1–5

    public int Energy { get; set; } // 1–5

    public double? SleepHours { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = default!;
}