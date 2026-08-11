using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/habits")]
[Authorize]
public class HabitsController : ControllerBase
{
    private readonly HabitService _habits;

    public HabitsController(HabitService habits) => _habits = habits;

    private Guid UserId => TokenService.GetUserId(User);

    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await _habits.GetAllAsync(UserId));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id) =>
        Ok(await _habits.GetAsync(id, UserId));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHabitRequest req)
    {
        var habit = await _habits.CreateAsync(req, UserId);
        return CreatedAtAction(nameof(Get), new { id = habit.Id }, habit);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateHabitRequest req) =>
        Ok(await _habits.UpdateAsync(id, req, UserId));

    [HttpPost("{id:guid}/archive")]
    public async Task<IActionResult> Archive(Guid id)
    {
        await _habits.ArchiveAsync(id, UserId);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _habits.DeleteAsync(id, UserId);
        return NoContent();
    }

    // GET /api/habits/{id}/heatmap?year=2026
    [HttpGet("{id:guid}/heatmap")]
    public async Task<IActionResult> Heatmap(
        Guid id,
        [FromQuery] int? year)
    {
        var y = year ?? DateTime.UtcNow.Year;
        var data = await _habits.GetHeatmapAsync(id, UserId, y);

        return Ok(new
        {
            year = y,
            days = data
        });
    }
}
