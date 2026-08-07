import { MOODS } from "@/store/journalStore";
import styles from "./MoodPicker.module.css";

export function MoodPicker({
  value,
  onChange,
}) {
  return (
    <div
      className={styles.wrap}
      role="group"
      aria-label="Select your mood"
    >
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          type="button"
          className={`${styles.btn} ${
            value === mood.value
              ? styles.active
              : ""
          }`}
          onClick={() =>
            onChange(mood.value)
          }
          title={mood.label}
          aria-pressed={
            value === mood.value
          }
        >
          <span className={styles.emoji}>
            {mood.emoji}
          </span>

          <span className={styles.label}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}