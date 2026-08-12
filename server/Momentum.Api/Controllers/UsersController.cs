using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Domain;
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

        if (user is null)
            return NotFound();

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

        if (user is null)
            return NotFound();

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
