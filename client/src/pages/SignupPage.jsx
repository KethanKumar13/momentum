import { useState } from 'react'
import { GoogleButton } from '../components/auth/GoogleButton'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuth'
import { capture } from '../lib/analytics'
import styles from './AuthPage.module.css'

export function SignupPage() {
  const { signup } = useAuthContext()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

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

    capture('signup_started', { method: 'password' })

    try {
      await signup(form)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      capture('signup_failed', {
        reason: err.response?.data?.message ?? 'unknown',
      })

      setError(
        err.response?.data?.message ??
          'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Create your account</h1>

      <p className={styles.sub}>
        Already have an account?{' '}
        <Link to="/login" className={styles.link}>
          Sign in
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
          <span className={styles.label}>Full name</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Kethan Kumar"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
            autoComplete="name"
          />
        </label>

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
            placeholder="Min 8 characters"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
        </label>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Get started free'}
        </button>

        <p
          className="t-micro u-text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          By signing up you agree to our Terms of Service.
        </p>
      </form>
    </div>
  )
}

