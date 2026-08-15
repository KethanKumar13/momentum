import styles from './GoogleButton.module.css'

/**
 * Resolves the API base URL used for the OAuth redirect.
 *
 * Priority:
 *  1. VITE_API_URL (production build)
 *  2. Same origin (behind a reverse proxy where /api is proxied to the API)
 *  3. localhost fallback for dev
 */
function resolveApiBase() {
  const envUrl = import.meta.env.VITE_API_URL

  if (envUrl) {
    // Strip trailing slash so we can safely append "/auth/google"
    return envUrl.replace(/\/$/, '')
  }

  // Same origin fallback (Vercel rewrites, nginx, etc.)
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/api`
  }

  return 'http://localhost:5080/api'
}

export function GoogleButton({ label = 'Continue with Google' }) {
  const href = `${resolveApiBase()}/auth/google`

  return (
    <a href={href} className={styles.button} aria-label={label}>
      <svg
        className={styles.icon}
        width="18"
        height="18"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.9 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.4 5.6-5.1 7.3l7.8 6.1c4.6-4.3 7.1-10.5 7.1-17.9z"
        />
        <path
          fill="#FBBC05"
          d="M10.4 28.6c-.5-1.5-.8-3.1-.8-4.6s.3-3.1.8-4.6l-7.8-6.1C.9 16.2 0 20 0 24s.9 7.8 2.6 10.7l7.8-6.1z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.3 0 11.6-2.1 15.4-5.7l-7.8-6.1c-2.1 1.4-4.8 2.3-7.6 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
        />
      </svg>

      <span>{label}</span>
    </a>
  )
}
