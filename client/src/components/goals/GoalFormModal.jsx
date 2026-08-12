import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { useCreateGoal, useUpdateGoal } from '@/hooks/useGoals'
import { capture, EVENTS } from '@/lib/analytics'
import styles from './GoalFormModal.module.css'

const CATEGORIES = [
  'Health',
  'Career',
  'Learning',
  'Finance',
  'Relationships',
  'Personal',
]

const STATUSES = ['active', 'paused', 'done']

export function GoalFormModal({ open, onClose, goal }) {
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()

  const initialForm = useMemo(
    () =>
      goal
        ? {
            title: goal.title,
            why: goal.why ?? '',
            category: goal.category,
            targetDate: goal.targetDate ?? '',
            status: goal.status,
          }
        : {
            title: '',
            why: '',
            category: 'Health',
            targetDate: '',
            status: 'active',
          },
    [goal]
  )

  const [form, setForm] = useState(initialForm)

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      title: form.title,
      why: form.why || undefined,
      category: form.category,
      targetDate: form.targetDate || undefined,
      status: form.status,
    }

    try {
      if (goal) {
        const updated = await updateGoal.mutateAsync({
          id: goal.id,
          data: payload,
        })

        capture(EVENTS.GOAL_UPDATED, {
          goal_id: goal.id,
          category: payload.category,
        })

        onClose()
        return updated
      }

      const created = await createGoal.mutateAsync(payload)

      capture(EVENTS.GOAL_CREATED, {
        category: payload.category,
        has_target_date: Boolean(payload.targetDate),
      })

      onClose()
      return created
    } catch (err) {
      capture('goal_save_failed', {
        reason: err.response?.data?.message ?? 'unknown',
      })

      throw err
    }
  }

  if (!open) return null

  const isPending = createGoal.isPending || updateGoal.isPending

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-form-title"
      >
        <div className={styles.header}>
          <h2 id="goal-form-title" className={styles.title}>
            {goal ? 'Edit goal' : 'New goal'}
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Title *</span>
            <input
              className={styles.input}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              maxLength={200}
              autoFocus
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Why? (optional)</span>
            <textarea
              className={styles.textarea}
              rows={3}
              value={form.why}
              onChange={(e) => set('why', e.target.value)}
            />
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Category</span>
              <select
                className={styles.select}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select
                className={styles.select}
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Target date (optional)</span>
            <input
              className={styles.input}
              type="date"
              value={form.targetDate}
              onChange={(e) => set('targetDate', e.target.value)}
            />
          </label>

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
                : goal
                ? 'Save changes'
                : 'Create goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
