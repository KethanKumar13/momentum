import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuth'
import { capture } from '../lib/analytics'
import { GoogleButton } from '../components/auth/GoogleButton'
import styles from './AuthPage.module.css'

export function LoginPage() {
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/today'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    capture('login_started', { method: 'password' })

    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      capture('login_failed', {
        reason: err.response?.data?.message ?? 'unknown',
      })
      setError(
        err.response?.data?.message ?? 'Invalid email or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Welcome back</h1>

      <p className={styles.sub}>
        Don&apos;t have an account?{' '}
        <Link to="/signup" className={styles.link}>
          Sign up free
        </Link>
      </p>

      <GoogleButton />

      <div
        style={{
          margin: '16px 0',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        or
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            className={styles.input}
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            className={styles.input}
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <Link
          to="/forgot-password"
          className={styles.link}
          style={{
            fontSize: 'var(--text-xs)',
            alignSelf: 'flex-end',
          }}
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
