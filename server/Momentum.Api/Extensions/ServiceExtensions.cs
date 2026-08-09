using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Serilog;

namespace Momentum.Api.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                config.GetConnectionString("Postgres")));

        return services;
    }

    public static IServiceCollection AddHangfireServices(
        this IServiceCollection services,
        IConfiguration config)
    {
        // FIX: use new options-based overload (no more CS0618 warning)
        services.AddHangfire(cfg =>
            cfg.UsePostgreSqlStorage(o =>
                o.UseNpgsqlConnection(
                    config.GetConnectionString("Postgres")!)));

        services.AddHangfireServer();

        return services;
    }

    public static IServiceCollection AddCorsPolicy(
        this IServiceCollection services,
        IConfiguration config)
    {
        var origins = config
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
            options.AddPolicy("MomentumCors", policy =>
                policy.WithOrigins(origins)
                      .AllowCredentials()
                      .AllowAnyHeader()
                      .AllowAnyMethod()));

        return services;
    }

    public static IHostBuilder AddSerilog(this IHostBuilder host)
    {
        host.UseSerilog((ctx, logger) =>
            logger.ReadFrom.Configuration(ctx.Configuration)
                  .Enrich.FromLogContext()
                  .WriteTo.Console());

        return host;
    }
}
