using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
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
    private readonly IConfiguration _config;

    public AuthController(AuthService auth, TokenService tokens, IConfiguration config)
    {
        _auth = auth;
        _tokens = tokens;
        _config = config;
    }

    // POST /api/auth/signup
    [HttpPost("signup"), AllowAnonymous]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        var (user, access, refresh) = await _auth.SignupAsync(req);
        _tokens.SetTokenCookies(Response, access, refresh);
        return Ok(ToResponse(user));
    }

    // POST /api/auth/login
    [HttpPost("login"), AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var (user, access, refresh) = await _auth.LoginAsync(req);
        _tokens.SetTokenCookies(Response, access, refresh);
        return Ok(ToResponse(user));
    }

    // POST /api/auth/refresh
    [HttpPost("refresh"), AllowAnonymous]
    public async Task<IActionResult> Refresh()
    {
        var rawToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(rawToken))
            return Unauthorized(new { message = "No refresh token." });

        var (user, access, refresh) = await _auth.RefreshAsync(rawToken);
        _tokens.SetTokenCookies(Response, access, refresh);
        return Ok(ToResponse(user));
    }

    // POST /api/auth/logout
    [HttpPost("logout"), AllowAnonymous]
    public async Task<IActionResult> Logout()
    {
        var rawToken = Request.Cookies["refresh_token"];
        if (!string.IsNullOrEmpty(rawToken))
            await _auth.LogoutAsync(rawToken);

        _tokens.ClearTokenCookies(Response);
        return NoContent();
    }

    // POST /api/auth/forgot-password
    [HttpPost("forgot-password"), AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
    {
        await _auth.ForgotPasswordAsync(req.Email);
        return Ok(new { message = "If that email exists, a reset link has been sent." });
    }

    // POST /api/auth/reset-password
    [HttpPost("reset-password"), AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
    {
        await _auth.ResetPasswordAsync(req);
        return Ok(new { message = "Password reset successfully." });
    }

    // ── Google OAuth ─────────────────────────────────────────
    // GET /api/auth/google → redirects to Google
    [HttpGet("google"), AllowAnonymous]
    public IActionResult Google()
    {
        var props = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback))!,
        };
        return Challenge(props, GoogleDefaults.AuthenticationScheme);
    }

    // GET /api/auth/google/callback → Google redirects here
    [HttpGet("google/callback"), AllowAnonymous]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await HttpContext.AuthenticateAsync(
            GoogleDefaults.AuthenticationScheme);

        if (!result.Succeeded || result.Principal is null)
            return Unauthorized(new { message = "Google authentication failed." });

        var email = result.Principal.FindFirstValue(ClaimTypes.Email);
        var name = result.Principal.FindFirstValue(ClaimTypes.Name);

        if (string.IsNullOrEmpty(email))
            return BadRequest(new { message = "Google account has no email." });

        var (_, access, refresh) =
            await _auth.LoginOrCreateGoogleAsync(email, name);

        _tokens.SetTokenCookies(Response, access, refresh);

        var clientUrl =
            _config["Client:BaseUrl"] ?? "http://localhost:5173";

        return Redirect($"{clientUrl}/today");
    }

    // ── Helper ────────────────────────────────────────────────
    private static AuthResponse ToResponse(Domain.User u) => new(
        u.Id,
        u.Name ?? "",
        u.Email!,
        u.Plan,
        u.Theme,
        u.Timezone);
}
