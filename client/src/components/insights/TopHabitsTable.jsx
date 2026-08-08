import { Flame } from 'lucide-react'
import styles from './TopHabitsTable.module.css'

export function TopHabitsTable({ habits }) {
  return (
    <div className={styles.table}>
      {habits.map((habit, index) => (
        <div className={styles.row} key={habit.id}>
          <span className={styles.rank}>
            #{index + 1}
          </span>

          <span
            className={styles.icon}
            style={{ color: habit.color }}
          >
            {habit.icon ?? '⚡'}
          </span>

          <div className={styles.info}>
            <p className={styles.label}>{habit.title}</p>

            <p className={styles.category}>
              {habit.consistencyPct}% consistent · {habit.totalLogs} logs
            </p>
          </div>

          <div className={styles.streak}>
            <Flame size={13} />
            <span>{habit.currentStreak}d</span>
          </div>
        </div>
      ))}
    </div>
  )
}
