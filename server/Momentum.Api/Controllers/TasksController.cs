using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly TaskService _tasks;

    public TasksController(TaskService tasks) => _tasks = tasks;

    private Guid UserId => TokenService.GetUserId(User);

    // GET /api/tasks?date=2026-08-11
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] DateOnly? date)
    {
        var d = date ?? DateOnly.FromDateTime(DateTime.UtcNow);
        return Ok(await _tasks.GetForDateAsync(UserId, d));
    }

    // POST /api/tasks
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest req) =>
        Ok(await _tasks.CreateAsync(UserId, req));

    // PATCH /api/tasks/{id}
    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateTaskRequest req) =>
        Ok(await _tasks.UpdateAsync(UserId, id, req));

    // DELETE /api/tasks/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _tasks.DeleteAsync(UserId, id);
        return NoContent();
    }
}
