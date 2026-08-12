import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Zap, User, Bell, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { exportService } from '@/services/exportService'
import { capture, EVENTS } from '@/lib/analytics'
import styles from './SettingsPage.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const EXPORTERS = {
  json: () => exportService.downloadJson(),
  csv: () => exportService.downloadCsv(),
}

export default function SettingsPage() {
  const { user, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [exporting, setExporting] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleExport(type) {
    const fn = EXPORTERS[type]
    if (!fn) return

    setExporting(type)

    try {
      await fn()
      capture(EVENTS.EXPORT_DOWNLOADED, { format: type })
    } catch (err) {
      capture('export_failed', {
        format: type,
        reason: err.response?.data?.message ?? 'unknown',
      })
    } finally {
      setExporting(null)
    }
  }

  async function handleDeleteAccount() {
    if (
      !confirm(
        'Are you sure? This permanently deletes all your data and cannot be undone.'
      )
    ) {
      return
    }

    if (!confirm('Last chance — delete everything?')) return

    setDeleting(true)

    try {
      await deleteAccount()
      navigate('/', { replace: true })
    } catch (err) {
      alert(
        err.response?.data?.message ??
          'Could not delete account. Please try again or contact support.'
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      className={styles.inner}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header className={styles.header} variants={fadeUp}>
        <p className={styles.sub}>Preferences</p>
        <h1 className={styles.heading}>Settings</h1>
      </motion.header>

      <motion.section className={styles.section} variants={fadeUp}>
        <div className={styles.sectionHeader}>
          <User size={16} />
          <h2 className={styles.sectionTitle}>Profile</h2>
        </div>

        <div className={styles.profileRow}>
          <div className={styles.avatar}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>

          <div>
            <p className={styles.profileName}>{user?.name ?? '—'}</p>
            <p className={styles.profileEmail}>{user?.email ?? '—'}</p>
          </div>

          <span
            className={`${styles.planBadge} ${
              user?.plan === 'pro'
                ? styles.planPro
                : styles.planFree
            }`}
          >
            {user?.plan === 'pro' ? '⚡ Pro' : 'Free'}
          </span>
        </div>

        {user?.plan !== 'pro' && (
          <div className={styles.upgradeBox}>
            <Zap size={16} className={styles.upgradeIcon} />

            <div>
              <p className={styles.upgradeTitle}>Upgrade to Pro</p>
              <p className={styles.upgradeSub}>
                Unlimited habits, goals, and priority support.
              </p>
            </div>

            <button
              className={styles.upgradeBtn}
              type="button"
              onClick={() => capture(EVENTS.CHECKOUT_STARTED)}
            >
              Upgrade →
            </button>
          </div>
        )}

        {user?.plan === 'free' && (
          <div className={styles.limitsRow}>
            <span className={styles.limit}>3 goals max</span>
            <span className={styles.limitDivider}>·</span>
            <span className={styles.limit}>5 habits max</span>
          </div>
        )}
      </motion.section>

      <motion.section className={styles.section} variants={fadeUp}>
        <div className={styles.sectionHeader}>
          <Bell size={16} />
          <h2 className={styles.sectionTitle}>Notifications</h2>
        </div>

        <div className={styles.noticeBox}>
          <p>
            Email reminders are sent automatically — daily at{' '}
            <strong>8 AM UTC</strong> for due habits, and every{' '}
            <strong>Sunday at 6 PM UTC</strong> for your weekly review.
          </p>

          <p className={styles.noticeSmall}>
            Per-habit reminder times and notification preferences will
            be configurable in a future update.
          </p>
        </div>
      </motion.section>

      <motion.section className={styles.section} variants={fadeUp}>
        <div className={styles.sectionHeader}>
          <Download size={16} />
          <h2 className={styles.sectionTitle}>Export your data</h2>
        </div>

        <p className={styles.sectionDesc}>
          Download everything — your goals, habits, logs, journal,
          and weekly reviews. Your data is always yours.
        </p>

        <div className={styles.exportRow}>
          <ExportCard
            title="Full export"
            sub="Goals, habits, journal, reviews"
            format="json"
            label="Download JSON"
            exporting={exporting}
            onExport={handleExport}
          />

          <ExportCard
            title="Habit logs"
            sub="Every log entry in flat CSV"
            format="csv"
            label="Download CSV"
            exporting={exporting}
            onExport={handleExport}
          />
        </div>
      </motion.section>

      <motion.section
        className={`${styles.section} ${styles.dangerSection}`}
        variants={fadeUp}
      >
        <div className={styles.sectionHeader}>
          <Trash2 size={16} className={styles.dangerIcon} />

          <h2
            className={`${styles.sectionTitle} ${styles.dangerTitle}`}
          >
            Danger zone
          </h2>
        </div>

        <p className={styles.sectionDesc}>
          Permanently delete your account and all associated data.
          This cannot be undone.
        </p>

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete my account'}
        </button>
      </motion.section>
    </motion.div>
  )
}

function ExportCard({
  title,
  sub,
  format,
  label,
  exporting,
  onExport,
}) {
  const busy = exporting === format

  return (
    <div className={styles.exportCard}>
      <p className={styles.exportTitle}>{title}</p>
      <p className={styles.exportSub}>{sub}</p>

      <button
        type="button"
        className={styles.exportBtn}
        onClick={() => onExport(format)}
        disabled={busy}
      >
        {busy ? 'Exporting…' : label}
      </button>
    </div>
  )
}
