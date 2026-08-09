using Resend;

namespace Momentum.Api.Services;

public class EmailService
{
    private readonly IResend _resend;
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(
        IResend resend,
        IConfiguration config,
        ILogger<EmailService> logger)
    {
        _resend = resend;
        _config = config;
        _logger = logger;
    }

    private string From =>
        $"{_config["Resend:FromName"]} <{_config["Resend:FromEmail"]}>";

    // ── Daily reminder ────────────────────────────────────────
    public async Task SendDailyReminderAsync(
        string toEmail,
        string name,
        int habitsDue)
    {
        try
        {
            var message = new EmailMessage
            {
                From = From,
                To = { toEmail },
                Subject = $"⚡ {habitsDue} habit{(habitsDue == 1 ? "" : "s")} due today, {name}!",
                HtmlBody = $"""
                    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
                      <h2 style="color:#7C5CFF">Good morning, {name} 👋</h2>
                      <p>You have <strong>{habitsDue} habit{(habitsDue == 1 ? "" : "s")}</strong> due today. Let's keep that streak alive!</p>
                      <a href="https://momentum.app/today"
                         style="display:inline-block;padding:12px 24px;background:#7C5CFF;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
                        Open Today →
                      </a>
                      <p style="color:#888;font-size:12px;margin-top:32px">
                        Unsubscribe in <a href="https://momentum.app/settings">Settings</a>.
                      </p>
                    </div>
                    """,
            };

            await _resend.EmailSendAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Failed to send daily reminder to {Email}",
                toEmail);
        }
    }

    // ── Weekly review nudge ───────────────────────────────────
    public async Task SendWeeklyReviewNudgeAsync(
        string toEmail,
        string name,
        int habitCompletionPct)
    {
        try
        {
            var message = new EmailMessage
            {
                From = From,
                To = { toEmail },
                Subject = $"📊 Your week in review — {habitCompletionPct}% habit completion",
                HtmlBody = $"""
                    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
                      <h2 style="color:#7C5CFF">Week complete, {name} 🎉</h2>
                      <p>You completed <strong>{habitCompletionPct}%</strong> of your habits this week.</p>
                      <p>Take 5 minutes to write your weekly review — it's one of the highest-leverage things you can do.</p>
                      <a href="https://momentum.app/review"
                         style="display:inline-block;padding:12px 24px;background:#7C5CFF;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
                        Write Review →
                      </a>
                      <p style="color:#888;font-size:12px;margin-top:32px">
                        Unsubscribe in <a href="https://momentum.app/settings">Settings</a>.
                      </p>
                    </div>
                    """,
            };

            await _resend.EmailSendAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Failed to send weekly nudge to {Email}",
                toEmail);
        }
    }
}
