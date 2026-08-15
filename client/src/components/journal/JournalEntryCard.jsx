import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteJournal } from '@/hooks/useJournal'
import { MoodEmoji } from '@/components/ui/MoodEmoji'
import styles from './JournalEntryCard.module.css'

// Human-readable labels for the aria-label / title tooltip
const MOOD_LABEL = {
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  bad: 'Bad',
  awful: 'Awful',
}

export function JournalEntryCard({ entry, onEdit }) {
  const remove = useDeleteJournal()

  function handleDelete() {
    if (confirm('Delete this journal entry?')) {
      remove.mutate(entry.date)
    }
  }

  // Strip HTML tags for preview
  const preview = entry.content
    ? entry.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  const moodLabel = MOOD_LABEL[entry.mood]

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.date}>
            {format(new Date(`${entry.date}T00:00:00`), 'EEE, MMM d')}
          </span>

          {entry.mood && (
            <span
              className={styles.mood}
              title={moodLabel ?? entry.mood}
              aria-label={`Mood: ${moodLabel ?? entry.mood}`}
            >
              <MoodEmoji mood={entry.mood} size={18} />
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
            onClick={handleDelete}
            disabled={remove.isPending}
            aria-label="Delete entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {entry.title && (
        <h3 className={styles.title}>{entry.title}</h3>
      )}

      {preview && (
        <p className={styles.body}>
          {preview.length > 200 ? `${preview.slice(0, 200)}…` : preview}
        </p>
      )}

      {entry.tags && (
        <div className={styles.tags}>
          {entry.tags
            .split(',')
            .filter(Boolean)
            .map((tag) => (
              <span key={tag.trim()} className={styles.tag}>
                #{tag.trim()}
              </span>
            ))}
        </div>
      )}
    </article>
  )
}
