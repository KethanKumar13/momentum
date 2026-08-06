import { Pencil, Trash2, Plus } from "lucide-react";
import { useGoalsStore } from "@/store/goalsStore";
import { GoalProgressBar } from "./GoalProgressBar";
import styles from "./GoalCard.module.css";

export function GoalCard({ goal, onEdit }) {
  const {
    deleteGoal,
    incrementProgress,
  } = useGoalsStore();

  const isDone =
    goal.progress >= goal.target;

  return (
    <article
      className={`${styles.card} ${
        isDone ? styles.done : ""
      }`}
    >
      <div className={styles.top}>
        <div className={styles.meta}>
          <span className={styles.category}>
            {goal.category}
          </span>

          <span className={styles.dot}>
            ·
          </span>

          <span className={styles.timeframe}>
            {goal.timeframe}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => onEdit(goal)}
            aria-label="Edit goal"
          >
            <Pencil size={14} />
          </button>

          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={() => deleteGoal(goal.id)}
            aria-label="Delete goal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className={styles.title}>
        {isDone && (
          <span className={styles.badge}>
            ✓ Done
          </span>
        )}

        {goal.title}
      </h3>

      {goal.description && (
        <p className={styles.description}>
          {goal.description}
        </p>
      )}

      <GoalProgressBar
        progress={goal.progress}
        target={goal.target}
      />

      {!isDone && (
        <button
          className={styles.incrementBtn}
          onClick={() =>
            incrementProgress(goal.id)
          }
        >
          <Plus size={14} />
          Log progress
        </button>
      )}
    </article>
  );
}