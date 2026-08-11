using Microsoft.EntityFrameworkCore;
using Momentum.Api.Data;
using Momentum.Api.Domain;
using Momentum.Api.DTOs;

namespace Momentum.Api.Services;

public class TaskService
{
    private readonly AppDbContext _db;

    public TaskService(AppDbContext db) => _db = db;

    public async Task<List<TaskResponse>> GetForDateAsync(Guid userId, DateOnly date)
    {
        var tasks = await _db.Tasks
            .Where(t => t.UserId == userId && t.Date == date)
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(ToResponse).ToList();
    }

    public async Task<TaskResponse> CreateAsync(Guid userId, CreateTaskRequest req)
    {
        var task = new TaskItem
        {
            UserId = userId,
            Title = req.Title,
            Date = req.Date,
            HabitId = req.HabitId,
            Priority = req.Priority,
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        return ToResponse(task);
    }

    public async Task<TaskResponse> UpdateAsync(
        Guid userId,
        Guid id,
        UpdateTaskRequest req)
    {
        var task = await _db.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new KeyNotFoundException("Task not found.");

        if (req.Title is not null)
            task.Title = req.Title;

        if (req.Date.HasValue)
            task.Date = req.Date.Value;

        if (req.Status is not null)
            task.Status = req.Status;

        if (req.Priority is not null)
            task.Priority = req.Priority;

        if (req.FocusMinutes.HasValue)
            task.FocusMinutes = req.FocusMinutes.Value;

        await _db.SaveChangesAsync();

        return ToResponse(task);
    }

    public async Task DeleteAsync(Guid userId, Guid id)
    {
        var task = await _db.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new KeyNotFoundException("Task not found.");

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
    }

    private static TaskResponse ToResponse(TaskItem t) => new(
        t.Id,
        t.Title,
        t.Date,
        t.Status,
        t.Priority,
        t.FocusMinutes,
        t.HabitId,
        t.CreatedAt);
}
