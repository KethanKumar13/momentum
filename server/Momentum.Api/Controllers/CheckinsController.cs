using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/checkins")]
[Authorize]
public class CheckinsController : ControllerBase
{
    private readonly CheckinService _checkins;

    public CheckinsController(CheckinService checkins) => _checkins = checkins;

    private Guid UserId => TokenService.GetUserId(User);

    [HttpGet]
    public async Task<IActionResult> Range(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to) =>
        Ok(await _checkins.RangeAsync(UserId, from, to));

    [HttpGet("{date}")]
    public async Task<IActionResult> Get(DateOnly date)
    {
        var c = await _checkins.GetAsync(UserId, date);
        return c is null ? NoContent() : Ok(c);
    }

    [HttpPost]
    public async Task<IActionResult> Upsert([FromBody] UpsertCheckinRequest req) =>
        Ok(await _checkins.UpsertAsync(UserId, req));
}
