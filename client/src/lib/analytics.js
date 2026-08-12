import posthog from 'posthog-js'

let initialised = false

/**
 * Canonical event names — use these everywhere instead of magic strings.
 */
export const EVENTS = {
  SIGNUP: 'signup',
  LOGIN: 'login',
  LOGOUT: 'logout',
  HABIT_CREATED: 'habit_created',
  HABIT_UPDATED: 'habit_updated',
  HABIT_ARCHIVED: 'habit_archived',
  HABIT_DELETED: 'habit_deleted',
  HABIT_CHECKED: 'habit_checked',
  GOAL_CREATED: 'goal_created',
  GOAL_UPDATED: 'goal_updated',
  GOAL_DELETED: 'goal_deleted',
  JOURNAL_SAVED: 'journal_saved',
  REVIEW_COMPLETED: 'review_completed',
  CHECKIN_SAVED: 'checkin_saved',
  EXPORT_DOWNLOADED: 'export_downloaded',
  ACCOUNT_DELETED: 'account_deleted',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_SUCCEEDED: 'checkout_succeeded',
}

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY
  const host =
    import.meta.env.VITE_POSTHOG_HOST ?? 'https://app.posthog.com'

  if (!key || initialised) return

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    autocapture: false,
    persistence: 'localStorage',
  })

  initialised = true
}

/**
 * Identify user after login / signup
 */
export function identifyUser(id, properties = {}) {
  if (!initialised) return
  posthog.identify(String(id), properties)
}

/**
 * Reset on logout
 */
export function resetAnalytics() {
  if (!initialised) return
  posthog.reset()
}

/**
 * Track a named event with optional properties.
 * Safe to call before init — no-op if PostHog isn't configured.
 */
export function capture(event, properties = {}) {
  if (!initialised) return
  posthog.capture(event, properties)
}

// Backwards-compatible alias
export const track = capture
