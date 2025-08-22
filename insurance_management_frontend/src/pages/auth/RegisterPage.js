import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Registration form. Backend returns JWT and user. */
  const { user, register, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (user) return <Navigate to="/dashboard" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { error: err } = await register(form)
    if (err) {
      setError(err?.response?.data?.message || 'Registration failed')
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div style={{ maxWidth: 480, margin: '48px auto', textAlign: 'left' }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Full name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: 8 }}>
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button className="theme-toggle" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  )
}
