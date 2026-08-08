import api from '../lib/api'

export const insightsService = {
  /**
   * GET /api/insights?days=35
   * Returns summary, heatmap, topHabits, goals
   */
  get: (days = 35) =>
    api.get(`/insights?days=${days}`).then(r => r.data),
}
