import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/axiosClient'

// PUBLIC_INTERFACE
export default function ClaimsPage() {
  /** Lists claims and allows quick submission of a new claim. */
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/claims')
      setClaims(Array.isArray(data) ? data : [])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load claims', e)
      setMessage('Failed to load claims.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const submitClaim = async (e) => {
    e.preventDefault()
    setMessage('Submitting claim...')
    try {
      await api.post('/api/claims', { title })
      setTitle('')
      setMessage('Claim submitted.')
      load()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to submit claim', e)
      setMessage(e?.response?.data?.message || 'Failed to submit claim.')
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Claims</h2>
      <form onSubmit={submitClaim} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Claim title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 8 }} />
        <button className="theme-toggle" type="submit">Submit</button>
      </form>
      {message && <div style={{ fontSize: 12, opacity: 0.85 }}>{message}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {claims.map((c) => (
            <li key={c.id}>
              <Link className="App-link" to={`/claims/${c.id}`}>{c.title}</Link> - {c.status || 'NEW'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
