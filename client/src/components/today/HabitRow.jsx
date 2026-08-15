import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useLogHabit } from '@/hooks/useHabitLogs'
import { HabitIcon } from '@/components/habits/IconPicker'
import styles from './HabitRow.module.css'

export function HabitRow({ habit }) {
  const logHabit = useLogHabit()

  const isDone = !habit.isDueToday
  const color = habit.color ?? '#7C5CFF'

  function handleToggle() {
    logHabit.mutate({
      habitId: habit.id,
      status: 'done',
    })
  }

  return (
    <motion.button
      className={`${styles.row} ${
        isDone ? styles.done : ''
      } ${
        logHabit.isPending ? styles.loading : ''
      }`}
      onClick={handleToggle}
      disabled={logHabit.isPending}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isDone}
      aria-label={`${habit.title} — ${
        isDone ? 'completed' : 'not completed'
      }`}
    >
      <span
        className={styles.icon}
        style={{
          background: `${color}22`,
          color,
        }}
        aria-hidden="true"
      >
        <HabitIcon
          name={habit.icon}
          size={16}
        />
      </span>

      <span className={styles.label}>
        {habit.title}
      </span>

      <span
        className={styles.streak}
        aria-label={`${habit.currentStreak} day streak`}
      >
        <Flame
          size={13}
          aria-hidden="true"
        />
        {habit.currentStreak ?? 0}
      </span>

      <span
        className={styles.checkbox}
        aria-hidden="true"
      >
        {isDone ? '✓' : ''}
      </span>
    </motion.button>
  )
}
