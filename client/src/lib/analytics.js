import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

let initialized = false

export function initAnalytics() {
  if (initialized) return

  if (!POSTHOG_KEY || POSTHOG_KEY.startsWith('phc_xxxx')) {
    console.info(
      '[analytics] PostHog disabled — no valid key configured'
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

export function track(event, properties = {}) {
  if (!initialized) return

  posthog.capture(event, properties)
}

export function capture(event, properties = {}) {
  if (!initialized) return

  posthog.capture(event, properties)
}

export function identifyUser(userId, properties = {}) {
  if (!initialized) return

  posthog.identify(userId, properties)
}

export function resetAnalytics() {
  if (!initialized) return

  posthog.reset()
}

export const EVENTS = {
  SIGNED_UP: 'signed_up',
  LOGGED_IN: 'logged_in',
  LOGGED_OUT: 'logged_out',

  HABIT_CREATED: 'habit_created',
  HABIT_COMPLETED: 'habit_completed',
  HABIT_CHECKED: 'habit_checked',
  HABIT_DELETED: 'habit_deleted',
  HABIT_ARCHIVED: 'habit_archived',

  GOAL_CREATED: 'goal_created',
  GOAL_COMPLETED: 'goal_completed',

  JOURNAL_CREATED: 'journal_created',
  JOURNAL_UPDATED: 'journal_updated',
  JOURNAL_DELETED: 'journal_deleted',

  WEEKLY_REVIEW_SAVED: 'weekly_review_saved',
}
