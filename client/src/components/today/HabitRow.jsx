import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import styles from "./HabitRow.module.css";

export function HabitRow({ habit, onToggle }) {
  return (
    <motion.button
      className={`${styles.row} ${habit.completedToday ? styles.done : ""}`}
      onClick={() => onToggle(habit.id)}
      whileTap={{ scale: 0.98 }}
      aria-pressed={habit.completedToday}
      aria-label={`${habit.label} — ${habit.completedToday ? "completed" : "not completed"}`}
    >
      <span
        className={styles.icon}
        aria-hidden="true"
      >
        {habit.icon}
      </span>

      <span className={styles.label}>
        {habit.label}
      </span>

      <span
        className={styles.streak}
        aria-label={`${habit.streak} day streak`}
      >
        <Flame
          size={13}
          aria-hidden="true"
        />
        {habit.streak}
      </span>

      <span
        className={styles.checkbox}
        aria-hidden="true"
      >
        {habit.completedToday ? "✓" : ""}
      </span>
    </motion.button>
  );
}