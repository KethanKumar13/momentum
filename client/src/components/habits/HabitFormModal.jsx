import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { useCreateHabit, useUpdateHabit } from '@/hooks/useHabits'
import styles from './HabitFormModal.module.css'

const FREQUENCY_TYPES = [
  'daily',
  'weekly_count',
  'specific_days',
]

const ICONS = [
  '⚡',
  '🧘',
  '📖',
  '🚶',
  '💧',
  '💪',
  '🎯',
  '✍️',
  '🏃',
  '🥗',
  '😴',
  '🎸',
]

const COLORS = [
  '#7C5CFF',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#EC4899',
  '#14B8A6',
]

export function HabitFormModal({ open, onClose, habit }) {
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()

  const initialForm = useMemo(
    () =>
      habit
        ? {
            title: habit.title,
            type: habit.type,
            frequencyType: habit.frequencyType,
            frequencyConfig: habit.frequencyConfig,
            color: habit.color,
            icon: habit.icon ?? '⚡',
            goalId: habit.goalId ?? '',
          }
        : {
            title: '',
            type: 'build',
            frequencyType: 'daily',
            frequencyConfig: '{}',
            color: '#7C5CFF',
            icon: '⚡',
            goalId: '',
          },
    [habit]
  )

  const [form, setForm] = useState(initialForm)

  function set(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      title: form.title,
      type: form.type,
      frequencyType: form.frequencyType,
      frequencyConfig: form.frequencyConfig,
      color: form.color,
      icon: form.icon,
      goalId: form.goalId || undefined,
    }

    if (habit) {
      await updateHabit.mutateAsync({
        id: habit.id,
        data: payload,
      })
    } else {
      await createHabit.mutateAsync(payload)
    }

    onClose()
  }

  if (!open) return null

  const isPending =
    createHabit.isPending ||
    updateHabit.isPending

  return (
    <div
      className={styles.overlay}
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {habit ? 'Edit habit' : 'New habit'}
          </h2>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          {/* Icon picker */}
          <div className={styles.field}>
            <span className={styles.label}>
              Icon
            </span>

            <div className={styles.iconGrid}>
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`${styles.iconBtn} ${
                    form.icon === icon
                      ? styles.iconActive
                      : ''
                  }`}
                  onClick={() =>
                    set('icon', icon)
                  }
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <label className={styles.field}>
            <span className={styles.label}>
              Title *
            </span>

            <input
              className={styles.input}
              value={form.title}
              onChange={(e) =>
                set('title', e.target.value)
              }
              required
              maxLength={200}
            />
          </label>

          {/* Type + Frequency */}
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>
                Type
              </span>

              <select
                className={styles.select}
                value={form.type}
                onChange={(e) =>
                  set('type', e.target.value)
                }
              >
                <option value="build">
                  Build
                </option>

                <option value="break">
                  Break
                </option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                Frequency
              </span>

              <select
                className={styles.select}
                value={form.frequencyType}
                onChange={(e) =>
                  set(
                    'frequencyType',
                    e.target.value
                  )
                }
              >
                {FREQUENCY_TYPES.map(
                  (frequency) => (
                    <option
                      key={frequency}
                      value={frequency}
                    >
                      {frequency.replace('_', ' ')}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          {/* Color picker */}
          <div className={styles.field}>
            <span className={styles.label}>
              Color
            </span>

            <div className={styles.colorRow}>
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorBtn} ${
                    form.color === color
                      ? styles.colorActive
                      : ''
                  }`}
                  style={{
                    background: color,
                  }}
                  onClick={() =>
                    set('color', color)
                  }
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending}
            >
              {isPending
                ? 'Saving…'
                : habit
                  ? 'Save changes'
                  : 'Create habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}