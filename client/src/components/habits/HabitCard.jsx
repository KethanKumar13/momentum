import {
  Pencil,
  Trash2,
  Flame,
  Archive,
} from 'lucide-react'
import {
  useDeleteHabit,
  useArchiveHabit,
} from '@/hooks/useHabits'
import styles from './HabitCard.module.css'

export function HabitCard({ habit, onEdit }) {
  const deleteHabit = useDeleteHabit()
  const archiveHabit = useArchiveHabit()

  function handleDelete() {
    if (confirm(`Delete "${habit.title}"?`)) {
      deleteHabit.mutate(habit.id)
    }
  }

  function handleArchive() {
    if (confirm(`Archive "${habit.title}"?`)) {
      archiveHabit.mutate(habit.id)
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.icon}>
        {habit.icon ?? '⚡'}
      </div>

      <div className={styles.body}>
        <p className={styles.label}>
          {habit.title}
        </p>

        <span className={styles.category}>
          {habit.frequencyType}
        </span>
      </div>

      <div className={styles.streak}>
        <Flame size={14} />
        <span>
          {habit.currentStreak ?? 0}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onEdit(habit)}
          aria-label="Edit habit"
        >
          <Pencil size={14} />
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleArchive}
          aria-label="Archive habit"
          disabled={archiveHabit.isPending}
        >
          <Archive size={14} />
        </button>

        <button
          type="button"
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={handleDelete}
          aria-label="Delete habit"
          disabled={deleteHabit.isPending}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  )
}