import styles from './DailySummaryCard.module.css'

export function DailySummaryCard({ habits = [], tasks = [] }) {
  const doneHabits = habits.filter(
    (h) => h.completedToday || h.todayLog?.status === 'done'
  ).length

  const doneTasks = tasks.filter(
    (t) => t.done || t.status === 'done'
  ).length

  const habitPct = habits.length
    ? Math.round((doneHabits / habits.length) * 100)
    : 0

  const taskPct = tasks.length
    ? Math.round((doneTasks / tasks.length) * 100)
    : 0

  const overall =
    habits.length + tasks.length === 0
      ? 0
      : Math.round((habitPct + taskPct) / 2)

  return (
    <div
      className={styles.card}
      role="region"
      aria-label="Daily summary"
    >
      <div className={styles.stat}>
        <span className={styles.value}>
          {doneHabits}/{habits.length}
        </span>
        <span className={styles.sublabel}>Habits</span>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${habitPct}%` }}
          />
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.stat}>
        <span className={styles.value}>
          {doneTasks}/{tasks.length}
        </span>
        <span className={styles.sublabel}>Tasks</span>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${taskPct}%` }}
          />
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.stat}>
        <span className={`${styles.value} ${styles.overall}`}>
          {overall}%
        </span>
        <span className={styles.sublabel}>Day score</span>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{
              width: `${overall}%`,
              background:
                overall >= 75
                  ? 'var(--color-success, #4ade80)'
                  : overall >= 40
                  ? 'var(--color-warning, #fbbf24)'
                  : 'var(--color-danger, #f87171)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
