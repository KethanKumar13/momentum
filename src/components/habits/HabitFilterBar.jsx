import { useHabitsStore, CATEGORIES } from "@/store/habitsStore";
import styles from "./HabitFilterBar.module.css";

const ALL_FILTERS = [
  "All",
  ...CATEGORIES,
];

export function HabitFilterBar() {
  const {
    activeFilter,
    setFilter,
  } = useHabitsStore();

  return (
    <div
      className={styles.bar}
      role="group"
      aria-label="Filter habits by category"
    >
      {ALL_FILTERS.map((filter) => (
        <button
          key={filter}
          className={`${styles.chip} ${
            activeFilter === filter ? styles.active : ""
          }`}
          onClick={() => setFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}