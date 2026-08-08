using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/journal")]
[Authorize]
public class JournalController : ControllerBase
{
    private readonly JournalService _journal;

    public JournalController(JournalService journal) => _journal = journal;

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException());

    // GET /api/journal
    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await _journal.GetAllAsync(UserId));

    // GET /api/journal/:date
    [HttpGet("{date}")]
    public async Task<IActionResult> GetByDate(DateOnly date)
    {
        var entry = await _journal.GetByDateAsync(UserId, date);
        return entry is null ? NoContent() : Ok(entry);
    }

    // PUT /api/journal/:date — upsert
    [HttpPut("{date}")]
    public async Task<IActionResult> Upsert(
        DateOnly date,
        [FromBody] UpsertJournalRequest req) =>
        Ok(await _journal.UpsertAsync(UserId, date, req));

    // DELETE /api/journal/:date
    [HttpDelete("{date}")]
    public async Task<IActionResult> Delete(DateOnly date)
    {
        await _journal.DeleteAsync(UserId, date);
        return NoContent();
    }

    // GET /api/journal/calendar?year=2026&month=8
    [HttpGet("calendar")]
    public async Task<IActionResult> Calendar(
        [FromQuery] int year,
        [FromQuery] int month)
    {
        if (year < 2020 || year > 2100)
            year = DateTime.UtcNow.Year;

        if (month < 1 || month > 12)
            month = DateTime.UtcNow.Month;

        return Ok(await _journal.GetCalendarAsync(UserId, year, month));
    }
}
