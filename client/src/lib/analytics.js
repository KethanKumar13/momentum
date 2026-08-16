import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

let initialized = false

export function initAnalytics() {
  if (initialized) return

  // Skip PostHog entirely if the key is missing or is the leftover placeholder.
  if (!POSTHOG_KEY || POSTHOG_KEY.startsWith('phc_xxxx')) {
    console.info(
      '[analytics] PostHog disabled — no valid VITE_POSTHOG_KEY configured'
    )
    return
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    persistence: 'localStorage',
  })

  initialized = true
}

export function capture(event, properties = {}) {
  if (!initialized || !event) return
  posthog.capture(event, properties)
}

// Backward-compatible alias
export const track = capture

export function identifyUser(userId, properties = {}) {
  if (!initialized) return
  posthog.identify(String(userId), properties)
}

export function resetAnalytics() {
  if (!initialized) return
  posthog.reset()
}

/**
 * Canonical event names.
 *
 * Legacy aliases are kept so existing call-sites continue working
 * without requiring a repo-wide rename.
 */
export const EVENTS = {
  // Auth
  SIGNED_UP:       'signed_up',
  SIGNUP:          'signed_up',
  LOGGED_IN:       'logged_in',
  LOGIN:           'logged_in',
  LOGGED_OUT:      'logged_out',
  LOGOUT:          'logged_out',
  ACCOUNT_DELETED: 'account_deleted',

  // Habits
  HABIT_CREATED:   'habit_created',
  HABIT_UPDATED:   'habit_updated',
  HABIT_COMPLETED: 'habit_completed',
  HABIT_CHECKED:   'habit_checked',
  HABIT_DELETED:   'habit_deleted',
  HABIT_ARCHIVED:  'habit_archived',

  // Goals
  GOAL_CREATED:   'goal_created',
  GOAL_UPDATED:   'goal_updated',
  GOAL_COMPLETED: 'goal_completed',
  GOAL_DELETED:   'goal_deleted',

  // Journal
  JOURNAL_CREATED: 'journal_created',
  JOURNAL_UPDATED: 'journal_updated',
  JOURNAL_DELETED: 'journal_deleted',
  JOURNAL_SAVED:   'journal_saved',

  // Review / Check-in
  WEEKLY_REVIEW_SAVED: 'weekly_review_saved',
  REVIEW_COMPLETED:    'weekly_review_saved',
  CHECKIN_SAVED:       'checkin_saved',

  // Export / Billing
  EXPORT_DOWNLOADED:  'export_downloaded',
  CHECKOUT_STARTED:   'checkout_started',
  CHECKOUT_SUCCEEDED: 'checkout_succeeded',
}
