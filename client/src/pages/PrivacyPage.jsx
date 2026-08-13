import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './LegalPage.module.css'

export function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={14} /> Back
      </Link>

      <article className={styles.article}>
        <p className={styles.updated}>
          Last updated:{' '}
          {new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <h1>Privacy Policy</h1>

        <p>
          Your privacy is a first-class concern in Momentum. This document
          explains what we collect, why, and what you can do about it.
        </p>

        <h2>1. What we collect</h2>
        <ul>
          <li>
            <strong>Account:</strong> your name, email, and password hash.
          </li>
          <li>
            <strong>Content:</strong> your goals, habits, logs, journal
            entries, weekly reviews.
          </li>
          <li>
            <strong>Usage:</strong> anonymous product analytics (page views,
            key actions).
          </li>
          <li>
            <strong>Errors:</strong> automated crash reports without your
            data payload.
          </li>
        </ul>

        <h2>2. Why we collect it</h2>
        <p>
          To provide, secure, and improve the product. We never sell your
          data. We never train AI models on your journal entries without
          explicit opt-in.
        </p>

        <h2>3. Who processes it</h2>
        <ul>
          <li>Neon (Postgres hosting)</li>
          <li>Vercel (frontend hosting)</li>
          <li>Render (API hosting)</li>
          <li>Sentry (error tracking)</li>
          <li>PostHog (product analytics)</li>
          <li>Resend (transactional email)</li>
        </ul>

        <p>All processors are bound by data-processing agreements.</p>

        <h2>4. Your rights</h2>
        <ul>
          <li>
            <strong>Export:</strong> download all your data (JSON or CSV) any
            time in Settings.
          </li>
          <li>
            <strong>Delete:</strong> permanently delete your account and all
            data in Settings.
          </li>
          <li>
            <strong>Access & correction:</strong> email{' '}
            <a href="mailto:hello@momentum.app" className={styles.link}>
              hello@momentum.app
            </a>
            .
          </li>
        </ul>

        <h2>5. Cookies</h2>
        <p>
          We use strictly-necessary httpOnly cookies for authentication.
          No third-party tracking cookies.
        </p>

        <h2>6. Security</h2>
        <p>
          Traffic is encrypted with TLS. Data at rest is encrypted by our
          hosting provider. Passwords are hashed with PBKDF2.
        </p>

        <h2>7. Children</h2>
        <p>Momentum is not intended for children under 13.</p>

        <h2>8. Changes</h2>
        <p>
          We'll notify you before making material changes. See our{' '}
          <Link to="/terms" className={styles.link}>
            Terms
          </Link>
          .
        </p>

        <h2>9. Contact</h2>
        <p>
          For privacy questions, email{' '}
          <a href="mailto:hello@momentum.app" className={styles.link}>
            hello@momentum.app
          </a>
          .
        </p>
      </article>
    </div>
  )
}
