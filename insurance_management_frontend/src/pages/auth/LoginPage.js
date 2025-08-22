import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form for email/password. On success navigates to dashboard. */
  const { user, login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  if (user) return <Navigate to={from} replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { error: err } = await login(email, password)
    if (err) {
      setError(err?.response?.data?.message || 'Login failed')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', textAlign: 'left' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: 8 }} />
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button className="theme-toggle" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </div>
    </div>
  )
}
