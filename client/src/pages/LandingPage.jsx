import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Target, Flame, BookOpen, LineChart, Sparkles, ArrowRight,
  Check, Zap,
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import styles from './LandingPage.module.css'

const FEATURES = [
  {
    icon: <Target size={20} />,
    title: 'Long-term goals',
    body: 'Set outcomes you actually care about, with a clear "why" and a target date.',
  },
  {
    icon: <Flame size={20} />,
    title: 'Daily habits and streaks',
    body: 'Daily, weekly, or specific-day habits. Streaks that survive skips but break on misses.',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Journal and weekly review',
    body: 'Reflect daily. Review weekly. Wins, struggles, and next-week focus in one place.',
  },
  {
    icon: <LineChart size={20} />,
    title: 'Insights and heatmaps',
    body: 'GitHub-style heatmaps, mood distribution, and goal progress at a glance.',
  },
]

const STEPS = [
  { n: 1, title: 'Set a goal', body: 'Pick something that matters. "Run a half marathon by June."' },
  { n: 2, title: 'Add habits', body: 'Break it into 1 to 3 small daily actions.' },
  { n: 3, title: 'Check in daily', body: 'Show up. The streak builds itself.' },
  { n: 4, title: 'Review weekly', body: 'Every Sunday, reflect and reset.' },
]

const PREVIEW_HABITS = [
  { done: true, label: 'Run 30 minutes', streak: '12d' },
  { done: true, label: 'Read 20 pages', streak: '7d' },
  { done: false, label: 'Meditate 10 min', streak: '3d' },
]

export function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <Link
          to="/"
          className={styles.logoLink}
          aria-label="Momentum home"
        >
          <Logo />
        </Link>

        <div className={styles.navRight}>
          <Link to="/pricing" className={styles.navLink}>
            Pricing
          </Link>

          <Link to="/login" className={styles.navLink}>
            Log in
          </Link>

          <Link to="/signup" className={styles.navCta}>
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.pill}>
          <Sparkles size={12} />
          Free during beta
        </span>

        <h1 className={styles.headline}>
          Small habits.
          <br />
          <span className={styles.gradient}>Real momentum.</span>
        </h1>

        <p className={styles.sub}>
          Momentum turns long-term goals into daily habits, and daily habits
          into consistent action. Journaling, reflection, and analytics
          in one calm, focused app.
        </p>

        <div className={styles.ctaRow}>
          <Link to="/signup" className={styles.primaryCta}>
            Start free <ArrowRight size={16} />
          </Link>

          <Link to="/pricing" className={styles.secondaryCta}>
            See what's included
          </Link>
        </div>

        <p className={styles.trust}>
          No credit card. Delete anytime.
        </p>
      </motion.section>

      {/* App preview */}
      <section className={styles.previewWrap}>
        <div className={styles.previewCard}>
          <div className={styles.previewDots}>
            <span />
            <span />
            <span />
          </div>

          <div className={styles.previewInner}>
            <p className={styles.previewLabel}>Today</p>

            <p className={styles.previewGreeting}>
              Your habits for today
            </p>

            <div className={styles.previewList}>
              {PREVIEW_HABITS.map((h) => (
                <PreviewRow
                  key={h.label}
                  done={h.done}
                  label={h.label}
                  streak={h.streak}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The loop */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          The full loop, one app
        </h2>

        <p className={styles.sectionSub}>
          Todoist has tasks. Habitica has habits. Notion has everything, badly.
          Momentum has the <em>loop</em>.
        </p>

        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                {f.icon}
              </div>

              <h3 className={styles.featureTitle}>
                {f.title}
              </h3>

              <p className={styles.featureBody}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          How it works
        </h2>

        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <div className={styles.stepNum}>
                {s.n}
              </div>

              <h3 className={styles.stepTitle}>
                {s.title}
              </h3>

              <p className={styles.stepBody}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Free during beta */}
      <section className={styles.betaBox}>
        <Zap size={16} />

        <div>
          <p className={styles.betaTitle}>
            Free while we're in beta
          </p>

          <p className={styles.betaBody}>
            Momentum is 100% free right now. We're gathering feedback from
            early users before we introduce paid plans.
          </p>
        </div>

        <Link to="/signup" className={styles.betaCta}>
          Get started <ArrowRight size={14} />
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerRow}>
          <div className={styles.logoLink}>
            <Logo />
          </div>

          <div className={styles.footerLinks}>
            <Link to="/pricing">Pricing</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <a href="mailto:hello@momentum.app">
              Contact
            </a>
          </div>
        </div>

        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} Momentum. Made with care.
        </p>
      </footer>
    </div>
  )
}

function PreviewRow({ done, label, streak }) {
  return (
    <div className={styles.previewRow}>
      <div className={`${styles.check} ${done ? styles.checked : ''}`}>
        {done && <Check size={12} />}
      </div>

      <span className={styles.previewText}>
        {label}
      </span>

      <span className={styles.previewStreak}>
        🔥 {streak}
      </span>
    </div>
  )
}
