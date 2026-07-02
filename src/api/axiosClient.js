import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'X-Client-Type': 'web',
  },
})

// ── Request interceptor: attach Bearer token ────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: handle 401 → auto-logout ─────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Skip auto-logout for the login endpoint itself
      const url = error.config?.url || ''
      if (!url.includes('/auth/login')) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // Redirect to login — using window.location to break out of React Router
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default axiosClient
