import { MoodEmoji } from '@/components/ui/MoodEmoji'
import styles from './MoodPicker.module.css'

const MOODS = [
  { value: 'great', label: 'Great' },
  { value: 'good', label: 'Good' },
  { value: 'okay', label: 'Okay' },
  { value: 'bad', label: 'Bad' },
  { value: 'awful', label: 'Awful' },
]

export function MoodPicker({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      {MOODS.map((m) => {
        const active = value === m.value

        return (
          <button
            key={m.value}
            type="button"
            className={`${styles.btn} ${active ? styles.active : ''}`}
            onClick={() => onChange(m.value)}
            aria-pressed={active}
            aria-label={m.label}
          >
            <MoodEmoji mood={m.value} size={36} />
            <span className={styles.label}>{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}
