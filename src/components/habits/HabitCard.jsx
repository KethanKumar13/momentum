import { Pencil, Trash2, Flame } from "lucide-react";
import { useHabitsStore } from "@/store/habitsStore";
import styles from "./HabitCard.module.css";

export function HabitCard({ habit, onEdit }) {
  const { toggleHabit, deleteHabit } = useHabitsStore();

  return (
    <div
      className={`${styles.card} ${
        habit.completedToday ? styles.done : ""
      }`}
    >
      <button
        className={styles.checkArea}
        onClick={() => toggleHabit(habit.id)}
        aria-label={
          habit.completedToday
            ? "Mark incomplete"
            : "Mark complete"
        }
      >
        <span className={styles.icon}>
          {habit.icon}
        </span>

        <span className={styles.check}>
          {habit.completedToday ? "✓" : ""}
        </span>
      </button>

      <div className={styles.body}>
        <p className={styles.label}>
          {habit.label}
        </p>

        <span className={styles.category}>
          {habit.category}
        </span>
      </div>

      <div className={styles.streak}>
        <Flame size={14} />
        <span>{habit.streak}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={() => onEdit(habit)}
          aria-label="Edit habit"
        >
          <Pencil size={14} />
        </button>

        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={() => deleteHabit(habit.id)}
          aria-label="Delete habit"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}