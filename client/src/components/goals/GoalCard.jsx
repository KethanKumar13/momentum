import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteGoal } from '@/hooks/useGoals'
import { capture, EVENTS } from '@/lib/analytics'
import { GoalProgressBar } from './GoalProgressBar'
import styles from './GoalCard.module.css'

export function GoalCard({ goal, onEdit }) {
  const deleteGoal = useDeleteGoal()

  const pct = goal.progressPct ?? 0
  const isDone = pct >= 100

  function handleDelete() {
    if (confirm(`Delete "${goal.title}"?`)) {
      deleteGoal.mutate(goal.id, {
        onSuccess: () =>
          capture(EVENTS.GOAL_DELETED, { goal_id: goal.id }),
      })
    }
  }

  return (
    <article className={`${styles.card} ${isDone ? styles.done : ''}`}>
      <div className={styles.top}>
        <div className={styles.meta}>
          {goal.category}
          {' · '}
          <span className={`${styles.status} ${styles[goal.status]}`}>
            {goal.status}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onEdit(goal)}
            aria-label="Edit goal"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={handleDelete}
            aria-label="Delete goal"
            disabled={deleteGoal.isPending}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {goal.targetDate && (
        <p className={styles.targetDate}>
          📅 {new Date(goal.targetDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      )}

      <h3 className={styles.title}>{goal.title}</h3>

      {goal.why && <p className={styles.description}>{goal.why}</p>}

      <GoalProgressBar progress={pct} target={100} />

      {isDone && <p className={styles.doneLabel}>🎉 Completed!</p>}

      {goal.linkedHabits?.length > 0 && (
        <div className={styles.linkedHabits}>
          {goal.linkedHabits.map((h) => (
            <span
              key={h.id}
              className={styles.habitChip}
              style={{ borderColor: h.color }}
            >
              {h.icon ?? '⚡'} {h.title}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
