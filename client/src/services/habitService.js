import api from '../lib/api'

export const habitService = {
  list: () => api.get('/habits').then(r => r.data),
  get: (id) => api.get(`/habits/${id}`).then(r => r.data),
  create: (data) => api.post('/habits', data).then(r => r.data),
  update: (id, data) => api.patch(`/habits/${id}`, data).then(r => r.data),
  archive: (id) => api.post(`/habits/${id}/archive`),
  delete: (id) => api.delete(`/habits/${id}`),
  heatmap: (id, year) =>
    api.get(`/habits/${id}/heatmap`, { params: { year } }).then(r => r.data),
}
