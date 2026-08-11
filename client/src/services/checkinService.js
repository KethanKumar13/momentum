import api from '../lib/api'

export const checkinService = {
  get: (date) => api.get(`/checkins/${date}`).then(r => r.data),
  range: (from, to) =>
    api.get('/checkins', { params: { from, to } }).then(r => r.data),
  upsert: (data) => api.post('/checkins', data).then(r => r.data),
}
