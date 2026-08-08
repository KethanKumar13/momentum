using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.DTOs;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    private readonly TokenService _tokens;

    public AuthController(AuthService auth, TokenService tokens)
    {
        _auth = auth;
        _tokens = tokens;
    }

    // POST /api/auth/signup
    [HttpPost("signup")]
    [AllowAnonymous]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        var (user, access, refresh) = await _auth.SignupAsync(req);

        _tokens.SetTokenCookies(Response, access, refresh);

        return Ok(ToResponse(user));
    }

    // POST /api/auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var (user, access, refresh) = await _auth.LoginAsync(req);

        _tokens.SetTokenCookies(Response, access, refresh);

        return Ok(ToResponse(user));
    }

    // POST /api/auth/refresh
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh()
    {
        var rawToken = Request.Cookies["refresh_token"];

        if (string.IsNullOrEmpty(rawToken))
            return Unauthorized(new { message = "No refresh token." });

        var (user, access, refresh) =
            await _auth.RefreshAsync(rawToken);

        _tokens.SetTokenCookies(Response, access, refresh);

        return Ok(ToResponse(user));
    }

    // POST /api/auth/logout
    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout()
    {
        var rawToken = Request.Cookies["refresh_token"];

        if (!string.IsNullOrEmpty(rawToken))
            await _auth.LogoutAsync(rawToken);

        _tokens.ClearTokenCookies(Response);

        return NoContent();
    }

    // POST /api/auth/forgot-password
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequest req)
    {
        await _auth.ForgotPasswordAsync(req.Email);

        return Ok(new
        {
            message = "If that email exists, a reset link has been sent."
        });
    }

    // POST /api/auth/reset-password
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest req)
    {
        await _auth.ResetPasswordAsync(req);

        return Ok(new
        {
            message = "Password reset successfully."
        });
    }

    // ── Helper ────────────────────────────────────────────────
    private static AuthResponse ToResponse(Domain.User u) =>
        new(
            u.Id,
            u.Name ?? "",
            u.Email!,
            u.Plan,
            u.Theme,
            u.Timezone
        );
}