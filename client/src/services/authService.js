import api from '../lib/api'

export const authService = {
  signup: (data) =>
    api.post('/auth/signup', data).then((r) => r.data),

  login: (data) =>
    api.post('/auth/login', data).then((r) => r.data),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get('/me').then((r) => r.data),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (data) =>
    api.post('/auth/reset-password', data).then((r) => r.data),
}