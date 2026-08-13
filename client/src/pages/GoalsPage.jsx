import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useGoals } from '@/hooks/useGoals'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalFormModal } from '@/components/goals/GoalFormModal'
import { PlanLimitBanner } from '@/components/PlanLimitBanner'
import styles from './GoalsPage.module.css'

const CATEGORIES = [
  'All',
  'Health',
  'Career',
  'Learning',
  'Finance',
  'Relationships',
  'Personal',
]

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

export default function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals()
  const [category, setCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const filtered =
    category === 'All'
      ? goals
      : goals.filter((goal) => goal.category === category)

  function handleEdit(goal) {
    setEditingGoal(goal)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditingGoal(null)
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
            <p className={styles.sub}>What you're working toward</p>
            <h1 className={styles.heading}>Goals</h1>
            <p className={styles.meta}>
              {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
            </p>
          </div>

          <button
            className={styles.addBtn}
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} />
            New goal
          </button>
        </motion.header>

        <PlanLimitBanner
          current={goals.length}
          max={3}
          kind="goals"
        />

        <motion.div className={styles.filters} variants={fadeUp}>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.filterBtn} ${
                category === item ? styles.active : ''
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </motion.div>

        <motion.div className={styles.grid} variants={stagger}>
          {isLoading ? (
            <p className={styles.empty}>Loading…</p>
          ) : filtered.length === 0 ? (
            <motion.p className={styles.empty} variants={fadeUp}>
              No goals yet. Create your first one!
            </motion.p>
          ) : (
            filtered.map((goal) => (
              <motion.div key={goal.id} variants={fadeUp}>
                <GoalCard
                  goal={goal}
                  onEdit={handleEdit}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>

      <GoalFormModal
        open={modalOpen}
        onClose={handleClose}
        goal={editingGoal}
      />
    </>
  )
}
