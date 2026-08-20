import React from 'react'
import { Link } from 'react-router-dom'

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Admin view with quick links. */
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Admin Dashboard</h2>
      <div>Manage roles, view reports, and oversee policies and claims.</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="App-link" to="/policies">Manage Policies</Link>
        <Link className="App-link" to="/claims">Review Claims</Link>
        <Link className="App-link" to="/attachments">Attachments</Link>
      </div>
    </div>
  )
}
