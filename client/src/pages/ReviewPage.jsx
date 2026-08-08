import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfWeek, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWeeklyReview, useUpsertWeeklyReview } from '@/hooks/useWeeklyReview'
import styles from './ReviewPage.module.css'

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

function toWeekStart(date) {
  const s = startOfWeek(date, { weekStartsOn: 1 })
  return format(s, 'yyyy-MM-dd')
}

export default function ReviewPage() {
  const [weekOffset, setWeekOffset] = useState(0)

  const weekDate = subWeeks(new Date(), -weekOffset)
  const weekStart = toWeekStart(weekDate)

  const weekEnd = format(
    new Date(
      new Date(`${weekStart}T00:00:00`).getTime() +
        6 * 86400000
    ),
    'MMM d'
  )

  const weekLabel = `${format(
    new Date(`${weekStart}T00:00:00`),
    'MMM d'
  )} – ${weekEnd}`

  const { data: review, isLoading } = useWeeklyReview(weekStart)
  const upsert = useUpsertWeeklyReview()

  const [localWins, setLocalWins] = useState('')
  const [localStruggles, setLocalStruggles] = useState('')
  const [localFocus, setLocalFocus] = useState('')

  useEffect(() => {
    setLocalWins(review?.wins ?? '')
    setLocalStruggles(review?.struggles ?? '')
    setLocalFocus(review?.nextWeekFocus ?? '')
  }, [review, weekStart])

  async function handleSave() {
    await upsert.mutateAsync({
      weekStart,
      data: {
        wins: localWins,
        struggles: localStruggles,
        nextWeekFocus: localFocus,
      },
    })
  }

  return (
    <motion.div
      className={styles.inner}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header
        className={styles.header}
        variants={fadeUp}
      >
        <div>
          <p className={styles.sub}>End of week</p>

          <h1 className={styles.heading}>
            Weekly Review
          </h1>

          <p className={styles.meta}>
            Reflect on the past week and plan what comes next.
          </p>
        </div>

        {/* Week navigator */}
        <div className={styles.weekNav}>
          <button
            type="button"
            className={styles.weekNavBtn}
            onClick={() =>
              setWeekOffset((o) => o - 1)
            }
            aria-label="Previous week"
          >
            <ChevronLeft size={16} />
          </button>

          <span className={styles.weekLabel}>
            {weekLabel}
          </span>

          <button
            type="button"
            className={styles.weekNavBtn}
            onClick={() =>
              setWeekOffset((o) => Math.min(0, o + 1))
            }
            disabled={weekOffset >= 0}
            aria-label="Next week"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.header>

      {isLoading ? (
        <p className={styles.loading}>
          Loading review...
        </p>
      ) : (
        <>
          {/* Auto stats */}
          {review?.stats && (
            <motion.div
              className={styles.statsGrid}
              variants={fadeUp}
            >
              <StatTile
                label="Habits done"
                value={`${review.stats.habitCompletionPct}%`}
                sub={`${review.stats.habitCompletions} completions`}
                icon="✅"
              />

              <StatTile
                label="Best streak"
                value={`${review.stats.bestStreak}d`}
                sub="this week"
                icon="🔥"
              />

              <StatTile
                label="Journal entries"
                value={review.stats.journalEntries}
                sub="days written"
                icon="📓"
              />

              <StatTile
                label="Most consistent"
                value={
                  review.stats.mostConsistentHabit || '—'
                }
                sub="habit"
                icon="⭐"
              />
            </motion.div>
          )}

          {/* Reflection form */}
          <motion.div
            className={styles.form}
            variants={fadeUp}
          >
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                🏆 Wins this week
              </label>

              <textarea
                className={styles.textarea}
                rows={4}
                placeholder="What went well? What are you proud of?"
                value={localWins}
                onChange={(e) =>
                  setLocalWins(e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                😤 Struggles
              </label>

              <textarea
                className={styles.textarea}
                rows={4}
                placeholder="What was hard? What didn't go as planned?"
                value={localStruggles}
                onChange={(e) =>
                  setLocalStruggles(e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                🎯 Focus for next week
              </label>

              <textarea
                className={styles.textarea}
                rows={3}
                placeholder="What's your #1 priority next week?"
                value={localFocus}
                onChange={(e) =>
                  setLocalFocus(e.target.value)
                }
              />
            </div>

            <div className={styles.formFooter}>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={upsert.isPending}
              >
                {upsert.isPending
                  ? 'Saving...'
                  : review?.id &&
                      review.id !==
                        '00000000-0000-0000-0000-000000000000'
                    ? 'Update review'
                    : 'Save review'}
              </button>

              {upsert.isSuccess && (
                <span className={styles.savedLabel}>
                  ✓ Saved
                </span>
              )}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

function StatTile({ label, value, sub, icon }) {
  return (
    <div className={styles.statTile}>
      <span className={styles.statIcon}>{icon}</span>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statSub}>{sub}</p>
    </div>
  )
}
