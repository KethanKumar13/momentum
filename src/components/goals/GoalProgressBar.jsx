import styles from "./GoalProgressBar.module.css";

export function GoalProgressBar({
  progress,
  target,
  showLabel = true,
}) {
  const pct =
    target > 0
      ? Math.min(
          100,
          Math.round((progress / target) * 100)
        )
      : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {showLabel && (
        <span className={styles.label}>
          {progress} / {target} &mdash; {pct}%
        </span>
      )}
    </div>
  );
}