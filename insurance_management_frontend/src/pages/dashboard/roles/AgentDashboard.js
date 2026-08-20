import React from 'react'
import { Link } from 'react-router-dom'

// PUBLIC_INTERFACE
export default function AgentDashboard() {
  /** Agent view for managing assigned customers and claims. */
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Agent Dashboard</h2>
      <div>Track client policies and assist with claims.</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="App-link" to="/policies">Policies</Link>
        <Link className="App-link" to="/claims">Claims</Link>
        <Link className="App-link" to="/attachments">Attachments</Link>
      </div>
    </div>
  )
}
