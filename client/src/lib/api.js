import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    'http://localhost:5080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Response interceptor — auto-refresh on 401 ────────────────

let isRefreshing = false
let queue = []

const processQueue = (error) => {
  queue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve()
  })

  queue = []
}

api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config

    // No response or no request config
    if (!error.response || !original) {
      return Promise.reject(error)
    }

    const url = original.url ?? ''

    // Don't try to refresh authentication endpoints.
    const isAuthRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password')

    if (
      error.response.status === 401 &&
      !original._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then(() => api(original))
      }

      original._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh')

        processQueue(null)

        return api(original)
      } catch (refreshError) {
        processQueue(refreshError)

        window.location.href = '/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api