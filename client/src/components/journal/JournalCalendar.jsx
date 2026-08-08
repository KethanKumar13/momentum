import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useJournalCalendar } from '@/hooks/useJournal'
import styles from './JournalCalendar.module.css'

const MOOD_EMOJI = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  bad: '😔',
  awful: '😢',
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function JournalCalendar({ onSelectDate, selectedDate }) {
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const { data: calDays = [] } = useJournalCalendar(year, month)

  // Build a lookup: "2026-08-08" → { mood, title }
  const lookup = Object.fromEntries(
    calDays.map((d) => [d.date, d])
  )

  const firstDay = new Date(year, month - 1, 1)

  // ISO: Mon=0 ... Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()

  function prevMonth() {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const todayStr = now.toISOString().slice(0, 10)

  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`

      return {
        d,
        dateStr,
        entry: lookup[dateStr],
      }
    }),
  ]

  return (
    <div className={styles.wrap}>
      {/* Month nav */}
      <div className={styles.nav}>
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>

        <span className={styles.monthLabel}>
          {new Date(year, month - 1).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className={styles.grid}>
        {WEEKDAYS.map((w) => (
          <div key={w} className={styles.weekday}>
            {w}
          </div>
        ))}

        {cells.map((cell, i) =>
          cell === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <button
              key={cell.dateStr}
              type="button"
              className={[
                styles.day,
                cell.entry ? styles.hasEntry : '',
                cell.dateStr === todayStr ? styles.today : '',
                cell.dateStr === selectedDate ? styles.selected : '',
              ].join(' ')}
              onClick={() => onSelectDate?.(cell.dateStr)}
              title={cell.entry?.title ?? cell.dateStr}
            >
              <span className={styles.dayNum}>{cell.d}</span>

              {cell.entry?.mood && (
                <span className={styles.dayMood}>
                  {MOOD_EMOJI[cell.entry.mood] ?? '📝'}
                </span>
              )}

              {cell.entry && !cell.entry.mood && (
                <span className={styles.dot} />
              )}
            </button>
          )
        )}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendDot} />
        <span>Entry written</span>
      </div>
    </div>
  )
}
