import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl()
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Auth callback error:', error)
          navigate('/auth/error')
          return
        }
        if (data?.session) {
          navigate('/dashboard')
        } else {
          navigate('/')
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Unexpected auth callback error:', err)
        navigate('/auth/error')
      }
    }
    handleAuthCallback()
  }, [navigate])

  return <div>Processing authentication...</div>
}
