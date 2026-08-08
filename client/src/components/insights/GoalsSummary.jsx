import { GoalProgressBar } from '@/components/goals/GoalProgressBar'
import styles from './GoalsSummary.module.css'

export function GoalsSummary({ goals = [] }) {
  const top = goals.slice(0, 4)

  if (top.length === 0) {
    return (
      <p className={styles.empty}>
        No goals yet.
      </p>
    )
  }

  return (
    <div className={styles.wrap}>
      {top.map((goal) => (
        <div className={styles.row} key={goal.id}>
          <div className={styles.info}>
            <p className={styles.title}>
              {goal.title}
            </p>

            <p className={styles.category}>
              {goal.category}

              {goal.linkedHabitsCount > 0 && (
                <>
                  {' '}· {goal.linkedHabitsCount} habit
                  {goal.linkedHabitsCount > 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          <div className={styles.bar}>
            <GoalProgressBar
              progress={goal.progressPct}
              target={100}
            />
          </div>

          <span className={styles.pct}>
            {goal.progressPct}%
          </span>
        </div>
      ))}
    </div>
  )
}
