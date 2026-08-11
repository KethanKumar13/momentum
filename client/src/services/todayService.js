import api from '../lib/api'

export const todayService = {
  get: () => api.get('/today').then(r => r.data),
}
