import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfWeek, subWeeks } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flame,
  BookMarked,
  Star,
} from 'lucide-react'
import {
  useWeeklyReview,
  useUpsertWeeklyReview,
} from '@/hooks/useWeeklyReview'
import styles from './ReviewPage.module.css'

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

function toWeekStart(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return format(start, 'yyyy-MM-dd')
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

  return (
    <motion.div
      className={styles.inner}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
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

        <div className={styles.weekNav}>
          <button
            type="button"
            className={styles.weekNavBtn}
            onClick={() =>
              setWeekOffset((offset) => offset - 1)
            }
            aria-label="Previous week"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          <span className={styles.weekLabel}>
            {weekLabel}
          </span>

          <button
            type="button"
            className={styles.weekNavBtn}
            onClick={() =>
              setWeekOffset((offset) =>
                Math.min(0, offset + 1)
              )
            }
            disabled={weekOffset >= 0}
            aria-label="Next week"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </motion.header>

      {isLoading ? (
        <p className={styles.loading}>
          Loading review...
        </p>
      ) : (
        <>
          {review?.stats && (
            <motion.div
              className={styles.statsGrid}
              variants={fadeUp}
            >
              <StatTile
                icon={<CheckCircle2 size={18} />}
                accent="success"
                label="Habits done"
                value={`${review.stats.habitCompletionPct}%`}
                sub={`${review.stats.habitCompletions} completions`}
              />

              <StatTile
                icon={<Flame size={18} />}
                accent="warning"
                label="Best streak"
                value={`${review.stats.bestStreak}d`}
                sub="this week"
              />

              <StatTile
                icon={<BookMarked size={18} />}
                accent="info"
                label="Journal entries"
                value={review.stats.journalEntries}
                sub="days written"
              />

              <StatTile
                icon={<Star size={18} />}
                accent="primary"
                label="Most consistent"
                value={
                  review.stats.mostConsistentHabit || '—'
                }
                sub="habit"
              />
            </motion.div>
          )}

          <ReviewForm
            key={weekStart}
            weekStart={weekStart}
            initial={{
              wins: review?.wins ?? '',
              struggles: review?.struggles ?? '',
              nextWeekFocus:
                review?.nextWeekFocus ?? '',
            }}
            hasSaved={
              review?.id &&
              review.id !==
                '00000000-0000-0000-0000-000000000000'
            }
            upsert={upsert}
          />
        </>
      )}
    </motion.div>
  )
}

function ReviewForm({
  weekStart,
  initial,
  hasSaved,
  upsert,
}) {
  const [wins, setWins] = useState(initial.wins)
  const [struggles, setStruggles] = useState(
    initial.struggles
  )
  const [focusText, setFocusText] = useState(
    initial.nextWeekFocus
  )

  async function handleSave() {
    await upsert.mutateAsync({
      weekStart,
      data: {
        wins,
        struggles,
        nextWeekFocus: focusText,
      },
    })
  }

  return (
    <motion.div
      className={styles.form}
      variants={fadeUp}
    >
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Wins this week
        </label>

        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="What went well? What are you proud of?"
          value={wins}
          onChange={(event) =>
            setWins(event.target.value)
          }
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Struggles
        </label>

        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="What was hard? What didn't go as planned?"
          value={struggles}
          onChange={(event) =>
            setStruggles(event.target.value)
          }
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Focus for next week
        </label>

        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="What's your #1 priority next week?"
          value={focusText}
          onChange={(event) =>
            setFocusText(event.target.value)
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
            : hasSaved
              ? 'Update review'
              : 'Save review'}
        </button>

        {upsert.isSuccess && (
          <span className={styles.savedLabel}>
            Saved
          </span>
        )}
      </div>
    </motion.div>
  )
}

function StatTile({
  icon,
  accent = 'default',
  label,
  value,
  sub,
}) {
  return (
    <div
      className={`${styles.statTile} ${
        styles[`accent_${accent}`] ?? ''
      }`}
    >
      <div className={styles.statIconTile}>
        {icon}
      </div>

      <p className={styles.statValue}>{value}</p>

      <p className={styles.statLabel}>{label}</p>

      <p className={styles.statSub}>{sub}</p>
    </div>
  )
}
