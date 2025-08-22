import React from 'react'
import { Link } from 'react-router-dom'

// PUBLIC_INTERFACE
export default function CustomerDashboard() {
  /** Customer view to purchase policies and submit claims. */
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Customer Dashboard</h2>
      <div>Purchase policies and file or track your claims.</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="App-link" to="/policies">Browse Policies</Link>
        <Link className="App-link" to="/claims">My Claims</Link>
        <Link className="App-link" to="/attachments">My Attachments</Link>
      </div>
    </div>
  )
}
