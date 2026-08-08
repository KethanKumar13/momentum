import api from '../lib/api'

export const goalService = {
  list: () => api.get('/goals').then(r => r.data),

  get: (id) => api.get(`/goals/${id}`).then(r => r.data),

  create: (data) =>
    api.post('/goals', data).then(r => r.data),

  update: (id, data) =>
    api.patch(`/goals/${id}`, data).then(r => r.data),

  delete: (id) =>
    api.delete(`/goals/${id}`),
}