import { useMemo, useState } from "react";
import { useHabitsStore } from "@/store/habitsStore";
import { useGoalsStore } from "@/store/goalsStore";
import { useJournalStore, MOODS } from "@/store/journalStore";

export function useInsights() {
  const { habits } = useHabitsStore();
  const { goals } = useGoalsStore();
  const { entries } = useJournalStore();

  // Capture once when the hook is first created.
  const [now] = useState(() => Date.now());

  return useMemo(() => {
    const totalHabits = habits.length;

    const completedToday = habits.filter(
      (habit) => habit.completedToday
    ).length;

    const completionRate =
      totalHabits > 0
        ? Math.round(
            (completedToday / totalHabits) * 100
          )
        : 0;

    const longestStreak = habits.reduce(
      (max, habit) => Math.max(max, habit.streak),
      0
    );

    const topHabits = [...habits]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);

    const totalGoals = goals.length;

    const completedGoals = goals.filter(
      (goal) => goal.progress >= goal.target
    ).length;

    const avgGoalProgress =
      totalGoals > 0
        ? Math.round(
            goals.reduce(
              (sum, goal) =>
                sum +
                Math.min(
                  100,
                  Math.round(
                    (goal.progress / goal.target) * 100
                  )
                ),
              0
            ) / totalGoals
          )
        : 0;

    const recent = entries.slice(0, 30);

    const moodCounts = MOODS.map((mood) => ({
      ...mood,
      count: recent.filter(
        (entry) => entry.mood === mood.value
      ).length,
    }));

    const dominantMood = moodCounts.reduce(
      (best, mood) =>
        mood.count > best.count ? mood : best,
      moodCounts[0]
    );

    const totalEntries = entries.length;

    const entriesThisWeek = entries.filter((entry) => {
      const diff =
        now - new Date(entry.date).getTime();

      return diff < 7 * 86_400_000;
    }).length;

    const heatmapDays = Array.from(
      { length: 35 },
      (_, index) => {
        const offset =
          (34 - index) * 86_400_000;

        const date = new Date(now - offset);

        const label = date.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        );

        const intensity = habits.filter(
          (habit) => habit.streak > 34 - index
        ).length;

        return {
          date,
          label,
          intensity,
          max: totalHabits,
        };
      }
    );

    return {
      totalHabits,
      completedToday,
      completionRate,
      longestStreak,
      topHabits,
      heatmapDays,
      totalGoals,
      completedGoals,
      avgGoalProgress,
      totalEntries,
      entriesThisWeek,
      moodCounts,
      dominantMood,
    };
  }, [habits, goals, entries, now]);
}