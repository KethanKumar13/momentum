using Hangfire.Dashboard;

namespace Momentum.Api.Middleware;

/// <summary>
/// Blocks public access to /hangfire in production.
/// Dev + non-prod → allow all (for local debugging).
/// Prod → require authenticated request.
/// </summary>
public class HangfireAuthFilter : IDashboardAuthorizationFilter
{
    private readonly IWebHostEnvironment _env;

    public HangfireAuthFilter(IWebHostEnvironment env) => _env = env;

    public bool Authorize(DashboardContext context)
    {
        if (!_env.IsProduction())
            return true;

        var httpCtx = context.GetHttpContext();
        return httpCtx.User.Identity?.IsAuthenticated == true;
    }
}
