import { Flame } from "lucide-react";
import styles from "./TopHabitsTable.module.css";

export function TopHabitsTable({
  habits,
}) {
  return (
    <div className={styles.wrap}>
      {habits.map((habit, index) => (
        <div
          key={habit.id}
          className={styles.row}
        >
          <span className={styles.rank}>
            #{index + 1}
          </span>

          <span className={styles.icon}>
            {habit.icon}
          </span>

          <div className={styles.info}>
            <p className={styles.label}>
              {habit.label}
            </p>

            <p className={styles.category}>
              {habit.category}
            </p>
          </div>

          <div className={styles.streak}>
            <Flame size={13} />
            <span>
              {habit.streak} day streak
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}