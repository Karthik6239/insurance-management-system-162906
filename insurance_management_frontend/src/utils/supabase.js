import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client initialization.
 * Requires environment variables defined in .env (do not hardcode):
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_ANON_KEY
 * - REACT_APP_SITE_URL (for redirects, used elsewhere)
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Fail fast in development if envs are missing
if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing: REACT_APP_SUPABASE_URL and/or REACT_APP_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
