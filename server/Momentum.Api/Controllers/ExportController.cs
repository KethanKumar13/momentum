using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/export")]
[Authorize]
public class ExportController : ControllerBase
{
    private readonly ExportService _export;

    public ExportController(ExportService export) => _export = export;

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException());

    // GET /api/export/json
    [HttpGet("json")]
    public async Task<IActionResult> ExportJson()
    {
        var json = await _export.ExportJsonAsync(UserId);
        var bytes = Encoding.UTF8.GetBytes(json);

        return File(
            bytes,
            "application/json",
            $"momentum-export-{DateTime.UtcNow:yyyy-MM-dd}.json");
    }

    // GET /api/export/csv
    [HttpGet("csv")]
    public async Task<IActionResult> ExportCsv()
    {
        var csv = await _export.ExportHabitLogsCsvAsync(UserId);
        var bytes = Encoding.UTF8.GetBytes(csv);

        return File(
            bytes,
            "text/csv",
            $"momentum-habit-logs-{DateTime.UtcNow:yyyy-MM-dd}.csv");
    }
}
