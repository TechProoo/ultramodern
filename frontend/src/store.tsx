import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { EQ, INITIAL_TICKETS, PARTS, type Equipment, type Part, type Ticket } from './data'
import { BADGE, type StatusKey } from './theme'
import { restoreSession, signOut as clearSession, type Session } from './auth'
import { api } from './api'

export type Role = 'landing' | 'login' | 'admin' | 'tech' | 'client'
export type TechScreen = 'scan' | 'detail' | 'log' | 'done' | 'report'

// A field-logged visit that gets prepended to an equipment's service history.
export interface FieldLog {
  eqId: string
  date: string
  tech: string
  tag: string
  issue: string
  work: string
  notes: string
  parts: { name: string; qty: number }[]
}

export interface DecoratedEquipment extends Equipment {
  bL: string
  bBg: string
  bFg: string
  dot: string
  dueFg: string
  dueLabel: string
}

interface Store {
  // Auth is the single source of truth; routing (React Router) derives the
  // visible platform from `session` via route guards.
  session: Session | null
  login: (s: Session) => void
  logout: () => void
  selId: string
  setSelId: (id: string) => void
  techScreen: TechScreen
  setTechScreen: (s: TechScreen) => void
  equipment: Equipment[]
  addEquipment: (e: Equipment) => void
  nextEquipmentId: string
  parts: Part[]
  tickets: Ticket[]
  addTicket: (t: Ticket) => void
  nextTicketId: string
  extraLogs: FieldLog[]
  lastLog: FieldLog | null
  addLog: (l: FieldLog) => void
  decorate: (e: Equipment) => DecoratedEquipment
  selected: DecoratedEquipment
}

const StoreContext = createContext<Store | null>(null)

function nextIdFrom(ids: string[], prefix: string, pad: number): string {
  const max = ids.reduce((m, id) => {
    const n = parseInt(id.slice(prefix.length), 10)
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return prefix + String(max + 1).padStart(pad, '0')
}

const warnApi = (what: string) => (err: unknown) =>
  console.warn(`AMC API: failed to persist ${what} — change is local-only this session.`, err)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(restoreSession)
  const [selId, setSelId] = useState('EQ-0117')
  const [techScreen, setTechScreen] = useState<TechScreen>('scan')
  // Seed data renders instantly; the backend replaces it as the source of
  // truth once the initial fetch lands. If the API is down, seeds remain.
  const [equipment, setEquipment] = useState<Equipment[]>(EQ)
  const [parts, setParts] = useState<Part[]>(PARTS)
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS)
  const [extraLogs, setExtraLogs] = useState<FieldLog[]>([])
  const [lastLog, setLastLog] = useState<FieldLog | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.equipment.list(), api.parts.list(), api.tickets.list(), api.logs.list()])
      .then(([eq, pt, tk, lg]) => {
        if (cancelled) return
        setEquipment(eq)
        setParts(pt)
        setTickets(tk)
        setExtraLogs(lg)
      })
      .catch(() => console.warn('AMC API unreachable — running on local seed data.'))
    return () => { cancelled = true }
  }, [])

  const value = useMemo<Store>(() => {
    const decorate = (e: Equipment): DecoratedEquipment => {
      const b = BADGE[e.status as StatusKey]
      return {
        ...e,
        bL: b.l, bBg: b.bg, bFg: b.fg, dot: b.dot, dueFg: b.dueFg,
        dueLabel: e.due + (e.dueSort < 715 ? ' ⚠' : ''),
      }
    }
    const selected = decorate(equipment.find((e) => e.id === selId) ?? equipment[0])
    return {
      selId, setSelId, techScreen, setTechScreen,
      session,
      login: (s) => { setSession(s); setTechScreen('scan') },
      logout: () => { clearSession(); setSession(null); setTechScreen('scan') },
      equipment,
      addEquipment: (e) => {
        setEquipment((prev) => [e, ...prev])
        api.equipment.create(e).catch(warnApi('equipment'))
      },
      nextEquipmentId: nextIdFrom(equipment.map((e) => e.id), 'EQ-', 4),
      parts,
      tickets,
      addTicket: (t) => {
        setTickets((prev) => [t, ...prev])
        api.tickets.create(t).catch(warnApi('ticket'))
      },
      nextTicketId: nextIdFrom(tickets.map((t) => t.id), 'TKT-', 4),
      extraLogs, lastLog,
      addLog: (l) => {
        setExtraLogs((prev) => [l, ...prev])
        setLastLog(l)
        api.logs.create(l).catch(warnApi('visit log'))
      },
      decorate, selected,
    }
  }, [session, selId, techScreen, equipment, parts, tickets, extraLogs, lastLog])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- provider + hook belong together
export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
