using Hangfire;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Extensions;
using Momentum.Api.Jobs;
using Momentum.Api.Middleware;
using Momentum.Api.Services;
using Resend;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ── Sentry ─────────────────────────────────────────────────────
builder.WebHost.UseSentry(o =>
{
    o.Dsn              = builder.Configuration["Sentry:Dsn"] ?? "";
    o.TracesSampleRate = 0.2;
    o.Environment      = builder.Environment.EnvironmentName;
});

builder.Host.AddSerilog();

builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddIdentityServices();
builder.Services.AddJwtAuth(builder.Configuration);
builder.Services.AddHangfireServices(builder.Configuration);
builder.Services.AddCorsPolicy(builder.Configuration);

// ── Resend email ───────────────────────────────────────────────
builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(o =>
    o.ApiToken = builder.Configuration["Resend:ApiKey"] ?? "");
builder.Services.AddTransient<IResend, ResendClient>();

// ── App services ───────────────────────────────────────────────
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<FrequencyService>();
builder.Services.AddScoped<StreakService>();
builder.Services.AddScoped<TimezoneService>();
builder.Services.AddScoped<ProgressService>();
builder.Services.AddScoped<GoalService>();
builder.Services.AddScoped<HabitService>();
builder.Services.AddScoped<InsightsService>();
builder.Services.AddScoped<JournalService>();
builder.Services.AddScoped<WeeklyReviewService>();
builder.Services.AddScoped<TaskService>();
builder.Services.AddScoped<CheckinService>();

// Day 17
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<PlanGatingService>();
builder.Services.AddScoped<ExportService>();
builder.Services.AddScoped<ReminderJob>();
builder.Services.AddScoped<WeeklyReviewNudgeJob>();

// Dashboard auth filter
builder.Services.AddSingleton<HangfireAuthFilter>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "Momentum API", Version = "v1" }));

builder.Services
    .AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("Postgres")!);

var app = builder.Build();

// ── Auto-migrate ───────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ── Register Hangfire recurring jobs ───────────────────────────
using (var scope = app.Services.CreateScope())
{
    var jobs = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    jobs.AddOrUpdate<ReminderJob>(
        "daily-reminder",
        job => job.RunAsync(),
        "0 8 * * *",
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

    jobs.AddOrUpdate<WeeklyReviewNudgeJob>(
        "weekly-review-nudge",
        job => job.RunAsync(),
        "0 18 * * 0",
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });
}

// ── Middleware ─────────────────────────────────────────────────
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSentryTracing();
app.UseSerilogRequestLogging();
app.UseCors("MomentumCors");
app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { app.Services.GetRequiredService<HangfireAuthFilter>() }
});

app.MapControllers();

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (ctx, report) =>
    {
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync(
            System.Text.Json.JsonSerializer.Serialize(new
            {
                status = report.Status.ToString(),
                checks = report.Entries.Select(e => new
                {
                    name   = e.Key,
                    status = e.Value.Status.ToString(),
                }),
            }));
    }
});

app.Run();
