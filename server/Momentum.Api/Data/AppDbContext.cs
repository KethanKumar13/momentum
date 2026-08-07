using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Domain;

namespace Momentum.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Goal> Goals => Set<Goal>();

    public DbSet<Habit> Habits => Set<Habit>();

    public DbSet<HabitLog> HabitLogs => Set<HabitLog>();

    public DbSet<DailyCheckin> DailyCheckins => Set<DailyCheckin>();

    public DbSet<JournalEntry> JournalEntries => Set<JournalEntry>();

    public DbSet<WeeklyReview> WeeklyReviews => Set<WeeklyReview>();

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ── Identity tables ────────────────────────────────────
        builder.Entity<User>().ToTable("users");
        builder.Entity<IdentityRole<Guid>>().ToTable("roles");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("user_roles");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("user_claims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("user_logins");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("role_claims");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("user_tokens");

        // ── User ───────────────────────────────────────────────
        builder.Entity<User>(e =>
        {
            e.Property(u => u.Plan).HasDefaultValue("free");
            e.Property(u => u.Theme).HasDefaultValue("dark");
            e.Property(u => u.Timezone).HasDefaultValue("Asia/Kolkata");
        });

        // ── Goal ───────────────────────────────────────────────
        builder.Entity<Goal>(e =>
        {
            e.ToTable("goals");

            e.HasOne(g => g.User)
                .WithMany(u => u.Goals)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.Property(g => g.Status).HasDefaultValue("active");
        });

        // ── Habit ──────────────────────────────────────────────
        builder.Entity<Habit>(e =>
        {
            e.ToTable("habits");

            e.HasOne(h => h.User)
                .WithMany(u => u.Habits)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(h => h.Goal)
                .WithMany(g => g.Habits)
                .HasForeignKey(h => h.GoalId)
                .OnDelete(DeleteBehavior.SetNull);

            e.Property(h => h.FrequencyConfig)
                .HasColumnType("jsonb")
                .HasDefaultValue("{}");

            e.Property(h => h.Color)
                .HasDefaultValue("#7C5CFF");
        });

        // ── HabitLog ───────────────────────────────────────────
        builder.Entity<HabitLog>(e =>
        {
            e.ToTable("habit_logs");

            e.HasOne(l => l.Habit)
                .WithMany(h => h.Logs)
                .HasForeignKey(l => l.HabitId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(l => new { l.HabitId, l.Date }).IsUnique();
        });

        // ── DailyCheckin ───────────────────────────────────────
        builder.Entity<DailyCheckin>(e =>
        {
            e.ToTable("daily_checkins");

            e.HasOne(c => c.User)
                .WithMany(u => u.Checkins)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(c => new { c.UserId, c.Date }).IsUnique();
        });

        // ── JournalEntry ───────────────────────────────────────
        builder.Entity<JournalEntry>(e =>
        {
            e.ToTable("journal_entries");

            e.HasOne(j => j.User)
                .WithMany(u => u.JournalEntries)
                .HasForeignKey(j => j.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(j => new { j.UserId, j.Date }).IsUnique();
        });

        // ── WeeklyReview ───────────────────────────────────────
        builder.Entity<WeeklyReview>(e =>
        {
            e.ToTable("weekly_reviews");

            e.HasOne(r => r.User)
                .WithMany(u => u.WeeklyReviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(r => new { r.UserId, r.WeekStart }).IsUnique();
        });

        // ── TaskItem ───────────────────────────────────────────
        builder.Entity<TaskItem>(e =>
        {
            e.ToTable("tasks");

            e.HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(t => t.Habit)
                .WithMany()
                .HasForeignKey(t => t.HabitId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}