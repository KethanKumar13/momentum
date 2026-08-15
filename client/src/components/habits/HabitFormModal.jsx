import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { useCreateHabit, useUpdateHabit } from '@/hooks/useHabits'
import { IconPicker } from './IconPicker'
import styles from './HabitFormModal.module.css'

const FREQUENCY_TYPES = ['daily', 'weekly_count', 'specific_days']
const COLORS = [
  '#7C5CFF',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#EC4899',
  '#14B8A6',
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function FrequencyConfigInput({ frequencyType, value, onChange }) {
  let config = {}

  try {
    config = JSON.parse(value || '{}')
  } catch {
    /* ignore */
  }

  if (frequencyType === 'daily') {
    return (
      <p className={styles.hint}>
        Runs every day. No extra config needed.
      </p>
    )
  }

  if (frequencyType === 'weekly_count') {
    return (
      <label className={styles.field}>
        <span className={styles.label}>Times per week</span>

        <input
          className={styles.input}
          type="number"
          min={1}
          max={7}
          value={config.count ?? 3}
          onChange={(e) =>
            onChange(
              JSON.stringify({
                count: Number(e.target.value),
              })
            )
          }
        />
      </label>
    )
  }

  if (frequencyType === 'specific_days') {
    const selected = config.days ?? []

    function toggle(iso) {
      const next = selected.includes(iso)
        ? selected.filter((day) => day !== iso)
        : [...selected, iso]

      onChange(
        JSON.stringify({
          days: next.sort(),
        })
      )
    }

    return (
      <div className={styles.field}>
        <span className={styles.label}>Which days?</span>

        <div className={styles.dayGrid}>
          {DAYS.map((label, i) => {
            const iso = i + 1

            return (
              <button
                key={iso}
                type="button"
                className={`${styles.dayBtn} ${
                  selected.includes(iso)
                    ? styles.dayActive
                    : ''
                }`}
                onClick={() => toggle(iso)}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}

export function HabitFormModal({
  open,
  onClose,
  habit,
}) {
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
            icon: habit.icon ?? 'zap',
            goalId: habit.goalId ?? '',
          }
        : {
            title: '',
            type: 'build',
            frequencyType: 'daily',
            frequencyConfig: '{}',
            color: '#7C5CFF',
            icon: 'zap',
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

  function setFrequencyType(frequencyType) {
    const defaultConfig =
      frequencyType === 'weekly_count'
        ? JSON.stringify({ count: 3 })
        : frequencyType === 'specific_days'
        ? JSON.stringify({
            days: [1, 2, 3, 4, 5],
          })
        : '{}'

    setForm((current) => ({
      ...current,
      frequencyType,
      frequencyConfig: defaultConfig,
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
    createHabit.isPending || updateHabit.isPending

  return (
    <div
      className={styles.overlay}
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>
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
            <span className={styles.label}>Icon</span>

            <IconPicker
              value={form.icon}
              onChange={(icon) =>
                set('icon', icon)
              }
              color={form.color}
            />
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
              autoFocus
            />
          </label>

          {/* Type + Frequency type */}
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
                <option value="build">Build</option>
                <option value="break">Break</option>
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
                  setFrequencyType(e.target.value)
                }
              >
                {FREQUENCY_TYPES.map(
                  (frequencyType) => (
                    <option
                      key={frequencyType}
                      value={frequencyType}
                    >
                      {frequencyType.replace(
                        '_',
                        ' '
                      )}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          {/* Dynamic frequency config */}
          <FrequencyConfigInput
            frequencyType={form.frequencyType}
            value={form.frequencyConfig}
            onChange={(value) =>
              set('frequencyConfig', value)
            }
          />

          {/* Color */}
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
                  style={{ background: color }}
                  onClick={() =>
                    set('color', color)
                  }
                  aria-label={`Choose color ${color}`}
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
