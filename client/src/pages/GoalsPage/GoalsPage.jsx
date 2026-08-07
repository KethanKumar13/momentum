import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useGoalsStore } from "@/store/goalsStore";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalFormModal } from "@/components/goals/GoalFormModal";
import styles from "./GoalsPage.module.css";

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function GoalsPage() {
  const { goals } = useGoalsStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditing] = useState(null);

  const done = goals.filter(
    (goal) => goal.progress >= goal.target
  ).length;

  const inProgress = goals.length - done;

  function handleEdit(goal) {
    setEditing(goal);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditing(null);
  }

  return (
    <main
      id="main-content"
      className={styles.page}
    >
      <motion.div
        className={styles.inner}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.header
          className={styles.header}
          variants={fadeUp}
        >
          <div>
            <p className={styles.sub}>
              What you are working toward
            </p>

            <h1 className={styles.heading}>
              Goals
            </h1>

            <p className={styles.meta}>
              {inProgress} in progress · {done} completed
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

        {/* Goals grid */}
        {goals.length === 0 ? (
          <motion.p
            className={styles.empty}
            variants={fadeUp}
          >
            No goals yet. Add one to start tracking your progress!
          </motion.p>
        ) : (
          <motion.div
            className={styles.grid}
            variants={stagger}
          >
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                variants={fadeUp}
              >
                <GoalCard
                  goal={goal}
                  onEdit={handleEdit}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <GoalFormModal
        open={modalOpen}
        onClose={handleClose}
        goal={editingGoal}
      />
    </main>
  );
}