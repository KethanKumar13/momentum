import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useHabitsStore } from "@/store/habitsStore";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { HabitFilterBar } from "@/components/habits/HabitFilterBar";
import styles from "./HabitsPage.module.css";

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

export default function HabitsPage() {
  const { habits, activeFilter } = useHabitsStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditing] = useState(null);

  const filtered =
    activeFilter === "All"
      ? habits
      : habits.filter(
          (habit) => habit.category === activeFilter
        );

  const completed = habits.filter(
    (habit) => habit.completedToday
  ).length;

  function handleEdit(habit) {
    setEditing(habit);
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
              Your habits
            </p>

            <h1 className={styles.heading}>
              Habits
            </h1>

            <p className={styles.meta}>
              {completed} of {habits.length} completed today
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

        {/* Filter bar */}
        <motion.div variants={fadeUp}>
          <HabitFilterBar />
        </motion.div>

        {/* List */}
        <motion.div
          className={styles.list}
          variants={stagger}
        >
          {filtered.length === 0 ? (
            <motion.p
              className={styles.empty}
              variants={fadeUp}
            >
              No habits in this category yet.
            </motion.p>
          ) : (
            filtered.map((habit) => (
              <motion.div
                key={habit.id}
                variants={fadeUp}
              >
                <HabitCard
                  habit={habit}
                  onEdit={handleEdit}
                />
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
    </main>
  );
}