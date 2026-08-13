import { motion } from 'framer-motion'
import { Sparkles, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './BillingPage.module.css'

const FREE_FEATURES = [
  'Up to 3 goals',
  'Up to 5 active habits',
  'Full journal',
  'Daily & weekly emails',
  'Insights & heatmaps',
  'Data export (JSON + CSV)',
]

const PRO_TEASER = [
  'Unlimited goals & habits',
  'Full history (no 30-day cap)',
  'AI coach & weekly summary',
  'Voice journaling',
  'Priority support',
]

export default function BillingPage() {
  return (
    <motion.div
      className={styles.inner}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className={styles.header}>
        <p className={styles.sub}>Billing</p>
        <h1 className={styles.heading}>Free during beta</h1>
        <p className={styles.meta}>
          Momentum is 100% free while we gather feedback from early users.
          Paid plans are on the roadmap.
        </p>
      </header>

      <section className={styles.plans}>
        <div className={styles.plan}>
          <span className={styles.badgeGreen}>Current plan</span>
          <h2 className={styles.planLabel}>Free (Beta)</h2>
          <p className={styles.price}>
            ₹0<span className={styles.period}>/mo</span>
          </p>

          <ul className={styles.featureList}>
            {FREE_FEATURES.map((f) => (
              <li key={f}>
                <Check size={14} /> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.plan} ${styles.highlight}`}>
          <span className={styles.badge}>Coming soon</span>
          <h2 className={styles.planLabel}>Pro</h2>
          <p className={styles.price}>—</p>

          <p className={styles.planSub}>
            Pricing not final. Early beta users get a discount at launch.
          </p>

          <ul className={styles.featureList}>
            {PRO_TEASER.map((f) => (
              <li key={f}>
                <Sparkles size={14} /> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={styles.footer}>
        <Link to="/settings" className={styles.backLink}>
          ← Back to settings
        </Link>

        <p className={styles.helpText}>
          Have feedback? Reply to any Momentum email — we read every one.
        </p>
      </div>
    </motion.div>
  )
}
