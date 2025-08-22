import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../auth/AuthContext'

// PUBLIC_INTERFACE
export default function AttachmentsPage() {
  /**
   * Allows uploading files into Supabase Storage bucket "claims-attachments" using path:
   * {userId}/{claimRef}/{filename}
   * Lists files under the user's root folder and generates signed URLs for preview.
   */
  const { user } = useAuth()
  const [claimRef, setClaimRef] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const bucket = 'claims-attachments'

  const listFiles = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from(bucket).list(`${user.id}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
      if (error) throw error
      setFiles(Array.isArray(data) ? data : [])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('List files failed', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id || !claimRef) {
      setMessage('Please select file and enter claim reference.')
      return
    }
    setMessage('Uploading...')
    const path = `${user.id}/${claimRef}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
    if (error) {
      setMessage('Upload failed: ' + error.message)
    } else {
      setMessage('Uploaded successfully.')
      listFiles()
    }
  }

  const getSignedUrl = async (name) => {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(`${user.id}/${name}`, 3600)
    if (error) return null
    return data?.signedUrl || null
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Attachments</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Claim reference" value={claimRef} onChange={(e) => setClaimRef(e.target.value)} style={{ padding: 8 }} />
        <input type="file" onChange={onUpload} />
      </div>
      {message && <div style={{ fontSize: 14, opacity: 0.8 }}>{message}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : files.length === 0 ? (
        <div>No files yet.</div>
      ) : (
        <ul>
          {files.map((f) => (
            <li key={f.name}>
              {f.name}{' '}
              <button
                className="theme-toggle"
                onClick={async () => {
                  const url = await getSignedUrl(f.name)
                  if (url) window.open(url, '_blank')
                }}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
