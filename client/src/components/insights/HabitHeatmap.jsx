import styles from "./HabitHeatmap.module.css";

export function HabitHeatmap({ days }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {days.map((day, index) => {
          const pct =
            day.max > 0
              ? day.intensity / day.max
              : 0;

          const level =
            pct === 0
              ? 0
              : pct < 0.25
                ? 1
                : pct < 0.5
                  ? 2
                  : pct < 0.75
                    ? 3
                    : 4;

          return (
            <div
              key={index}
              className={`${styles.cell} ${styles[`level${level}`]}`}
              title={`${day.label}: ${day.intensity}/${day.max} habits`}
              aria-label={`${day.label}: ${day.intensity} out of ${day.max} habits`}
            />
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>
          Less
        </span>

        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`${styles.cell} ${styles[`level${level}`]}`}
          />
        ))}

        <span className={styles.legendLabel}>
          More
        </span>
      </div>
    </div>
  );
}