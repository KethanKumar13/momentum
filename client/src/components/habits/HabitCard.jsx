import { Pencil, Trash2, Flame, Archive } from 'lucide-react'
import { useDeleteHabit, useArchiveHabit } from '@/hooks/useHabits'
import { capture, EVENTS } from '@/lib/analytics'
import { HabitIcon } from './IconPicker'
import styles from './HabitCard.module.css'

function frequencyLabel(habit) {
  switch (habit.frequencyType) {
    case 'daily':
      return 'Daily'

    case 'weekly_count': {
      try {
        const cfg = JSON.parse(
          habit.frequencyConfig ?? '{}'
        )

        return `${cfg.count ?? 1}× / week`
      } catch {
        return 'Weekly'
      }
    }

    case 'specific_days': {
      try {
        const cfg = JSON.parse(
          habit.frequencyConfig ?? '{}'
        )

        const map = [
          '',
          'Mo',
          'Tu',
          'We',
          'Th',
          'Fr',
          'Sa',
          'Su',
        ]

        return (cfg.days ?? [])
          .map((day) => map[day])
          .join(' · ')
      } catch {
        return 'Specific days'
      }
    }

    default:
      return habit.frequencyType
  }
}

export function HabitCard({ habit, onEdit }) {
  const deleteHabit = useDeleteHabit()
  const archiveHabit = useArchiveHabit()

  function handleDelete() {
    if (confirm(`Delete "${habit.title}"?`)) {
      deleteHabit.mutate(habit.id, {
        onSuccess: () =>
          capture(EVENTS.HABIT_DELETED, {
            habit_id: habit.id,
          }),
      })
    }
  }

  function handleArchive() {
    if (confirm(`Archive "${habit.title}"?`)) {
      archiveHabit.mutate(habit.id, {
        onSuccess: () =>
          capture(EVENTS.HABIT_ARCHIVED, {
            habit_id: habit.id,
          }),
      })
    }
  }

  const color = habit.color ?? '#7C5CFF'

  return (
    <article className={styles.card}>
      <div
        className={styles.icon}
        style={{
          background: `${color}22`,
          color,
        }}
      >
        <HabitIcon
          name={habit.icon}
          size={18}
        />
      </div>

      <div className={styles.body}>
        <p className={styles.label}>
          {habit.title}
        </p>

        <span className={styles.category}>
          {frequencyLabel(habit)}
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
