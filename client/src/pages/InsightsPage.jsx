import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInsights } from '@/hooks/useInsights'
import { StatCard } from '@/components/insights/StatCard'
import { HabitHeatmap } from '@/components/insights/HabitHeatmap'
import { MoodChart } from '@/components/insights/MoodChart'
import { TopHabitsTable } from '@/components/insights/TopHabitsTable'
import { GoalsSummary } from '@/components/insights/GoalsSummary'
import styles from './InsightsPage.module.css'

const PERIODS = [
  { label: '5 weeks', days: 35 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export default function InsightsPage() {
  const [days, setDays] = useState(35)

  const {
    isLoading,
    isError,
    totalHabits,
    completedToday,
    completionRate,
    longestStreak,
    currentStreak,
    topHabits,
    heatmapDays,
    totalGoals,
    completedGoals,
    avgGoalProgress,
    totalLogs,
    goals,
    moodCounts,
    dominantMood,
    totalEntries,
  } = useInsights(days)

  return (
    <motion.div
      className={styles.inner}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header className={styles.header} variants={fadeUp}>
        <div>
          <p className={styles.sub}>Your data, your story</p>
          <h1 className={styles.heading}>Insights</h1>
          <p className={styles.meta}>
            Based on your habits &amp; goals
          </p>
        </div>

        <div className={styles.periodSelector}>
          {PERIODS.map((p) => (
            <button
              key={p.days}
              className={`${styles.periodBtn} ${
                days === p.days ? styles.periodActive : ''
              }`}
              onClick={() => setDays(p.days)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Loading */}
      {isLoading && (
        <p className={styles.loading}>
          Loading insights...
        </p>
      )}

      {/* Error */}
      {isError && (
        <p className={styles.error}>
          Failed to load insights. Make sure the server is running.
        </p>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
          {/* Stat cards */}
          <motion.div
            className={styles.statsGrid}
            variants={fadeUp}
          >
            <StatCard
              label="Today's completion"
              value={`${completionRate}%`}
              sub={`${completedToday} of ${totalHabits} habits done`}
              icon="🎯"
              accent="primary"
            />

            <StatCard
              label="Current best streak"
              value={`${currentStreak}d`}
              sub={`${longestStreak}d all-time best`}
              icon="🔥"
              accent="warning"
            />

            <StatCard
              label="Goals completed"
              value={`${completedGoals}/${totalGoals}`}
              sub={`avg ${avgGoalProgress}% progress`}
              icon="🏆"
              accent="success"
            />

            <StatCard
              label="Total habit logs"
              value={totalLogs.toLocaleString()}
              sub="all time"
              icon="📊"
            />
          </motion.div>

          {/* Grid sections */}
          <div className={styles.grid}>
            {/* Heatmap */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                Habit activity - last{' '}
                {PERIODS.find((p) => p.days === days)?.label}
              </h2>

              <HabitHeatmap days={heatmapDays} />
            </motion.section>

            {/* Mood chart */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                Mood distribution

                {dominantMood && (
                  <span className={styles.dominantMood}>
                    {dominantMood.emoji} mostly{' '}
                    {dominantMood.label.toLowerCase()}
                  </span>
                )}
              </h2>

              {totalEntries > 0 ? (
                <MoodChart moodCounts={moodCounts} />
              ) : (
                <p className={styles.empty}>
                  Journal entries will appear here - coming in Day 17.
                </p>
              )}
            </motion.section>

            {/* Top habits */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                Top habits by streak
              </h2>

              {topHabits.length > 0 ? (
                <TopHabitsTable habits={topHabits} />
              ) : (
                <p className={styles.empty}>
                  No habits logged yet - start tracking to see streaks!
                </p>
              )}
            </motion.section>

            {/* Goals progress */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                Goals progress
              </h2>

              <GoalsSummary goals={goals} />
            </motion.section>
          </div>
        </>
      )}
    </motion.div>
  )
}
