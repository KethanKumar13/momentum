import posthog from 'posthog-js'

let initialised = false

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY
  const host =
    import.meta.env.VITE_POSTHOG_HOST ?? 'https://app.posthog.com'

  if (!key || initialised) return

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    autocapture: false, // manual events only
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
 * Track a named event with optional properties
 */
export function track(event, properties = {}) {
  if (!initialised) return

  posthog.capture(event, properties)
}
