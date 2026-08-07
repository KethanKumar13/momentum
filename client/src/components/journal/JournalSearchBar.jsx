import { Search, X } from "lucide-react";
import styles from "./JournalSearchBar.module.css";

export function JournalSearchBar({
  value,
  onChange,
}) {
  return (
    <div className={styles.wrap}>
      <Search
        size={15}
        className={styles.icon}
      />

      <input
        className={styles.input}
        type="search"
        placeholder="Search entries..."
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        aria-label="Search journal entries"
      />

      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}