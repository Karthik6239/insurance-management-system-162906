const TOKEN_KEY = 'ims_jwt'
const USER_KEY = 'ims_user'

// PUBLIC_INTERFACE
export function getToken() {
  /** Returns JWT token from storage if present. */
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Persists JWT token into storage. */
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Removes JWT token from storage. */
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function getStoredUser() {
  /** Returns the stored user profile including role, if any. */
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// PUBLIC_INTERFACE
export function setStoredUser(user) {
  /** Stores the user profile in localStorage. */
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function clearStoredUser() {
  /** Clears stored user profile. */
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clears auth and reloads app route state. */
  clearToken()
  clearStoredUser()
}
