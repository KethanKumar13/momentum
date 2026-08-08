using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/insights")]
[Authorize]
public class InsightsController : ControllerBase
{
    private readonly InsightsService _insights;

    public InsightsController(InsightsService insights) =>
        _insights = insights;

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException());

    // GET /api/insights?days=35
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int days = 35)
    {
        if (days < 7 || days > 365)
            days = 35;

        return Ok(await _insights.GetAsync(UserId, days));
    }
}
