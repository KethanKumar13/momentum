using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Services;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("api/today")]
[Authorize]
public class TodayController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly FrequencyService _freq;

    public TodayController(AppDbContext db, FrequencyService freq)
    {
        _db = db;
        _freq = freq;
    }

    // GET /api/today
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = TokenService.GetUserId(User);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var habits = await _db.Habits
            .Where(h => h.UserId == userId && h.ArchivedAt == null)
            .Include(h => h.Logs)
            .ToListAsync();

        var due = habits
            .Where(h => _freq.IsDueToday(h, today))
            .Select(h => new
            {
                id = h.Id,
                title = h.Title,
                color = h.Color,
                icon = h.Icon,
                goalId = h.GoalId,
                reminderTime = h.ReminderTime,
                todayLog = h.Logs
                    .Where(l => l.Date == today)
                    .Select(l => new { l.Status, l.Note })
                    .FirstOrDefault(),
            })
            .ToList();

        var tasks = await _db.Tasks
            .Where(t => t.UserId == userId && t.Date == today)
            .OrderBy(t => t.CreatedAt)
            .Select(t => new
            {
                id = t.Id,
                title = t.Title,
                status = t.Status,
                priority = t.Priority,
                focusMinutes = t.FocusMinutes,
                habitId = t.HabitId,
            })
            .ToListAsync();

        var checkin = await _db.DailyCheckins
            .Where(c => c.UserId == userId && c.Date == today)
            .Select(c => new
            {
                c.Mood,
                c.Energy,
                c.SleepHours,
            })
            .FirstOrDefaultAsync();

        return Ok(new
        {
            date = today,
            habits = due,
            tasks,
            checkin,
        });
    }
}
