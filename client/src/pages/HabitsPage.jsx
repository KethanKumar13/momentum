import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useHabits } from '@/hooks/useHabits'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitFormModal } from '@/components/habits/HabitFormModal'
import { PlanLimitBanner } from '@/components/PlanLimitBanner'
import styles from './HabitsPage.module.css'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly_count', label: 'Weekly' },
  { key: 'specific_days', label: 'Specific days' },
]

export default function HabitsPage() {
  const { data: habits = [], isLoading } = useHabits()
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHabit, setEditing] = useState(null)

  const filtered =
    filter === 'all'
      ? habits
      : habits.filter((h) => h.frequencyType === filter)

  const doneCount = habits.filter(
    (h) => h.todayLog?.status === 'done'
  ).length

  function handleEdit(habit) {
    setEditing(habit)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditing(null)
  }

  return (
    <>
      <motion.div
        className={styles.inner}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.header className={styles.header} variants={fadeUp}>
          <div>
            <p className={styles.sub}>Your habits</p>
            <h1 className={styles.heading}>Habits</h1>
            <p className={styles.meta}>
              {doneCount} of {habits.length} completed today
            </p>
          </div>

          <button
            className={styles.addBtn}
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} />
            New habit
          </button>
        </motion.header>

        <PlanLimitBanner
          current={habits.length}
          max={5}
          kind="active habits"
        />

        <motion.div className={styles.filters} variants={fadeUp}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${
                filter === f.key ? styles.active : ''
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        <motion.div className={styles.list} variants={stagger}>
          {isLoading ? (
            <p className={styles.empty}>Loading…</p>
          ) : filtered.length === 0 ? (
            <motion.p className={styles.empty} variants={fadeUp}>
              No habits yet. Add your first one!
            </motion.p>
          ) : (
            filtered.map((habit) => (
              <motion.div key={habit.id} variants={fadeUp}>
                <HabitCard habit={habit} onEdit={handleEdit} />
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>

      <HabitFormModal
        open={modalOpen}
        onClose={handleClose}
        habit={editingHabit}
      />
    </>
  )
}
