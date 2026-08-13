import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Zap, User, Bell, Trash2, Sparkles } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { exportService } from '@/services/exportService'
import { userService } from '@/services/userService'
import { capture, EVENTS } from '@/lib/analytics'
import styles from './SettingsPage.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const EXPORTERS = {
  json: () => exportService.downloadJson(),
  csv: () => exportService.downloadCsv(),
}

const TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Australia/Sydney',
  'UTC',
]

export default function SettingsPage() {
  const { user, deleteAccount, refresh } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [tz, setTz] = useState(user?.timezone ?? 'Asia/Kolkata')
  const [theme, setTheme] = useState(user?.theme ?? 'dark')
  const [saving, setSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  const [exporting, setExporting] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setProfileMsg('')

    try {
      await userService.updateProfile({
        name,
        timezone: tz,
        theme,
      })

      setProfileMsg('Saved ✓')
      refresh?.()
    } catch (err) {
      setProfileMsg(
        err.response?.data?.message ?? 'Could not save.'
      )
    } finally {
      setSaving(false)
      setTimeout(() => setProfileMsg(''), 3000)
    }
  }

  async function handleExport(type) {
    const fn = EXPORTERS[type]
    if (!fn) return

    setExporting(type)

    try {
      await fn()

      capture(EVENTS.EXPORT_DOWNLOADED, {
        format: type,
      })
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
        'Are you sure? This permanently deletes all your data.'
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
          'Could not delete account.'
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
            <p className={styles.profileEmail}>
              {user?.email ?? '—'}
            </p>
          </div>

          <span
            className={`${styles.planBadge} ${
              user?.plan === 'pro'
                ? styles.planPro
                : styles.planFree
            }`}
          >
            {user?.plan === 'pro' ? '⚡ Pro' : 'Free (Beta)'}
          </span>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSaveProfile}
        >
          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Timezone</span>
            <select
              className={styles.input}
              value={tz}
              onChange={(e) => setTz(e.target.value)}
            >
              {TIMEZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Theme</span>
            <select
              className={styles.input}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <div className={styles.formFooter}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>

            {profileMsg && (
              <span className={styles.savedMsg}>
                {profileMsg}
              </span>
            )}
          </div>
        </form>
      </motion.section>

      {/* Pro coming soon */}
      <motion.section className={styles.section} variants={fadeUp}>
        <div className={styles.sectionHeader}>
          <Sparkles size={16} />
          <h2 className={styles.sectionTitle}>
            Momentum Pro
          </h2>
        </div>

        <div className={styles.upgradeBox}>
          <Zap size={16} className={styles.upgradeIcon} />

          <div>
            <p className={styles.upgradeTitle}>
              Free during beta 💜
            </p>

            <p className={styles.upgradeSub}>
              Momentum is free while we gather feedback. Paid
              plans (Pro, AI coach) are coming soon — you'll be
              the first to know.
            </p>
          </div>

          <Link
            to="/settings/billing"
            className={styles.upgradeBtn}
          >
            Learn more →
          </Link>
        </div>

        <div className={styles.limitsRow}>
          <span className={styles.limit}>3 goals max</span>
          <span className={styles.limitDivider}>·</span>
          <span className={styles.limit}>
            5 active habits max
          </span>
        </div>
      </motion.section>

      {/* Notifications */}
      <motion.section className={styles.section} variants={fadeUp}>
        <div className={styles.sectionHeader}>
          <Bell size={16} />
          <h2 className={styles.sectionTitle}>
            Notifications
          </h2>
        </div>

        <div className={styles.noticeBox}>
          <p>
            Email reminders are sent daily at{' '}
            <strong>8 AM UTC</strong> and every{' '}
            <strong>Sunday at 6 PM UTC</strong> for your weekly
            review.
          </p>
        </div>
      </motion.section>

      {/* Data Export */}
      <motion.section className={styles.section} variants={fadeUp}>
        <div className={styles.sectionHeader}>
          <Download size={16} />
          <h2 className={styles.sectionTitle}>
            Export your data
          </h2>
        </div>

        <p className={styles.sectionDesc}>
          Download everything — your data is always yours.
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
          Permanently delete your account and all associated
          data.
        </p>

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting
            ? 'Deleting…'
            : 'Delete my account'}
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
