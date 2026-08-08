using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/habits/{habitId:guid}/logs")]
[Authorize]
public class HabitLogsController : ControllerBase
{
    private readonly HabitService    _habits;
    private readonly ProgressService _progress;

    public HabitLogsController(
        HabitService    habits,
        ProgressService progress)
    {
        _habits   = habits;
        _progress = progress;
    }

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException());

    // GET /api/habits/{habitId}/logs
    [HttpGet]
    public async Task<IActionResult> List(Guid habitId) =>
        Ok(await _habits.GetLogsAsync(habitId, UserId));

    // POST /api/habits/{habitId}/logs — upsert today's log
    [HttpPost]
    public async Task<IActionResult> Log(
        Guid habitId,
        [FromBody] LogHabitRequest req)
    {
        var log = await _habits.LogAsync(habitId, req, UserId);

        // ── Auto-recompute linked goal progress ──────────────
        var habit = await _habits.GetRawAsync(habitId, UserId);
        if (habit?.GoalId is Guid goalId)
            await _progress.RecomputeAsync(goalId);

        return Ok(log);
    }

    // DELETE /api/habits/{habitId}/logs/{date} — undo today's log
    [HttpDelete("{date}")]
    public async Task<IActionResult> Unlog(Guid habitId, DateOnly date)
    {
        await _habits.UnlogAsync(habitId, date, UserId);
        return NoContent();
    }
}