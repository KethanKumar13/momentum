import { motion } from "framer-motion";
import styles from "./TaskItem.module.css";

const PRIORITY_LABELS = {
  high: "🔴 High",
  medium: "🟡 Medium",
  low: "🟢 Low",
};

export function TaskItem({ task, onToggle }) {
  return (
    <motion.button
      className={`${styles.item} ${task.done ? styles.done : ""} ${styles[task.priority]}`}
      onClick={() => onToggle(task.id)}
      whileTap={{ scale: 0.98 }}
      aria-pressed={task.done}
      aria-label={`${task.label} — ${task.done ? "completed" : "pending"} — priority ${task.priority}`}
    >
      <span
        className={styles.checkbox}
        aria-hidden="true"
      >
        {task.done ? "✓" : ""}
      </span>

      <span className={styles.label}>
        {task.label}
      </span>

      <span
        className={styles.priority}
        aria-hidden="true"
      >
        {PRIORITY_LABELS[task.priority]}
      </span>
    </motion.button>
  );
}