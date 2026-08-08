import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useHabits } from '@/hooks/useHabits'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitFormModal } from '@/components/habits/HabitFormModal'
import styles from './HabitsPage.module.css'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function HabitsPage() {
  const { data: habits = [], isLoading } = useHabits()
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHabit, setEditing] = useState(null)

  const categories = ['All', ...new Set(habits.map(h => h.frequencyType))]

  const filtered =
    filter === 'All'
      ? habits
      : habits.filter(h => h.frequencyType === filter)

  const doneCount = habits.filter(h => !h.isDueToday).length

  function handleEdit(habit) {
    setEditing(habit)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditing(null)
  }

  return (
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

      {/* Filter tabs */}
      <motion.div className={styles.filters} variants={fadeUp}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* List */}
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
  )
}