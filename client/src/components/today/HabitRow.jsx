import { motion } from 'framer-motion'
import { Flame, Check } from 'lucide-react'
import { useLogHabit, useUnlogHabit } from '@/hooks/useHabitLogs'
import { HabitIcon } from '@/components/habits/IconPicker'
import styles from './HabitRow.module.css'

export function HabitRow({ habit }) {
  const logHabit   = useLogHabit()
  const unlogHabit = useUnlogHabit()

  // isDueToday true means the habit is not yet checked off today.
  // isDueToday false means it is already done.
  const isDone  = !habit.isDueToday
  const color   = habit.color ?? '#7C5CFF'
  const pending = logHabit.isPending || unlogHabit.isPending

  function handleToggle() {
    if (pending) return

    if (isDone) {
      unlogHabit.mutate({ habitId: habit.id })
    } else {
      logHabit.mutate({ habitId: habit.id, status: 'done' })
    }
  }

  return (
    <motion.button
      type="button"
      className={`${styles.row} ${isDone ? styles.done : ''} ${
        pending ? styles.loading : ''
      }`}
      onClick={handleToggle}
      disabled={pending}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isDone}
      aria-label={`${habit.title}, ${
        isDone ? 'completed today' : 'not yet completed'
      }. Click to toggle.`}
    >
      <span
        className={styles.icon}
        style={{
          background: `${color}22`,
          color,
        }}
        aria-hidden="true"
      >
        <HabitIcon name={habit.icon} size={16} />
      </span>

      <span className={styles.label}>{habit.title}</span>

      <span
        className={styles.streak}
        aria-label={`${habit.currentStreak ?? 0} day streak`}
      >
        <Flame size={13} aria-hidden="true" />
        {habit.currentStreak ?? 0}
      </span>

      <span className={styles.checkbox} aria-hidden="true">
        {isDone && <Check size={14} strokeWidth={3} />}
      </span>
    </motion.button>
  )
}