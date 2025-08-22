import React, { useEffect, useState } from 'react'
import { api } from '../../api/axiosClient'

// PUBLIC_INTERFACE
export default function PoliciesPage() {
  /** Lists policies from backend and allows simple creation for demo. */
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [premium, setPremium] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/policies')
      setPolicies(Array.isArray(data) ? data : [])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load policies', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const createPolicy = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/policies', { name, premium: Number(premium) })
      setName('')
      setPremium('')
      load()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Create policy failed', e)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Policies</h2>
      <form onSubmit={createPolicy} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Premium" type="number" value={premium} onChange={(e) => setPremium(e.target.value)} style={{ padding: 8 }} />
        <button className="theme-toggle" type="submit">Create</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {policies.map((p) => (
            <li key={p.id}>{p.name} - ${p.premium}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
