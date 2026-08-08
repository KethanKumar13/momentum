import api from '../lib/api'

export const habitLogService = {
  /**
   * List all logs for a habit
   */
  list: (habitId) =>
    api.get(`/habits/${habitId}/logs`).then(r => r.data),

  /**
   * Upsert today's log (or a specific date).
   * Calling with status="done" twice toggles it off (server handles toggle).
   */
  log: (habitId, data = { status: 'done' }) =>
    api.post(`/habits/${habitId}/logs`, data).then(r => r.data),

  /**
   * Remove a log entry for a given date (ISO string: "2026-08-08")
   */
  unlog: (habitId, date) =>
    api.delete(`/habits/${habitId}/logs/${date}`),
}