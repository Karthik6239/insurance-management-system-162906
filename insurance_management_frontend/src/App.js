import React, { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import NotFound from './pages/NotFound'
import DashboardRouter from './pages/dashboard/DashboardRouter'
import PoliciesPage from './pages/policies/PoliciesPage'
import ClaimsPage from './pages/claims/ClaimsPage'
import ClaimDetailsPage from './pages/claims/ClaimDetailsPage'
import AttachmentsPage from './pages/attachments/AttachmentsPage'
import AuthCallback from './components/AuthCallback'

// Simple top bar + sidebar layout
function Shell({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 'auto', padding: '12px 16px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 700 }}>Insurance Management</span>
            <nav style={{ display: 'flex', gap: 12 }}>
              <Link className="App-link" to="/dashboard">Dashboard</Link>
              <Link className="App-link" to="/policies">Policies</Link>
              <Link className="App-link" to="/claims">Claims</Link>
              <Link className="App-link" to="/attachments">Attachments</Link>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>
              {user ? `${user?.name || user?.email} (${user?.role})` : 'Guest'}
            </span>
            {user ? (
              <button className="theme-toggle" onClick={logout}>Logout</button>
            ) : (
              <Link to="/login" className="App-link">Login</Link>
            )}
          </div>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>Path: {location.pathname}</div>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  )
}

function ThemeController() {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return (
    <button
      className="theme-toggle"
      style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}

// PUBLIC_INTERFACE
function ProtectedRoute({ children, roles }) {
  /** Protect routes by auth and optionally by allowed roles */
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && roles.length && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

// PUBLIC_INTERFACE
function App() {
  /** Main application with routes. Provides Auth context and shell. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeController />
        <Shell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policies"
              element={
                <ProtectedRoute roles={['admin', 'agent', 'customer']}>
                  <PoliciesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/claims"
              element={
                <ProtectedRoute roles={['admin', 'agent', 'customer']}>
                  <ClaimsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/claims/:id"
              element={
                <ProtectedRoute roles={['admin', 'agent', 'customer']}>
                  <ClaimDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attachments"
              element={
                <ProtectedRoute roles={['admin', 'agent', 'customer']}>
                  <AttachmentsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
