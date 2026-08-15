import { MoodEmoji, MOODS } from '@/components/ui/MoodEmoji'
import styles from './MoodPicker.module.css'

export function MoodPicker({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      {MOODS.map((mood) => {
        const active = value === mood.value

        return (
          <button
            key={mood.value}
            type="button"
            className={`${styles.btn} ${
              active ? styles.active : ''
            }`}
            onClick={() => onChange(mood.value)}
            aria-pressed={active}
            aria-label={mood.label}
          >
            <MoodEmoji
              mood={mood.value}
              size={36}
            />

            <span className={styles.label}>
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
