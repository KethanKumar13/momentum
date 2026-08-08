import api from '../lib/api'

export const habitService = {
  list: () =>
    api.get('/habits').then(r => r.data),

  get: (id) =>
    api.get(`/habits/${id}`).then(r => r.data),

  create: (data) =>
    api.post('/habits', data).then(r => r.data),

  update: (id, data) =>
    api.patch(`/habits/${id}`, data).then(r => r.data),

  delete: (id) =>
    api.delete(`/habits/${id}`),

  archive: (id) =>
    api.patch(`/habits/${id}/archive`),
}