import axios from 'axios'
import { getToken, logout } from '../auth/token'

// Determine backend URL from env; do not hardcode. Request user to set env in .env.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

// Create a shared axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token on each request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401s globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Token invalid/expired -> logout
      logout()
      // Optionally redirect could be handled via a central event
    }
    return Promise.reject(error)
  }
)
