import { GoalProgressBar } from '@/components/goals/GoalProgressBar'
import styles from './GoalsSummary.module.css'

// Accepts goals prop from InsightsPage (already loaded via useInsights)
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
    <div className={styles.list}>
      {top.map((goal) => (
        <div key={goal.id} className={styles.row}>
          <div className={styles.info}>
            <p className={styles.title}>{goal.title}</p>

            <p className={styles.meta}>
              {goal.category}

              {goal.linkedHabitsCount > 0 && (
                <> · {goal.linkedHabitsCount} habit{goal.linkedHabitsCount > 1 ? 's' : ''}</>
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
