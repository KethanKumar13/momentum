import { useGoalsStore } from "@/store/goalsStore";
import { GoalProgressBar } from "@/components/goals/GoalProgressBar";
import styles from "./GoalsSummary.module.css";

export function GoalsSummary() {
  const { goals } = useGoalsStore();

  const top = goals.slice(0, 4);

  return (
    <div className={styles.wrap}>
      {top.map((goal) => (
        <div
          key={goal.id}
          className={styles.row}
        >
          <div className={styles.info}>
            <p className={styles.title}>
              {goal.title}
            </p>

            <p className={styles.category}>
              {goal.category} · {goal.timeframe}
            </p>
          </div>

          <div className={styles.bar}>
            <GoalProgressBar
              progress={goal.progress}
              target={goal.target}
            />
          </div>
        </div>
      ))}
    </div>
  );
}