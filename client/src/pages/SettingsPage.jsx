import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Zap, User, Bell, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { exportService } from '@/services/exportService'
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
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

export default function SettingsPage() {
  const { user, logout } = useAuth()

  const [exporting, setExporting] = useState(null)

  async function handleExport(type) {
    setExporting(type)

    try {
      if (type === 'json') {
        await exportService.downloadJson()
      }

      if (type === 'csv') {
        await exportService.downloadCsv()
      }
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

    if (!confirm('Last chance — delete everything?')) {
      return
    }

    // TODO Day 18: call DELETE /api/users/me
    alert(
      'Account deletion coming soon. Contact support@momentum.app in the meantime.'
    )
  }

  return (
    <motion.div
      className={styles.inner}
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header className={styles.header} variants={fadeUp}>
        <p className={styles.sub}>Preferences</p>
        <h1 className={styles.heading}>Settings</h1>
      </motion.header>

      {/* Profile */}
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

          {/* Plan badge */}
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

      {/* Notifications */}
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

      {/* Data Export */}
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
          <div className={styles.exportCard}>
            <p className={styles.exportTitle}>Full export</p>
            <p className={styles.exportSub}>
              Goals, habits, journal, reviews
            </p>

            <button
              type="button"
              className={styles.exportBtn}
              onClick={() => handleExport('json')}
              disabled={exporting === 'json'}
            >
              {exporting === 'json'
                ? 'Exporting…'
                : 'Download JSON'}
            </button>
          </div>

          <div className={styles.exportCard}>
            <p className={styles.exportTitle}>Habit logs</p>
            <p className={styles.exportSub}>
              Every log entry in flat CSV
            </p>

            <button
              type="button"
              className={styles.exportBtn}
              onClick={() => handleExport('csv')}
              disabled={exporting === 'csv'}
            >
              {exporting === 'csv'
                ? 'Exporting…'
                : 'Download CSV'}
            </button>
          </div>
        </div>
      </motion.section>

      {/* Danger zone */}
      <motion.section
        className={`${styles.section} ${styles.dangerSection}`}
        variants={fadeUp}
      >
        <div className={styles.sectionHeader}>
          <Trash2
            size={16}
            className={styles.dangerIcon}
          />

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
        >
          Delete my account
        </button>
      </motion.section>
    </motion.div>
  )
}
