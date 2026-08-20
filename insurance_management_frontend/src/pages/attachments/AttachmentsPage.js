import React, { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../auth/AuthContext'
import { api } from '../../api/axiosClient'

/**
 * Utility to build a deterministic storage path for an attachment.
 * We require the path to begin with the authenticated user's id to satisfy RLS.
 */
function buildAttachmentPath(userId, claimRef, fileName) {
  const safeRef = String(claimRef || '').trim().replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 64) || 'no_ref'
  const ts = Date.now()
  return `${userId}/${safeRef}/${ts}-${fileName}`
}

// PUBLIC_INTERFACE
export default function AttachmentsPage() {
  /**
   * Upload one or more files into Supabase Storage bucket "claims-attachments" using path:
   * {userId}/{claimRef}/{timestamp-filename}
   * Lists files under the user's root folder and generates signed URLs for preview.
   * Additionally, allows creating a claim that includes uploaded attachment paths/URLs.
   */
  const { user } = useAuth()
  const [claimRef, setClaimRef] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [submittingClaim, setSubmittingClaim] = useState(false)
  const [claimTitle, setClaimTitle] = useState('')
  const inputRef = useRef(null)

  const bucket = 'claims-attachments'
  const canUpload = useMemo(() => Boolean(user?.id && claimRef.trim()), [user?.id, claimRef])

  const listFiles = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from(bucket).list(`${user.id}`, {
        limit: 200,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
      if (error) throw error
      setFiles(Array.isArray(data) ? data : [])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('List files failed', e)
      setMessage(`Failed to list files: ${e?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || [])
    setSelectedFiles(list)
    if (list.length > 0) {
      setMessage(`${list.length} file(s) selected.`)
    }
  }

  const uploadSelected = async () => {
    if (!canUpload || selectedFiles.length === 0) {
      setMessage('Please enter a claim reference and select file(s) to upload.')
      return
    }
    setMessage('Uploading...')
    try {
      const uploaded = []
      for (const file of selectedFiles) {
        const path = buildAttachmentPath(user.id, claimRef, file.name)
        const { error } = await supabase.storage.from(bucket).upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`)
        }
        // Generate a signed URL for immediate preview/use
        const { data: signed, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(path, 3600)
        if (signErr) {
          throw new Error(`Uploaded ${file.name} but failed to sign URL: ${signErr.message}`)
        }
        uploaded.push({ path, signedUrl: signed?.signedUrl })
      }
      setMessage(`Uploaded ${uploaded.length} file(s) successfully.`)
      setSelectedFiles([])
      if (inputRef.current) inputRef.current.value = ''
      await listFiles()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Upload error:', err)
      setMessage(err?.message || 'Upload failed.')
    }
  }

  const getSignedUrl = async (name) => {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(`${user.id}/${name}`, 3600)
    if (error) return null
    return data?.signedUrl || null
  }

  // PUBLIC_INTERFACE
  const submitClaimWithAttachments = async (e) => {
    /**
     * Submits a new claim to backend, injecting the storage object paths and temporary signed URLs.
     * Backend contract should support attachments e.g.:
     * POST /api/claims { title, attachments: [{ path, signedUrl }] }
     */
    e.preventDefault()
    if (!claimTitle.trim()) {
      setMessage('Please enter a claim title.')
      return
    }
    setSubmittingClaim(true)
    setMessage('Submitting claim...')
    try {
      // We will attach all files uploaded under this claimRef for the user.
      // Optionally, we could track only those uploaded in this session,
      // but here we query the folder for completeness.
      const prefix = `${user.id}/${String(claimRef || '').trim()}`
      const { data: listRes, error: listErr } = await supabase.storage.from(bucket).list(prefix, {
        limit: 200,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
      if (listErr) throw listErr
      const toAttach = []
      if (Array.isArray(listRes)) {
        for (const f of listRes) {
          const path = `${prefix}/${f.name}`
          const { data: signed, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(path, 3600)
          if (!signErr && signed?.signedUrl) {
            toAttach.push({ path, signedUrl: signed.signedUrl })
          }
        }
      }

      // Call backend create claim with attachments list
      await api.post('/api/claims', {
        title: claimTitle,
        // Including an optional claimReference to help the backend associate files
        claimReference: claimRef,
        attachments: toAttach
      })

      setClaimTitle('')
      setClaimRef('')
      setMessage(`Claim submitted with ${toAttach.length} attachment(s).`)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Submit claim failed:', err)
      setMessage(err?.response?.data?.message || err?.message || 'Failed to submit claim.')
    } finally {
      setSubmittingClaim(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Attachments</h2>

      <section style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>Upload files to claim</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="Claim reference"
            value={claimRef}
            onChange={(e) => setClaimRef(e.target.value)}
            style={{ padding: 8 }}
            aria-label="Claim reference"
          />
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={onPickFiles}
            aria-label="Select files to upload"
          />
          <button
            className="theme-toggle"
            onClick={uploadSelected}
            disabled={!canUpload || selectedFiles.length === 0}
            aria-disabled={!canUpload || selectedFiles.length === 0}
          >
            {selectedFiles.length ? `Upload ${selectedFiles.length} file(s)` : 'Upload'}
          </button>
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Files are stored privately in Supabase Storage and require a signed URL to view.
        </div>
      </section>

      <section style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>Create claim with attachments</h3>
        <form onSubmit={submitClaimWithAttachments} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="Claim title"
            value={claimTitle}
            onChange={(e) => setClaimTitle(e.target.value)}
            style={{ padding: 8 }}
            aria-label="Claim title"
          />
          <button className="theme-toggle" type="submit" disabled={submittingClaim}>
            {submittingClaim ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          This will submit a claim to the backend including the uploaded attachment paths and signed URLs under the specified Claim reference.
        </div>
      </section>

      {message && <div role="status" aria-live="polite" style={{ fontSize: 14, opacity: 0.9 }}>{message}</div>}

      <section style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>Your uploaded files</h3>
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
                    if (url) window.open(url, '_blank', 'noopener,noreferrer')
                  }}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
