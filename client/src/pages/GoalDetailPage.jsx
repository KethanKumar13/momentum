import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { goalService } from '../services/goalService'
import styles from './Page.module.css'

export default function GoalDetailPage() {
  const { id } = useParams()

  const goal = useQuery({
    queryKey: ['goal', id],
    queryFn: () => goalService.get(id),
  })

  if (goal.isLoading) return <p>Loading…</p>
  if (goal.isError) return <p>Goal not found.</p>

  const g = goal.data

  return (
    <div className={styles.inner}>
      <Link to="/goals">← All goals</Link>

      <header style={{ marginTop: 16 }}>
        <p>{g.category}</p>
        <h1>{g.title}</h1>

        {g.why && <p><em>Why: {g.why}</em></p>}

        <p>
          Progress: <strong>{g.progressPct}%</strong> ·
          Status: {g.status} ·
          {g.targetDate && ` Target: ${g.targetDate}`}
        </p>
      </header>

      <section style={{ marginTop: 32 }}>
        <h2>Linked habits ({g.habits?.length ?? 0})</h2>

        {(!g.habits || g.habits.length === 0) ? (
          <p>No habits linked to this goal yet.</p>
        ) : (
          <ul>
            {g.habits.map((h) => (
              <li key={h.id} style={{ margin: '8px 0' }}>
                <Link
                  to={`/habits/${h.id}`}
                  style={{ color: h.color }}
                >
                  {h.icon} {h.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
