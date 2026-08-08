namespace Momentum.Api.Domain;

public class JournalEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public DateOnly Date { get; set; }
    public string Content { get; set; } = default!;  // HTML from Tiptap
    public string? Title { get; set; }
    public string? Mood { get; set; }   // great|good|okay|bad|awful
    public string? Tags { get; set; }   // comma-separated
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = default!;
}
