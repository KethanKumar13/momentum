import styles from "./StatCard.module.css";

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}) {
  return (
    <div
      className={`${styles.card} ${
        accent ? styles[accent] : ""
      }`}
    >
      {icon && (
        <span className={styles.icon}>
          {icon}
        </span>
      )}

      <p className={styles.value}>
        {value}
      </p>

      <p className={styles.label}>
        {label}
      </p>

      {sub && (
        <p className={styles.sub}>
          {sub}
        </p>
      )}
    </div>
  );
}