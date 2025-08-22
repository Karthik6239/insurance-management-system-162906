import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../api/axiosClient'

// PUBLIC_INTERFACE
export default function ClaimDetailsPage() {
  /** Displays details of a claim and basic status update. */
  const { id } = useParams()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/api/claims/${id}`)
      setClaim(data)
      setStatus(data?.status || '')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load claim', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const updateStatus = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`/api/claims/${id}`, { status })
      load()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to update claim', e)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!claim) return <div>Claim not found</div>

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Claim #{claim.id}</h2>
      <div>Title: {claim.title}</div>
      <div>Status: {claim.status}</div>
      <form onSubmit={updateStatus} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="NEW">NEW</option>
          <option value="IN_REVIEW">IN_REVIEW</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <button className="theme-toggle" type="submit">Update</button>
      </form>
    </div>
  )
}
