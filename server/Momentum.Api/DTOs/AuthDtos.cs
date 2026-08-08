using System.ComponentModel.DataAnnotations;

namespace Momentum.Api.DTOs;

public record SignupRequest(
    [Required, MaxLength(100)] string Name,
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record ForgotPasswordRequest(
    [Required, EmailAddress] string Email
);

public record ResetPasswordRequest(
    [Required] string Token,
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);

public record AuthResponse(
    Guid Id,
    string Name,
    string Email,
    string Plan,
    string Theme,
    string Timezone
);