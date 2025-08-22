import { api } from './axiosClient'

// PUBLIC_INTERFACE
export const AuthAPI = {
  /** Login with email/password -> { token, user } */
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  /** Register user -> { token, user } */
  register: (payload) => api.post('/api/auth/register', payload)
}

// PUBLIC_INTERFACE
export const PoliciesAPI = {
  /** List all policies */
  list: () => api.get('/api/policies'),
  /** Create a policy */
  create: (payload) => api.post('/api/policies', payload)
}

// PUBLIC_INTERFACE
export const ClaimsAPI = {
  /** List all claims for current user */
  list: () => api.get('/api/claims'),
  /** Get single claim */
  get: (id) => api.get(`/api/claims/${id}`),
  /** Create a claim */
  create: (payload) => api.post('/api/claims', payload),
  /** Update claim */
  update: (id, payload) => api.patch(`/api/claims/${id}`, payload)
}
