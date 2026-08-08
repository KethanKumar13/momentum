import { useMemo } from 'react'
import { useInsightsData } from './useInsightsData'

/**
 * Thin adapter - keeps InsightsPage.jsx interface identical
 * while pulling from the real API instead of Zustand.
 */
export function useInsights(days = 35) {
  const { data, isLoading, isError } = useInsightsData(days)

  return useMemo(() => {
    if (!data) {
      return {
        isLoading,
        isError,

        totalHabits: 0,
        completedToday: 0,
        completionRate: 0,
        longestStreak: 0,
        currentStreak: 0,

        topHabits: [],
        heatmapDays: [],

        totalGoals: 0,
        completedGoals: 0,
        avgGoalProgress: 0,

        totalLogs: 0,
        goals: [],

        // Legacy Zustand fields kept for MoodChart.
        // Will be wired in the Journal module.
        moodCounts: [],
        dominantMood: null,
        totalEntries: 0,
        entriesThisWeek: 0,
      }
    }

    const { summary, heatmap, topHabits, goals } = data

    return {
      isLoading,
      isError,

      // Summary stats
      totalHabits: summary.totalHabits,
      completedToday: summary.completedToday,
      completionRate: summary.completionRatePct,
      longestStreak: summary.longestStreak,
      currentStreak: summary.currentStreak,

      totalGoals: summary.totalGoals,
      completedGoals: summary.completedGoals,
      avgGoalProgress: summary.avgGoalProgressPct,

      totalLogs: summary.totalHabitLogsAllTime,

      // Heatmap
      heatmapDays: heatmap.map((d) => ({
        date: new Date(d.date),
        label: new Date(d.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        intensity: d.count,
        max: d.total,
      })),

      // Top habits
      topHabits,

      // Goals
      goals,

      // Journal - not wired yet
      moodCounts: [],
      dominantMood: null,
      totalEntries: 0,
      entriesThisWeek: 0,
    }
  }, [data, isLoading, isError])
}
