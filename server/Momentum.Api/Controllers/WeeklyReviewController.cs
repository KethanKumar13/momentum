using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/reviews")]
[Authorize]
public class WeeklyReviewController : ControllerBase
{
    private readonly WeeklyReviewService _reviews;

    public WeeklyReviewController(WeeklyReviewService reviews) =>
        _reviews = reviews;

    private Guid UserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException());

    // GET /api/reviews — last 12 weeks
    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await _reviews.GetAllAsync(UserId));

    // GET /api/reviews/:weekStart
    [HttpGet("{weekStart}")]
    public async Task<IActionResult> Get(DateOnly weekStart) =>
        Ok(await _reviews.GetAsync(UserId, weekStart));

    // PUT /api/reviews/:weekStart — upsert
    [HttpPut("{weekStart}")]
    public async Task<IActionResult> Upsert(
        DateOnly weekStart,
        [FromBody] UpsertWeeklyReviewRequest req) =>
        Ok(await _reviews.UpsertAsync(UserId, weekStart, req));
}
