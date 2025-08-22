import React from 'react'
import { Link } from 'react-router-dom'

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 page */
  return (
    <div style={{ padding: 24 }}>
      <h2>404 - Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link className="App-link" to="/dashboard">Go to Dashboard</Link>
    </div>
  )
}
