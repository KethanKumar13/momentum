import api from '../lib/api'

export const weeklyReviewService = {
  /** GET /api/reviews */
  list: () =>
    api.get('/reviews').then(r => r.data),

  /** GET /api/reviews/:weekStart */
  get: (weekStart) =>
    api.get(`/reviews/${weekStart}`).then(r => r.data),

  /** PUT /api/reviews/:weekStart — upsert */
  upsert: (weekStart, data) =>
    api.put(`/reviews/${weekStart}`, data).then(r => r.data),
}
