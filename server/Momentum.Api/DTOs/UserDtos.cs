namespace Momentum.Api.DTOs;

public record UpdateProfileRequest(
    string? Name,
    string? Timezone,
    string? Theme);   // "dark" | "light"
