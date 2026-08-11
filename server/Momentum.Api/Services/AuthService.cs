using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class AuthService
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _db;
    private readonly TokenService _tokens;
    private readonly EmailService _email;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<User> userManager,
        AppDbContext db,
        TokenService tokens,
        EmailService email,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _db = db;
        _tokens = tokens;
        _email = email;
        _logger = logger;
    }

    // ── Signup ────────────────────────────────────────────────
    public async Task<(User user, string access, string refresh)> SignupAsync(SignupRequest req)
    {
        if (await _userManager.FindByEmailAsync(req.Email) is not null)
            throw new ArgumentException("An account with this email already exists.");

        var user = new User
        {
            UserName = req.Email,
            Email = req.Email,
            Name = req.Name,
        };

        var result = await _userManager.CreateAsync(user, req.Password);
        if (!result.Succeeded)
            throw new ArgumentException(string.Join(", ", result.Errors.Select(e => e.Description)));

        return await IssueTokensAsync(user);
    }

    // ── Login ─────────────────────────────────────────────────
    public async Task<(User user, string access, string refresh)> LoginAsync(LoginRequest req)
    {
        var user = await _userManager.FindByEmailAsync(req.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!await _userManager.CheckPasswordAsync(user, req.Password))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return await IssueTokensAsync(user);
    }

    // ── Refresh ───────────────────────────────────────────────
    public async Task<(User user, string access, string refresh)> RefreshAsync(string rawToken)
    {
        var stored = await _db.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == rawToken)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (!stored.IsActive)
            throw new UnauthorizedAccessException("Refresh token has expired or been revoked.");

        stored.RevokedAt = DateTime.UtcNow;

        var (user, access, newRefresh) = await IssueTokensAsync(stored.User);
        await _db.SaveChangesAsync();

        return (user, access, newRefresh);
    }

    // ── Logout ────────────────────────────────────────────────
    public async Task LogoutAsync(string rawToken)
    {
        var stored = await _db.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == rawToken);

        if (stored is not null)
        {
            stored.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    // ── Forgot password ───────────────────────────────────────
    public async Task ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null) return;   // silent — don't reveal account existence

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        await _email.SendPasswordResetAsync(
            toEmail: user.Email!,
            name: user.Name ?? "there",
            email: user.Email!,
            token: token);

        _logger.LogInformation("Password reset email sent to {Email}", email);
    }

    // ── Reset password ────────────────────────────────────────
    public async Task ResetPasswordAsync(ResetPasswordRequest req)
    {
        var user = await _userManager.FindByEmailAsync(req.Email)
            ?? throw new KeyNotFoundException("User not found.");

        var result = await _userManager.ResetPasswordAsync(user, req.Token, req.Password);

        if (!result.Succeeded)
            throw new ArgumentException(string.Join(", ", result.Errors.Select(e => e.Description)));
    }

    // ── Google OAuth: find or create user ─────────────────────
    public async Task<(User user, string access, string refresh)> LoginOrCreateGoogleAsync(
        string email,
        string? name)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            user = new User
            {
                UserName = email,
                Email = email,
                Name = name,
                EmailConfirmed = true,   // trusted from Google
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
                throw new ArgumentException(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return await IssueTokensAsync(user);
    }

    // ── Internal ──────────────────────────────────────────────
    private async Task<(User, string, string)> IssueTokensAsync(User user)
    {
        var access = _tokens.GenerateAccessToken(user);
        var refresh = _tokens.GenerateRefreshToken(user.Id);

        _db.RefreshTokens.Add(refresh);
        await _db.SaveChangesAsync();

        return (user, access, refresh.Token);
    }
}
