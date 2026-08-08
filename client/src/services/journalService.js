import api from '../lib/api'

export const journalService = {
  /** GET /api/journal — all entries desc */
  list: () =>
    api.get('/journal').then(r => r.data),

  /** GET /api/journal/:date */
  getByDate: (date) =>
    api.get(`/journal/${date}`).then(r => r.data),

  /** PUT /api/journal/:date — upsert */
  upsert: (date, data) =>
    api.put(`/journal/${date}`, data).then(r => r.data),

  /** DELETE /api/journal/:date */
  delete: (date) =>
    api.delete(`/journal/${date}`),

  /** GET /api/journal/calendar?year=&month= */
  calendar: (year, month) =>
    api.get(`/journal/calendar?year=${year}&month=${month}`)
      .then(r => r.data),
}
