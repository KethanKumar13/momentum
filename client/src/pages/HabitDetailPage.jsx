import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { habitService } from '../services/habitService'
import styles from './Page.module.css'

export default function HabitDetailPage() {
  const { id } = useParams()
  const year = new Date().getFullYear()

  const habit = useQuery({
    queryKey: ['habit', id],
    queryFn: () => habitService.get(id),
  })

  const heatmap = useQuery({
    queryKey: ['habit', id, 'heatmap', year],
    queryFn: () => habitService.heatmap(id, year),
  })

  if (habit.isLoading) return <p>Loading…</p>
  if (habit.isError) return <p>Habit not found.</p>

  const h = habit.data

  return (
    <div className={styles.inner}>
      <Link to="/habits">← All habits</Link>

      <header style={{ marginTop: 16 }}>
        <h1 style={{ color: h.color }}>
          {h.icon} {h.title}
        </h1>

        <p>
          Current streak: <strong>{h.currentStreak}d</strong> ·
          Longest: <strong>{h.longestStreak}d</strong> ·
          Frequency: {h.frequencyType}
        </p>
      </header>

      <section style={{ marginTop: 32 }}>
        <h2>Year heatmap — {year}</h2>

        {heatmap.isLoading ? (
          <p>Loading heatmap…</p>
        ) : (
          <Heatmap days={heatmap.data.days} color={h.color} />
        )}
      </section>
    </div>
  )
}

function Heatmap({ days, color }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(53, 12px)',
        gridAutoRows: '12px',
        gap: 2,
        marginTop: 12,
      }}
    >
      {days.map((d) => {
        const bg =
          d.status === 'done'
            ? color
            : d.status === 'skip'
              ? 'var(--surface-hover)'
              : d.status === 'miss'
                ? '#EF4444'
                : 'var(--surface)'

        return (
          <div
            key={d.date}
            title={`${d.date} — ${d.status}`}
            style={{
              background: bg,
              borderRadius: 2,
              opacity: d.status === 'none' ? 0.3 : 1,
            }}
          />
        )
      })}
    </div>
  )
}
