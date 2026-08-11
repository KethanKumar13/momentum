import api from '../lib/api'

export const taskService = {
  list: (date) => api.get('/tasks', { params: { date } }).then(r => r.data),
  create: (data) => api.post('/tasks', data).then(r => r.data),
  update: (id, data) => api.patch(`/tasks/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/tasks/${id}`),
}
