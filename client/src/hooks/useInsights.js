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

const DAY_MS = 86_400_000

/** Pure: given a list of yyyy-MM-dd entry dates, returns how many fall in the
 * last-7-days window relative to the most recent entry. */
function countEntriesThisWeek(entries) {
  if (entries.length === 0) return 0

  const times = entries.map(
    (e) => new Date(`${e.date}T00:00:00Z`).getTime()
  )

  const latest = Math.max(...times)

  return times.filter(
    (t) => latest - t < 7 * DAY_MS
  ).length
}

export function useInsights(days = 35) {
  const { data, isLoading, isError } = useInsightsData(days)
  const { data: journalEntries = [] } = useJournalEntries()

  return useMemo(() => {
    const moodCounts = MOODS.map((mood) => ({
      ...mood,
      count: journalEntries.filter(
        (entry) => entry.mood === mood.value
      ).length,
    }))

    const dominantMood = moodCounts.reduce(
      (best, mood) =>
        mood.count > best.count ? mood : best,
      moodCounts[0]
    )

    const totalEntries = journalEntries.length
    const entriesThisWeek = countEntriesThisWeek(journalEntries)

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
      totalHabits: summary.totalHabits,
      completedToday: summary.completedToday,
      completionRate: summary.completionRatePct,
      longestStreak: summary.longestStreak,
      currentStreak: summary.currentStreak,
      totalGoals: summary.totalGoals,
      completedGoals: summary.completedGoals,
      avgGoalProgress: summary.avgGoalProgressPct,
      totalLogs: summary.totalHabitLogsAllTime,

      heatmapDays: heatmap.map((d) => {
        const date = new Date(d.date)

        return {
          date,
          label: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          intensity: d.count,
          max: d.total,
        }
      }),

      topHabits,
      goals,
      moodCounts,
      dominantMood: totalEntries > 0 ? dominantMood : null,
      totalEntries,
      entriesThisWeek,
    }
  }, [data, isLoading, isError, journalEntries])
}
