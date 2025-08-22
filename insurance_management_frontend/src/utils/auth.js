import { supabase } from './supabase'
import { getURL } from './getURL'

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getURL()}auth/callback`,
    },
  })
  return { data, error }
}

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}auth/reset-password`,
  })
  return { data, error }
}

export const signInWithMagicLink = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getURL()}auth/callback`,
    },
  })
  return { data, error }
}

export const signInWithOAuth = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL()}auth/callback`,
    },
  })
  return { data, error }
}

// Generic auth error handler
export const handleAuthError = (error, navigate) => {
  // eslint-disable-next-line no-console
  console.error('Authentication error:', error)
  const msg = String(error?.message || '')
  if (msg.includes('redirect')) {
    navigate('/auth/error?type=redirect')
  } else if (msg.includes('email')) {
    navigate('/auth/error?type=email')
  } else {
    navigate('/auth/error')
  }
}
