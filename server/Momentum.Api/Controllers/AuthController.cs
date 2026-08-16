using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        AuthService auth,
        TokenService tokens,
        IConfiguration config,
        ILogger<AuthController> logger)
    {
        _auth = auth;
        _tokens = tokens;
        _config = config;
        _logger = logger;
    }

    [HttpPost("signup"), AllowAnonymous]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        var (user, access, refresh) = await _auth.SignupAsync(req);
        _tokens.SetTokenCookies(Response, access, refresh);
        return Ok(ToResponse(user));
    }

    [HttpPost("login"), AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var (user, access, refresh) = await _auth.LoginAsync(req);
        _tokens.SetTokenCookies(Response, access, refresh);
        return Ok(ToResponse(user));
    }

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

    [HttpPost("logout"), AllowAnonymous]
    public async Task<IActionResult> Logout()
    {
        var rawToken = Request.Cookies["refresh_token"];

        if (!string.IsNullOrEmpty(rawToken))
            await _auth.LogoutAsync(rawToken);

        _tokens.ClearTokenCookies(Response);

        return NoContent();
    }

    [HttpPost("forgot-password"), AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequest req)
    {
        await _auth.ForgotPasswordAsync(req.Email);

        return Ok(new
        {
            message = "If that email exists, a reset link has been sent."
        });
    }

    [HttpPost("reset-password"), AllowAnonymous]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest req)
    {
        await _auth.ResetPasswordAsync(req);

        return Ok(new
        {
            message = "Password reset successfully."
        });
    }

    // ── Google OAuth ─────────────────────────────────────────────────

    [HttpGet("google"), AllowAnonymous]
    public IActionResult Google([FromQuery] string? returnUrl = null)
    {
        var safeReturn =
            string.IsNullOrEmpty(returnUrl) || !returnUrl.StartsWith('/')
                ? "/today"
                : returnUrl;

        var callbackUri = Url.Action(
            action: nameof(GoogleCallback),
            values: new { returnUrl = safeReturn })!;

        var props = new AuthenticationProperties
        {
            RedirectUri = callbackUri,
        };

        return Challenge(props, "Google");
    }

    [HttpGet("google/callback"), AllowAnonymous]
    public async Task<IActionResult> GoogleCallback(
        [FromQuery] string? returnUrl = null)
    {
        var clientBase =
            (_config["Client:BaseUrl"] ?? "http://localhost:5173")
                .TrimEnd('/');

        var safeReturn =
            string.IsNullOrEmpty(returnUrl) || !returnUrl.StartsWith('/')
                ? "/today"
                : returnUrl;

        var result = await HttpContext.AuthenticateAsync(
            CookieAuthenticationDefaults.AuthenticationScheme);

        if (!result.Succeeded || result.Principal is null)
        {
            _logger.LogWarning(
                "Google callback: cookie principal missing");

            return Redirect(
                $"{clientBase}/login?error=google_auth_failed");
        }

        var email =
            result.Principal.FindFirstValue(ClaimTypes.Email);

        var name =
            result.Principal.FindFirstValue(ClaimTypes.Name);

        if (string.IsNullOrEmpty(email))
        {
            _logger.LogWarning(
                "Google callback: no email claim");

            return Redirect(
                $"{clientBase}/login?error=google_no_email");
        }

        try
        {
            var (_, access, refresh) =
                await _auth.LoginOrCreateGoogleAsync(email, name);

            _tokens.SetTokenCookies(Response, access, refresh);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Google callback: LoginOrCreateGoogleAsync failed for {Email}",
                email);

            return Redirect(
                $"{clientBase}/login?error=google_provision_failed");
        }

        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme);

        return Redirect($"{clientBase}{safeReturn}");
    }

    private static AuthResponse ToResponse(Domain.User u) => new(
        u.Id,
        u.Name ?? "",
        u.Email!,
        u.Plan,
        u.Theme,
        u.Timezone);
}
