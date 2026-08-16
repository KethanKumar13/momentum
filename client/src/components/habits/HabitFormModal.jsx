import { useState, useMemo, useEffect } from 'react'
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

const EMPTY_FORM = {
  title: '',
  type: 'build',
  frequencyType: 'daily',
  frequencyConfig: '{}',
  color: '#7C5CFF',
  icon: 'zap',
  goalId: '',
}

function toFormState(habit) {
  if (!habit) return { ...EMPTY_FORM }

  return {
    title: habit.title ?? '',
    type: habit.type ?? 'build',
    frequencyType: habit.frequencyType ?? 'daily',
    frequencyConfig: habit.frequencyConfig ?? '{}',
    color: habit.color ?? '#7C5CFF',
    icon: habit.icon ?? 'zap',
    goalId: habit.goalId ?? '',
  }
}

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
            onChange(JSON.stringify({ count: Number(e.target.value) }))
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

      onChange(JSON.stringify({ days: next.sort() }))
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
                  selected.includes(iso) ? styles.dayActive : ''
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

export function HabitFormModal({ open, onClose, habit }) {
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()

  const initialForm = useMemo(() => toFormState(habit), [habit])

  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (open) {
      setForm(toFormState(habit))
    }
  }, [open, habit])

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
        ? JSON.stringify({ days: [1, 2, 3, 4, 5] })
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
      title: form.title.trim(),
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

    setForm({ ...EMPTY_FORM })
    onClose()
  }

  function handleClose() {
    setForm({ ...EMPTY_FORM })
    onClose()
  }

  if (!open) return null

  const isPending =
    createHabit.isPending || updateHabit.isPending

  return (
    <div
      className={styles.overlay}
      onClick={(e) =>
        e.target === e.currentTarget && handleClose()
      }
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{habit ? 'Edit habit' : 'New habit'}</h2>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <span className={styles.label}>Icon</span>

            <IconPicker
              value={form.icon}
              onChange={(icon) => set('icon', icon)}
              color={form.color}
            />
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Title *</span>

            <input
              className={styles.input}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              maxLength={200}
              autoFocus
              placeholder="e.g. Run 30 minutes"
            />
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Type</span>

              <select
                className={styles.select}
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                <option value="build">Build</option>
                <option value="break">Break</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Frequency</span>

              <select
                className={styles.select}
                value={form.frequencyType}
                onChange={(e) =>
                  setFrequencyType(e.target.value)
                }
              >
                {FREQUENCY_TYPES.map((frequencyType) => (
                  <option
                    key={frequencyType}
                    value={frequencyType}
                  >
                    {frequencyType.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <FrequencyConfigInput
            frequencyType={form.frequencyType}
            value={form.frequencyConfig}
            onChange={(value) =>
              set('frequencyConfig', value)
            }
          />

          <div className={styles.field}>
            <span className={styles.label}>Color</span>

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
                  onClick={() => set('color', color)}
                  aria-label={`Choose color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={
                isPending || !form.title.trim()
              }
            >
              {isPending
                ? 'Saving...'
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