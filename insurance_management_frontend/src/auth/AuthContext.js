import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/axiosClient'
import { getStoredUser, getToken, logout as clearAuth, setStoredUser, setToken } from './token'

const AuthContext = createContext(null)

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook returning the auth state and actions. */
  return useContext(AuthContext)
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions (login, register, logout). */
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Could validate token with backend on load if desired
    const token = getToken()
    if (!token) {
      setUser(null)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      // Expected backend contract:
      // POST /api/auth/login -> { token: string, user: { id, email, name, role } }
      const { data } = await api.post('/api/auth/login', { email, password })
      if (data?.token) {
        setToken(data.token)
      }
      if (data?.user) {
        setStoredUser(data.user)
        setUser(data.user)
      }
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      // Expected backend contract:
      // POST /api/auth/register -> { token, user }
      const { data } = await api.post('/api/auth/register', payload)
      if (data?.token) {
        setToken(data.token)
      }
      if (data?.user) {
        setStoredUser(data.user)
        setUser(data.user)
      }
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
