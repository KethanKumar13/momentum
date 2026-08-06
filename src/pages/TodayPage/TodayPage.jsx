import { motion } from "framer-motion";
import { format } from "date-fns";

import { useGreeting } from "@/hooks/useGreeting";
import { useTodayStore } from "@/store/todayStore";
import { DailySummaryCard } from "@/components/today/DailySummaryCard";
import { HabitRow } from "@/components/today/HabitRow";
import { TaskItem } from "@/components/today/TaskItem";
import { FocusTimer } from "@/components/today/FocusTimer";

import styles from "./TodayPage.module.css";

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export default function TodayPage() {
  const { greeting, quote } = useGreeting("Kethan");

  const {
    habits,
    tasks,
    toggleHabit,
    toggleTask,
  } = useTodayStore();

  const today = format(new Date(), "EEEE, MMMM d");

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
        {/* ── Header ── */}
        <motion.header
          className={styles.header}
          variants={fadeUp}
        >
          <div>
            <p className={styles.date}>
              {today}
            </p>

            <h1 className={styles.greeting}>
              {greeting}, Kethan 👋
            </h1>
          </div>
        </motion.header>

        {/* ── Daily quote ── */}
        <motion.blockquote
          className={styles.quote}
          variants={fadeUp}
        >
          <p>
            &ldquo;{quote.text}&rdquo;
          </p>

          <footer>
            — {quote.author}
          </footer>
        </motion.blockquote>

        {/* ── Summary ── */}
        <motion.section
          variants={fadeUp}
          aria-label="Daily summary"
        >
          <DailySummaryCard
            habits={habits}
            tasks={tasks}
          />
        </motion.section>

        {/* ── Two-column grid ── */}
        <div className={styles.grid}>
          <motion.section
            className={styles.section}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>
              Today&apos;s Habits
            </h2>

            <div className={styles.list}>
              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            className={styles.section}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>
              Today&apos;s Tasks
            </h2>

            <div className={styles.list}>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </motion.section>
        </div>

        {/* ── Focus Timer ── */}
        <motion.section
          className={styles.timerSection}
          variants={fadeUp}
          aria-label="Focus timer"
        >
          <h2 className={styles.sectionTitle}>
            Focus Timer
          </h2>

          <FocusTimer />
        </motion.section>
      </motion.div>
    </main>
  );
}