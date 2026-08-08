using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/goals")]
[Authorize]
public class GoalsController : ControllerBase
{
    private readonly GoalService _goals;

    public GoalsController(GoalService goals) => _goals = goals;

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException());

    // GET /api/goals
    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await _goals.GetAllAsync(UserId));

    // GET /api/goals/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id) =>
        Ok(await _goals.GetAsync(id, UserId));

    // POST /api/goals
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGoalRequest req)
    {
        var goal = await _goals.CreateAsync(req, UserId);
        return CreatedAtAction(nameof(Get), new { id = goal.Id }, goal);
    }

    // PATCH /api/goals/{id}
    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateGoalRequest req) =>
        Ok(await _goals.UpdateAsync(id, req, UserId));

    // DELETE /api/goals/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _goals.DeleteAsync(id, UserId);
        return NoContent();
    }
}