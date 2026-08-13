import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Target, CheckCircle2 } from 'lucide-react'
import { useCreateGoal } from '@/hooks/useGoals'
import { useCreateHabit } from '@/hooks/useHabits'
import { capture, EVENTS } from '@/lib/analytics'
import styles from './OnboardingPage.module.css'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const createGoal = useCreateGoal()
  const createHabit = useCreateHabit()

  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState({ title: '', category: 'Health' })
  const [habit, setHabit] = useState({ title: '', frequencyType: 'daily' })
  const [createdGoalId, setCreatedGoalId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function submitGoal(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')

    try {
      const g = await createGoal.mutateAsync(goal)
      setCreatedGoalId(g.id)

      capture(EVENTS.GOAL_CREATED, {
        source: 'onboarding',
      })

      setStep(1)
    } catch (e) {
      setErr(
        e.response?.data?.message ??
          'Could not create goal.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function submitHabit(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')

    try {
      await createHabit.mutateAsync({
        title: habit.title,
        frequencyType: habit.frequencyType,
        frequencyConfig: '{}',
        color: '#7C5CFF',
        goalId: createdGoalId,
      })

      capture(EVENTS.HABIT_CREATED, {
        source: 'onboarding',
        frequencyType: habit.frequencyType,
      })

      setStep(2)
    } catch (e) {
      setErr(
        e.response?.data?.message ??
          'Could not create habit.'
      )
    } finally {
      setBusy(false)
    }
  }

  function finish() {
    capture('onboarding_completed')
    navigate('/today', { replace: true })
  }

  function skip() {
    capture('onboarding_skipped', { step })
    navigate('/today', { replace: true })
  }

  return (
    <div className={styles.page}>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.card}
      >
        <div className={styles.stepDots}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`${styles.dot} ${
                i === step ? styles.active : ''
              } ${i < step ? styles.done : ''}`}
            />
          ))}
        </div>

        {err && <p className={styles.error}>{err}</p>}

        {step === 0 && (
          <form onSubmit={submitGoal}>
            <Target size={28} className={styles.icon} />

            <h1 className={styles.heading}>
              Start with a goal
            </h1>

            <p className={styles.sub}>
              What's one thing you want to achieve in the next few months?
            </p>

            <label className={styles.field}>
              <span>Goal title</span>

              <input
                required
                className={styles.input}
                placeholder="e.g. Run a half marathon"
                value={goal.title}
                onChange={(e) =>
                  setGoal({
                    ...goal,
                    title: e.target.value,
                  })
                }
                autoFocus
              />
            </label>

            <label className={styles.field}>
              <span>Category</span>

              <select
                className={styles.input}
                value={goal.category}
                onChange={(e) =>
                  setGoal({
                    ...goal,
                    category: e.target.value,
                  })
                }
              >
                {[
                  'Health',
                  'Career',
                  'Learning',
                  'Finance',
                  'Relationships',
                  'Personal',
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.footer}>
              <button
                type="button"
                onClick={skip}
                className={styles.skip}
              >
                Skip
              </button>

              <button
                type="submit"
                className={styles.primary}
                disabled={busy}
              >
                {busy ? 'Creating…' : 'Next →'}
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={submitHabit}>
            <Sparkles size={28} className={styles.icon} />

            <h1 className={styles.heading}>
              Now, a daily habit
            </h1>

            <p className={styles.sub}>
              What action gets you closer to that goal?
            </p>

            <label className={styles.field}>
              <span>Habit title</span>

              <input
                required
                className={styles.input}
                placeholder="e.g. Run 30 minutes"
                value={habit.title}
                onChange={(e) =>
                  setHabit({
                    ...habit,
                    title: e.target.value,
                  })
                }
                autoFocus
              />
            </label>

            <label className={styles.field}>
              <span>How often?</span>

              <select
                className={styles.input}
                value={habit.frequencyType}
                onChange={(e) =>
                  setHabit({
                    ...habit,
                    frequencyType: e.target.value,
                  })
                }
              >
                <option value="daily">Daily</option>
                <option value="weekly_count">
                  Weekly (count)
                </option>
                <option value="specific_days">
                  Specific days
                </option>
              </select>
            </label>

            <div className={styles.footer}>
              <button
                type="button"
                onClick={skip}
                className={styles.skip}
              >
                Skip
              </button>

              <button
                type="submit"
                className={styles.primary}
                disabled={busy}
              >
                {busy ? 'Creating…' : 'Next →'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div>
            <CheckCircle2
              size={40}
              className={styles.icon}
            />

            <h1 className={styles.heading}>
              You're all set 🎉
            </h1>

            <p className={styles.sub}>
              Your first habit is ready. Check it off today to start your streak.
            </p>

            <div className={styles.footer}>
              <button
                type="button"
                onClick={finish}
                className={styles.primary}
              >
                Go to Today →
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
