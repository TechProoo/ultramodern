import type { Role } from './store'
import { api, ApiError } from './api'

// Auth goes through the NestJS backend (POST /auth/login). Accounts are
// managed by admins in the admin console — there is no self-service signup
// and no demo shortcut.
export interface Session {
  email: string
  name: string
  role: Extract<Role, 'admin' | 'tech' | 'client'>
}

const AUTH_KEY = 'amc-manager-auth-v1'

function persist(session: Session): void {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(session)) } catch { /* session just won't persist */ }
}

// Returns the session on success, null on wrong credentials. Any other
// failure (API unreachable, 5xx) is thrown for the caller to surface.
export async function signIn(email: string, password: string): Promise<Session | null> {
  try {
    const session = await api.login(email, password)
    persist(session)
    return session
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null
    throw err
  }
}

export function signOut(): void {
  try { localStorage.removeItem(AUTH_KEY) } catch { /* nothing to clear */ }
}

export function restoreSession(): Session | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Session
    if (s && (s.role === 'admin' || s.role === 'tech' || s.role === 'client') && typeof s.email === 'string') return s
    return null
  } catch {
    return null
  }
}
