import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Target, Flame, BookOpen, LineChart, Sparkles, ArrowRight,
  Check, Zap,
} from 'lucide-react'
import styles from './LandingPage.module.css'

const FEATURES = [
  {
    icon: <Target size={20} />,
    title: 'Long-term goals',
    body: 'Set outcomes you actually care about — with a "why" and a target date.',
  },
  {
    icon: <Flame size={20} />,
    title: 'Daily habits + streaks',
    body: 'Daily / weekly / specific-day habits. Streaks that survive skips, break on misses.',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Journal + weekly review',
    body: 'Reflect daily, review weekly. Wins, struggles, and next-week focus in one place.',
  },
  {
    icon: <LineChart size={20} />,
    title: 'Insights & heatmaps',
    body: 'GitHub-style heatmaps, mood distribution, goal progress at a glance.',
  },
]

const STEPS = [
  { n: 1, title: 'Set a goal', body: 'e.g. "Run a half marathon by June".' },
  { n: 2, title: 'Add habits', body: 'Break the goal into 1–3 daily actions.' },
  { n: 3, title: 'Check in daily', body: 'Show up. The streak builds itself.' },
  { n: 4, title: 'Review weekly', body: 'Sunday reset — wins, struggles, focus.' },
]

export function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <LogoMark /> Momentum
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
          <Sparkles size={12} /> Free during beta
        </span>

        <h1 className={styles.headline}>
          Small habits.
          <br />
          <span className={styles.gradient}>Real momentum.</span>
        </h1>

        <p className={styles.sub}>
          Momentum turns long-term goals into daily habits, and daily habits
          into consistent action — with journaling, reflection, and analytics
          in one calm, focused app.
        </p>

        <div className={styles.ctaRow}>
          <Link to="/signup" className={styles.primaryCta}>
            Start free <ArrowRight size={16} />
          </Link>

          <Link to="/pricing" className={styles.secondaryCta}>
            See what&apos;s included
          </Link>
        </div>

        <p className={styles.trust}>No credit card. Delete anytime.</p>
      </motion.section>

      {/* Screenshot placeholder */}
      <section className={styles.previewWrap}>
        <div className={styles.previewCard}>
          <div className={styles.previewDots}>
            <span />
            <span />
            <span />
          </div>

          <div className={styles.previewInner}>
            <p className={styles.previewLabel}>Today, Wednesday</p>

            <p className={styles.previewGreeting}>
              Good morning, Kethan 👋
            </p>

            <div className={styles.previewList}>
              <PreviewRow done label="Run 30 minutes" streak="12d" />
              <PreviewRow done label="Read 20 pages" streak="7d" />
              <PreviewRow label="Meditate 10 min" streak="3d" />
            </div>
          </div>
        </div>
      </section>

      {/* The loop */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The full loop, one app</h2>

        <p className={styles.sectionSub}>
          Todoist has tasks. Habitica has habits. Notion has everything, badly.
          Momentum has the <em>loop</em>.
        </p>

        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How it works</h2>

        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <div className={styles.stepNum}>{s.n}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Free during beta */}
      <section className={styles.betaBox}>
        <Zap size={16} />

        <div>
          <p className={styles.betaTitle}>Free while we&apos;re in beta</p>

          <p className={styles.betaBody}>
            Momentum is 100% free right now. We&apos;re gathering feedback from
            early users before we introduce paid Pro &amp; AI plans.
          </p>
        </div>

        <Link to="/signup" className={styles.betaCta}>
          Get started <ArrowRight size={14} />
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerRow}>
          <div>
            <p className={styles.logo}>
              <LogoMark /> Momentum
            </p>

            <p className={styles.footerTag}>
              Small habits. Real momentum.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <Link to="/pricing">Pricing</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <a href="mailto:hello@momentum.app">Contact</a>
          </div>
        </div>

        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} Momentum. Made with 💜.
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

      <span className={styles.previewText}>{label}</span>
      <span className={styles.previewStreak}>🔥 {streak}</span>
    </div>
  )
}

function LogoMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 32 32"
      aria-hidden
    >
      <defs>
        <linearGradient id="lg" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      <rect
        width="32"
        height="32"
        rx="8"
        fill="#151821"
      />

      <path
        d="M6 22 C 10 22, 12 8, 26 8"
        fill="none"
        stroke="url(#lg)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
