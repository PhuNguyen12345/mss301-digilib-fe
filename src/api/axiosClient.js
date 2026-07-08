import axios from 'axios'

const apiBaseUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || ''

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'X-Client-Type': 'web',
  },
})

export default axiosClient
