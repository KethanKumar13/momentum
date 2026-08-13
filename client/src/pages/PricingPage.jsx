import { Link } from 'react-router-dom'
import { Check, Sparkles, ArrowLeft } from 'lucide-react'
import styles from './PricingPage.module.css'

const FREE = [
  '3 goals',
  '5 active habits',
  'Full journal',
  'Weekly reviews',
  'Insights & heatmaps',
  'Daily & weekly email reminders',
  'Data export (JSON + CSV)',
]

const PRO = [
  'Unlimited goals & habits',
  'Full history (no 30-day cap)',
  'AI weekly summary',
  'AI coach chat',
  'Voice journaling',
  'Priority support',
]

export function PricingPage() {
  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={14} /> Back
      </Link>

      <header className={styles.header}>
        <h1 className={styles.h1}>Simple pricing</h1>
        <p className={styles.sub}>
          Momentum is free while we're in beta. Paid Pro plans are coming
          soon — early beta users will get a discount at launch.
        </p>
      </header>

      <div className={styles.grid}>
        {/* Free */}
        <div className={styles.card}>
          <span className={styles.badgeGreen}>Available now</span>
          <p className={styles.tier}>Free (Beta)</p>
          <p className={styles.price}>
            ₹0<span className={styles.per}>/month</span>
          </p>
          <p className={styles.tag}>Everything you need to get started.</p>
          <ul className={styles.features}>
            {FREE.map((f) => (
              <li key={f}><Check size={14} /> {f}</li>
            ))}
          </ul>
          <Link to="/signup" className={styles.primary}>
            Sign up free
          </Link>
        </div>

        {/* Pro */}
        <div className={`${styles.card} ${styles.pro}`}>
          <span className={styles.badge}>Coming soon</span>
          <p className={styles.tier}>Pro</p>
          <p className={styles.price}>—</p>
          <p className={styles.tag}>Everything in Free, plus:</p>
          <ul className={styles.features}>
            {PRO.map((f) => (
              <li key={f}><Sparkles size={14} /> {f}</li>
            ))}
          </ul>
          <button className={styles.secondary} disabled>
            Notify me
          </button>
        </div>
      </div>

      <p className={styles.legal}>
        By signing up you agree to our{' '}
        <Link to="/terms">Terms</Link> and{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  )
}
