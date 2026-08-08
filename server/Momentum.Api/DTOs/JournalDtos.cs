using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.DTOs;

// Upsert — PUT /api/journal/:date
public record UpsertJournalRequest(
    [Required] string Content,          // HTML from Tiptap
    string? Mood    = null,             // great|good|okay|bad|awful
    string? Title   = null,
    string? Tags    = null              // comma-separated
);

public record JournalEntryResponse(
    Guid     Id,
    DateOnly Date,
    string   Content,
    string?  Mood,
    string?  Title,
    string?  Tags,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// Calendar summary — one item per date that has an entry
public record JournalCalendarDay(
    DateOnly Date,
    string?  Mood,
    string?  Title
);
