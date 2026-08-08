import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import styles from './AuthPage.module.css'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div>
        <h1>Check your inbox</h1>

        <p className={styles.sub}>
          If {email} is registered, you'll receive a reset link shortly.
        </p>

        <Link to="/login" className={styles.link}>
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Reset password</h1>

      <p className={styles.sub}>
        Enter your email and we'll send a reset link.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>

          <input
            className={styles.input}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            required
            autoComplete="email"
          />
        </label>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>

        <Link
          to="/login"
          className={styles.link}
          style={{ textAlign: 'center' }}
        >
          Back to sign in
        </Link>
      </form>
    </div>
  )
}