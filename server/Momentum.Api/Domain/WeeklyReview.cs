namespace Momentum.Api.Domain;

public class WeeklyReview
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public DateOnly WeekStart { get; set; }

    public string? Wins { get; set; }

    public string? Struggles { get; set; }

    public string? NextWeekFocus { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = default!;
}