import styles from './StatCard.module.css'

/**
 * StatCard
 * @param {ReactNode} icon    — a Lucide icon element, e.g. <Target size={18} />
 * @param {string}    accent  — 'primary' | 'success' | 'warning' | 'info' | 'default'
 * @param {string}    label
 * @param {string}    value
 * @param {string}    sub
 */
export function StatCard({ icon, accent = 'default', label, value, sub }) {
  return (
    <div className={`${styles.card} ${styles[accent]}`}>
      <div className={styles.iconTile}>
        {icon}
      </div>

      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  )
}
