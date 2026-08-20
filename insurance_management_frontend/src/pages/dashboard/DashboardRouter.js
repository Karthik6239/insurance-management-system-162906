import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import AdminDashboard from './roles/AdminDashboard'
import AgentDashboard from './roles/AgentDashboard'
import CustomerDashboard from './roles/CustomerDashboard'

// PUBLIC_INTERFACE
export default function DashboardRouter() {
  /** Picks dashboard by user role. */
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'admin') return <AdminDashboard />
  if (user.role === 'agent') return <AgentDashboard />
  return <CustomerDashboard />
}
