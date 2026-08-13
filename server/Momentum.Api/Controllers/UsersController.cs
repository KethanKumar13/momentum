using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokens;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        UserManager<User> userManager,
        TokenService tokens,
        ILogger<UsersController> logger)
    {
        _userManager = userManager;
        _tokens = tokens;
        _logger = logger;
    }

    // GET /api/me
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = TokenService.GetUserId(User);
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null) return NotFound();

        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            plan = user.Plan,
            theme = user.Theme,
            timezone = user.Timezone,
        });
    }

    // PATCH /api/me — update profile
    [HttpPatch("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest req)
    {
        var userId = TokenService.GetUserId(User);
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null) return NotFound();

        if (!string.IsNullOrWhiteSpace(req.Name))
            user.Name = req.Name.Trim();

        if (!string.IsNullOrWhiteSpace(req.Timezone))
        {
            try
            {
                TimeZoneInfo.FindSystemTimeZoneById(req.Timezone);
                user.Timezone = req.Timezone;
            }
            catch
            {
                return BadRequest(new { message = "Invalid timezone identifier." });
            }
        }

        if (!string.IsNullOrWhiteSpace(req.Theme) &&
            (req.Theme == "dark" || req.Theme == "light"))
        {
            user.Theme = req.Theme;
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new
            {
                message = string.Join(", ", result.Errors.Select(e => e.Description))
            });

        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            plan = user.Plan,
            theme = user.Theme,
            timezone = user.Timezone,
        });
    }

    // DELETE /api/me — permanent account deletion (GDPR / DPDP)
    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMe()
    {
        var userId = TokenService.GetUserId(User);
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null) return NotFound();

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            _logger.LogError(
                "Failed to delete user {UserId}: {Errors}",
                userId,
                string.Join(", ", result.Errors.Select(e => e.Description)));

            return StatusCode(500, new
            {
                message = "Failed to delete account. Please contact support."
            });
        }

        _tokens.ClearTokenCookies(Response);
        _logger.LogInformation("Account {UserId} deleted", userId);

        return NoContent();
    }
}
