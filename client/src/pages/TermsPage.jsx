import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './LegalPage.module.css'

export function TermsPage() {
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

        <h1>Terms of Service</h1>

        <p>
          Thanks for using Momentum ("we", "us"). By creating an account or
          using the service you agree to these terms.
        </p>

        <h2>1. Your account</h2>
        <p>
          You're responsible for keeping your login credentials secure and
          for all activity on your account. Momentum is intended for users
          aged 13 and above.
        </p>

        <h2>2. Acceptable use</h2>
        <p>
          Don't use Momentum to break the law, harm others, reverse-engineer
          the service, or attempt to disrupt or gain unauthorised access.
        </p>

        <h2>3. Your data</h2>
        <p>
          You own everything you write in Momentum — your goals, habits,
          logs, and journal entries. We store it securely and never sell
          it. See our{' '}
          <Link to="/privacy" className={styles.link}>
            Privacy Policy
          </Link>
          .
        </p>

        <h2>4. Beta service</h2>
        <p>
          Momentum is currently in beta and provided free of charge. We may
          change features or availability while we gather feedback. We will
          give at least 14 days' notice before introducing paid plans that
          affect your account.
        </p>

        <h2>5. Service availability</h2>
        <p>
          We aim for high availability but can't promise 100% uptime. We may
          perform maintenance or updates at any time.
        </p>

        <h2>6. Termination</h2>
        <p>
          You can delete your account at any time from Settings — this
          permanently removes all your data. We may suspend accounts that
          violate these terms.
        </p>

        <h2>7. Liability</h2>
        <p>
          Momentum is provided "as is". To the fullest extent allowed by
          law, we are not liable for indirect or consequential losses.
        </p>

        <h2>8. Changes</h2>
        <p>
          We may update these terms. We'll email you or post a notice in
          the app before material changes take effect.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions? Reach us at{' '}
          <a href="mailto:hello@momentum.app" className={styles.link}>
            hello@momentum.app
          </a>
          .
        </p>
      </article>
    </div>
  )
}
