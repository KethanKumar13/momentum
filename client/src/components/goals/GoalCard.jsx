import { Pencil, Trash2, Plus } from 'lucide-react'
import { useDeleteGoal, useUpdateGoal } from '@/hooks/useGoals'
import { GoalProgressBar } from './GoalProgressBar'
import styles from './GoalCard.module.css'

export function GoalCard({ goal, onEdit }) {
  const deleteGoal = useDeleteGoal()
  const updateGoal = useUpdateGoal()

  const pct = goal.progressPct ?? 0
  const isDone = pct >= 100

  function handleDelete() {
    if (confirm(`Delete "${goal.title}"?`)) {
      deleteGoal.mutate(goal.id)
    }
  }

  function handleIncrement() {
    const newPct = Math.min(100, pct + 5)

    updateGoal.mutate({
      id: goal.id,
      data: { progressPct: newPct },
    })
  }

  return (
    <article
      className={`${styles.card} ${isDone ? styles.done : ''}`}
    >
      <div className={styles.top}>
        <div className={styles.meta}>
          <span>{goal.category}</span>
          <span>·</span>
          <span>{goal.status}</span>
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

      <h3 className={styles.title}>
        {isDone && (
          <span className={styles.badge}>
            ✓ Done
          </span>
        )}

        {goal.title}
      </h3>

      {goal.why && (
        <p className={styles.description}>
          {goal.why}
        </p>
      )}

      <GoalProgressBar
        progress={pct}
        target={100}
      />

      {!isDone && (
        <button
          type="button"
          className={styles.incrementBtn}
          onClick={handleIncrement}
          disabled={updateGoal.isPending}
        >
          <Plus size={14} />
          {updateGoal.isPending
            ? 'Updating…'
            : 'Log progress'}
        </button>
      )}
    </article>
  )
}