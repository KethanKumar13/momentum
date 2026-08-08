import { useMemo } from 'react'
import { useInsightsData } from './useInsightsData'
import { useJournalEntries } from './useJournal'

const MOODS = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'bad', emoji: '😔', label: 'Bad' },
  { value: 'awful', emoji: '😢', label: 'Awful' },
]

export function useInsights(days = 35) {
  const { data, isLoading, isError } = useInsightsData(days)

  // Wire journal entries for mood chart
  const { data: journalEntries = [] } = useJournalEntries()

  return useMemo(() => {
    // ── Mood chart from real journal data ─────────────────────
    const moodCounts = MOODS.map((mood) => ({
      ...mood,
      count: journalEntries.filter((e) => e.mood === mood.value).length,
    }))

    const dominantMood = moodCounts.reduce(
      (best, mood) => (mood.count > best.count ? mood : best),
      moodCounts[0]
    )

    const totalEntries = journalEntries.length
    const now = Date.now()

    const entriesThisWeek = journalEntries.filter((e) => {
      const diff =
        now - new Date(`${e.date}T00:00:00`).getTime()

      return diff < 7 * 86_400_000
    }).length

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

        // Journal data
        moodCounts,
        dominantMood: totalEntries > 0 ? dominantMood : null,
        totalEntries,
        entriesThisWeek,
      }
    }

    const {
      summary,
      heatmap,
      topHabits,
      goals,
    } = data

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

      // Top habits + goals
      topHabits,
      goals,

      // ── Journal — now wired to real data ───────────────────
      moodCounts,
      dominantMood: totalEntries > 0 ? dominantMood : null,
      totalEntries,
      entriesThisWeek,
    }
  }, [data, isLoading, isError, journalEntries])
}
