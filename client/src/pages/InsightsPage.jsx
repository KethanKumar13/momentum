import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Flame,
  Trophy,
  BarChart3,
  CalendarDays,
  Smile,
  Award,
  ListChecks,
} from 'lucide-react'
import { useInsights } from '@/hooks/useInsights'
import { StatCard } from '@/components/insights/StatCard'
import { HabitHeatmap } from '@/components/insights/HabitHeatmap'
import { MoodChart } from '@/components/insights/MoodChart'
import { TopHabitsTable } from '@/components/insights/TopHabitsTable'
import { GoalsSummary } from '@/components/insights/GoalsSummary'
import { MoodEmoji } from '@/components/ui/MoodEmoji'
import styles from './InsightsPage.module.css'

const PERIODS = [
  { label: '5 weeks', days: 35 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
]

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
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

  const currentPeriod =
    PERIODS.find((period) => period.days === days)?.label ?? '5 weeks'

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
          {PERIODS.map((period) => (
            <button
              key={period.days}
              type="button"
              className={`${styles.periodBtn} ${
                days === period.days ? styles.periodActive : ''
              }`}
              onClick={() => setDays(period.days)}
              aria-pressed={days === period.days}
            >
              {period.label}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Loading state */}
      {isLoading && (
        <p className={styles.loading}>Loading insights…</p>
      )}

      {/* Error state */}
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
              icon={<Target size={18} />}
              accent="primary"
              label="Today's completion"
              value={`${completionRate}%`}
              sub={`${completedToday} of ${totalHabits} habits done`}
            />

            <StatCard
              icon={<Flame size={18} />}
              accent="warning"
              label="Current best streak"
              value={`${currentStreak}d`}
              sub={`${longestStreak}d all-time best`}
            />

            <StatCard
              icon={<Trophy size={18} />}
              accent="success"
              label="Goals completed"
              value={`${completedGoals}/${totalGoals}`}
              sub={`avg ${avgGoalProgress}% progress`}
            />

            <StatCard
              icon={<BarChart3 size={18} />}
              accent="info"
              label="Total habit logs"
              value={totalLogs.toLocaleString()}
              sub="all time"
            />
          </motion.div>

          {/* Main sections */}
          <div className={styles.grid}>
            {/* Habit activity */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                <CalendarDays
                  size={16}
                  className={styles.sectionIcon}
                  aria-hidden="true"
                />

                <span>
                  Habit activity — last {currentPeriod}
                </span>
              </h2>

              <HabitHeatmap days={heatmapDays} />
            </motion.section>

            {/* Mood distribution */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                <Smile
                  size={16}
                  className={styles.sectionIcon}
                  aria-hidden="true"
                />

                <span>Mood distribution</span>

                {dominantMood && (
                  <span className={styles.dominantMood}>
                    <MoodEmoji
                      mood={dominantMood.value}
                      size={16}
                    />
                    mostly {dominantMood.label.toLowerCase()}
                  </span>
                )}
              </h2>

              {totalEntries > 0 ? (
                <MoodChart moodCounts={moodCounts} />
              ) : (
                <p className={styles.empty}>
                  Log a mood on the Today page or write a journal
                  entry to see your mood distribution here.
                </p>
              )}
            </motion.section>

            {/* Top habits */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                <Award
                  size={16}
                  className={styles.sectionIcon}
                  aria-hidden="true"
                />

                <span>Top habits by streak</span>
              </h2>

              {topHabits.length > 0 ? (
                <TopHabitsTable habits={topHabits} />
              ) : (
                <p className={styles.empty}>
                  No habits logged yet. Start tracking to see
                  streaks!
                </p>
              )}
            </motion.section>

            {/* Goals */}
            <motion.section
              className={styles.section}
              variants={fadeUp}
            >
              <h2 className={styles.sectionTitle}>
                <ListChecks
                  size={16}
                  className={styles.sectionIcon}
                  aria-hidden="true"
                />

                <span>Goals progress</span>
              </h2>

              <GoalsSummary goals={goals} />
            </motion.section>
          </div>
        </>
      )}
    </motion.div>
  )
}
