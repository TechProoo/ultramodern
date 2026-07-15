import type { Role } from './store'
import { api, ApiError } from './api'

// Auth goes through the NestJS backend (POST /auth/login). If the API is
// unreachable (backend not running), we fall back to checking the same demo
// accounts locally so the prototype still works offline.
export interface Session {
  email: string
  name: string
  role: Extract<Role, 'admin' | 'tech' | 'client'>
}

export interface DemoUser extends Session {
  password: string
  title: string
}

export const DEMO_USERS: DemoUser[] = [
  { email: 'admin@ultramoderneng.ng', password: 'admin123', name: 'Adaeze Anyanwu', role: 'admin', title: 'Office Admin' },
  { email: 'tech@ultramoderneng.ng', password: 'tech123', name: 'Emeka Okafor', role: 'tech', title: 'Field Technician' },
  { email: 'client@zenithtowers.ng', password: 'client123', name: 'Zenith Towers Facilities', role: 'client', title: 'Client' },
]

const AUTH_KEY = 'amc-manager-auth-v1'

function persist(session: Session): void {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(session)) } catch { /* session just won't persist */ }
}

function localSignIn(email: string, password: string): Session | null {
  const u = DEMO_USERS.find((d) => d.email.toLowerCase() === email.trim().toLowerCase() && d.password === password)
  return u ? { email: u.email, name: u.name, role: u.role } : null
}

export async function signIn(email: string, password: string): Promise<Session | null> {
  let session: Session | null
  try {
    session = await api.login(email, password)
  } catch (err) {
    // 401 = wrong credentials; anything else = API unreachable → local fallback
    if (err instanceof ApiError && err.status === 401) return null
    session = localSignIn(email, password)
  }
  if (session) persist(session)
  return session
}

// Used by the demo "Continue as" shortcuts — signs in with that role's demo account.
export async function signInAs(role: Session['role']): Promise<Session> {
  const u = DEMO_USERS.find((d) => d.role === role)!
  const session = (await signIn(u.email, u.password)) ?? { email: u.email, name: u.name, role: u.role }
  persist(session)
  return session
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
