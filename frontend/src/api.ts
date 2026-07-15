import type { Equipment, Part, Ticket } from './data'
import type { FieldLog } from './store'
import type { Session } from './auth'

// Thin client for the NestJS backend. Base URL is overridable per environment
// (VITE_API_URL in .env); defaults to the local dev server.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`
    try {
      const body = (await res.json()) as { message?: string | string[] }
      if (body.message) message = Array.isArray(body.message) ? body.message.join(', ') : body.message
    } catch { /* non-JSON error body — keep the status text */ }
    throw new ApiError(res.status, message)
  }
  return res.json() as Promise<T>
}

const get = <T>(path: string) => request<T>(path)
const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })

export const api = {
  login: (email: string, password: string) => post<Session>('/auth/login', { email, password }),
  equipment: {
    list: () => get<Equipment[]>('/equipment'),
    create: (e: Equipment) => post<Equipment>('/equipment', e),
  },
  parts: {
    list: () => get<Part[]>('/parts'),
  },
  tickets: {
    list: () => get<Ticket[]>('/tickets'),
    create: (t: Ticket) => post<Ticket>('/tickets', t),
  },
  logs: {
    list: () => get<FieldLog[]>('/logs'),
    create: (l: FieldLog) => post<FieldLog>('/logs', l),
  },
}
