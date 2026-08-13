import api from '../lib/api'

export const userService = {
  updateProfile: (data) => api.patch('/me', data).then((r) => r.data),
}
