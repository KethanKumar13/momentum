import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import {
  MOODS,
  useJournalStore,
} from "@/store/journalStore";
import styles from "./JournalEntryCard.module.css";

export function JournalEntryCard({
  entry,
  onEdit,
}) {
  const { deleteEntry } =
    useJournalStore();

  const mood = MOODS.find(
    (item) =>
      item.value === entry.mood
  );

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.meta}>
          <span className={styles.date}>
            {format(
              new Date(entry.date),
              "EEE, MMM d · h:mm a"
            )}
          </span>

          {mood && (
            <span
              className={styles.mood}
              title={mood.label}
            >
              {mood.emoji}
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onEdit(entry)}
            aria-label="Edit entry"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={() =>
              deleteEntry(entry.id)
            }
            aria-label="Delete entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {entry.title && (
        <h3 className={styles.title}>
          {entry.title}
        </h3>
      )}

      <p className={styles.body}>
        {entry.body}
      </p>

      {entry.tags?.length > 0 && (
        <div className={styles.tags}>
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}