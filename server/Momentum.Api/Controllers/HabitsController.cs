using System.Security.Claims;
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

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException()
    );

    // GET /api/habits
    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await _habits.GetAllAsync(UserId));

    // GET /api/habits/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id) =>
        Ok(await _habits.GetAsync(id, UserId));

    // POST /api/habits
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateHabitRequest req)
    {
        var habit = await _habits.CreateAsync(req, UserId);

        return CreatedAtAction(
            nameof(Get),
            new { id = habit.Id },
            habit
        );
    }

    // PATCH /api/habits/{id}
    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateHabitRequest req) =>
        Ok(await _habits.UpdateAsync(id, req, UserId));

    // DELETE /api/habits/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _habits.DeleteAsync(id, UserId);
        return NoContent();
    }

    // PATCH /api/habits/{id}/archive
    [HttpPatch("{id:guid}/archive")]
    public async Task<IActionResult> Archive(Guid id)
    {
        await _habits.ArchiveAsync(id, UserId);
        return NoContent();
    }
}