import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useGreeting } from '@/hooks/useGreeting'
import { useHabits } from '@/hooks/useHabits'
import { useAuth } from '@/hooks/useAuth'
import { DailySummaryCard } from '@/components/today/DailySummaryCard'
import { HabitRow } from '@/components/today/HabitRow'
import { FocusTimer } from '@/components/today/FocusTimer'
import styles from './TodayPage.module.css'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export default function TodayPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const { greeting, quote } = useGreeting(firstName)
  const { data: habits = [], isLoading } = useHabits()

  const today = format(new Date(), 'EEEE, MMMM d')

  // Only show habits due today
  const dueHabits = habits.filter(h => h.isDueToday || !h.isDueToday)
  const doneCount = habits.filter(h => !h.isDueToday).length
  const dueCount = habits.filter(h => h.isDueToday).length

  return (
    <motion.div
      className={styles.inner}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header className={styles.header} variants={fadeUp}>
        <span>{today}</span>
        <h1>{greeting}, {firstName} 👋</h1>
      </motion.header>

      {/* Quote */}
      <motion.blockquote className={styles.quote} variants={fadeUp}>
        <p>&ldquo;{quote.text}&rdquo;</p>
        <footer>— {quote.author}</footer>
      </motion.blockquote>

      {/* Summary */}
      <motion.section variants={fadeUp} aria-label="Daily summary">
        <DailySummaryCard
          habitsTotal={habits.length}
          habitsDone={doneCount}
        />
      </motion.section>

      {/* Today's Habits */}
      <motion.section className={styles.section} variants={fadeUp}>
        <h2 className={styles.sectionTitle}>
          Today&apos;s Habits
          {habits.length > 0 && (
            <span className={styles.badge}>
              {doneCount}/{habits.length}
            </span>
          )}
        </h2>

        {isLoading ? (
          <p className={styles.loading}>Loading habits…</p>
        ) : habits.length === 0 ? (
          <p className={styles.empty}>
            No habits yet —{' '}
            <a href="/habits" className={styles.link}>add one</a>
          </p>
        ) : (
          <div className={styles.list}>
            {habits.map((habit) => (
              <HabitRow key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </motion.section>

      {/* Focus Timer */}
      <motion.section
        className={styles.timerSection}
        variants={fadeUp}
        aria-label="Focus timer"
      >
        <h2 className={styles.sectionTitle}>Focus Timer</h2>
        <FocusTimer />
      </motion.section>
    </motion.div>
  )
}