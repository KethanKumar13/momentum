import styles from "./MoodChart.module.css";

export function MoodChart({
  moodCounts,
}) {
  const max = Math.max(
    ...moodCounts.map(
      (mood) => mood.count
    ),
    1
  );

  return (
    <div className={styles.wrap}>
      {moodCounts.map((mood) => (
        <div
          key={mood.value}
          className={styles.row}
        >
          <span className={styles.emoji}>
            {mood.emoji}
          </span>

          <span className={styles.label}>
            {mood.label}
          </span>

          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                width: `${
                  (mood.count / max) * 100
                }%`,
              }}
            />
          </div>

          <span className={styles.count}>
            {mood.count}
          </span>
        </div>
      ))}
    </div>
  );
}