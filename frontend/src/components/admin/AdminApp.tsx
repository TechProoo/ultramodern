import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAND, ACCENT, PRI, STAT } from '../../theme'
import { TECHS, type Equipment } from '../../data'
import { useStore } from '../../store'
import { useWindowWidth } from '../../useWindowWidth'
import { Badge, mono, MonoLabel, PhotoPlaceholder, QrThumb, Logo } from '../ui'
import { buildReportValues } from '../../reportValues'
import { api, ApiError, type UserAccount } from '../../api'

type Screen = 'register' | 'detail' | 'schedule' | 'faults' | 'parts' | 'report' | 'users'

export default function AdminApp() {
  const store = useStore()
  const vw = useWindowWidth()
  const narrow = vw < 880

  const [screen, setScreen] = useState<Screen>('register')
  const [faultModal, setFaultModal] = useState(false)

  const openTickets = store.tickets.filter((t) => t.status !== 'Resolved').length
  const lowCount = store.parts.filter((p) => p.qty < p.min).length

  const nav: { key: Screen; label: string; badge?: number }[] = [
    { key: 'register', label: 'Equipment Register' },
    { key: 'schedule', label: 'Maintenance Schedule' },
    { key: 'faults', label: 'Fault Tickets', badge: openTickets },
    { key: 'parts', label: 'Spare Parts', badge: lowCount },
    { key: 'report', label: 'Service Reports' },
    { key: 'users', label: 'Users & Access' },
  ]
  const activeKey: Screen = screen === 'detail' ? 'register' : screen

  const padMain = narrow ? '18px 14px' : '26px 30px'

  const openDetail = (id: string) => { store.setSelId(id); setScreen('detail') }

  const initials = (store.session?.name ?? 'Adaeze Anyanwu').split(' ').map((w) => w[0]).slice(0, 2).join('')

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AdminTopBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: narrow ? 'column' : 'row', minHeight: 0, background: '#F2F3EF' }}>
      {/* sidebar */}
      <div style={{ width: narrow ? '100%' : 230, boxSizing: 'border-box', flex: 'none', background: BRAND, display: 'flex', flexDirection: narrow ? 'row' : 'column', alignItems: narrow ? 'center' : 'stretch', padding: narrow ? '8px 10px' : '18px 0', overflowX: 'auto' }}>
        {!narrow && <div style={{ padding: '0 20px 14px 20px', fontFamily: mono, fontSize: 10, letterSpacing: '1.5px', color: '#BEE0F5' }}>ADMIN CONSOLE</div>}
        {nav.map((n) => {
          const active = activeKey === n.key
          return (
            <button key={n.key} className="hv-nav" onClick={() => setScreen(n.key)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap', flex: 'none', padding: '12px 20px', fontSize: 13.5, fontWeight: 600, background: active ? 'rgba(255,255,255,0.16)' : 'transparent', color: active ? '#FFFFFF' : '#D3E8F7', borderLeft: `3px solid ${active ? '#FFFFFF' : 'transparent'}`, borderRadius: 6 }}>
              <span>{n.label}</span>
              {!!n.badge && <span style={{ background: ACCENT, color: '#FFFFFF', fontFamily: mono, fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 9 }}>{n.badge}</span>}
            </button>
          )
        })}
        {!narrow && (
          <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{initials}</div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 600 }}>{store.session?.name ?? 'Adaeze Anyanwu'}</div>
              <div style={{ color: '#BEE0F5', fontSize: 11 }}>Operations Admin</div>
            </div>
          </div>
        )}
      </div>

      {/* main */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        {screen === 'register' && <Register padMain={padMain} narrow={narrow} onOpen={openDetail} />}
        {screen === 'detail' && <Detail padMain={padMain} narrow={narrow} onBack={() => setScreen('register')} onReport={() => setScreen('report')} />}
        {screen === 'schedule' && <Schedule padMain={padMain} onOpen={openDetail} />}
        {screen === 'faults' && <Faults padMain={padMain} onNew={() => setFaultModal(true)} />}
        {screen === 'parts' && <Parts padMain={padMain} narrow={narrow} lowCount={lowCount} />}
        {screen === 'report' && <ReportPreview padMain={padMain} narrow={narrow} />}
        {screen === 'users' && <UsersScreen padMain={padMain} />}

        {faultModal && <FaultModal onClose={() => setFaultModal(false)} />}
      </div>
      </div>
    </div>
  )
}

/* ------------------------------- Admin top bar --------------------------- */

function AdminTopBar() {
  const { session, logout } = useStore()
  const navigate = useNavigate()
  const signOut = () => { logout(); navigate('/') }
  return (
    <div style={{ background: '#0E1E33', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Logo height={28} onDark />
        <div>
          <div style={{ color: '#F4F6F3', fontWeight: 700, fontSize: 15, letterSpacing: '0.2px' }}>AMC Manager</div>
          <div style={{ color: '#7A8CA3', fontFamily: mono, fontSize: 10, letterSpacing: '1.2px' }}>ADMIN CONSOLE · OPERATIONS DESK</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {session && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#F4F6F3', fontSize: 12.5, fontWeight: 700 }}>{session.name}</div>
            <div style={{ fontFamily: mono, fontSize: 9.5, color: '#7A8CA3', letterSpacing: '0.6px' }}>{session.email}</div>
          </div>
        )}
        <button onClick={signOut} style={{ border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', background: 'transparent', color: '#C7D2E0', fontSize: 12.5, fontWeight: 600, padding: '9px 14px', borderRadius: 7, whiteSpace: 'nowrap' }}>Sign out</button>
      </div>
    </div>
  )
}

/* ------------------------------- Register ------------------------------- */

const REG_COLS = '54px 1.7fr 1.3fr 1fr 0.75fr 0.8fr 108px'

function Register({ padMain, narrow, onOpen }: { padMain: string; narrow: boolean; onOpen: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [statusF, setStatusF] = useState('all')
  const [clientF, setClientF] = useState('all')
  const [addModal, setAddModal] = useState(false)
  const { decorate, equipment } = useStore()

  const rows = useMemo(() => {
    return equipment.filter((e) => {
      const t = (e.name + e.id + e.client + e.serial + e.type + e.loc).toLowerCase()
      if (q && !t.includes(q.toLowerCase())) return false
      if (statusF !== 'all' && e.status !== statusF) return false
      if (clientF !== 'all' && e.client !== clientF) return false
      return true
    }).map(decorate)
  }, [equipment, q, statusF, clientF, decorate])

  const chips = [['all', 'All'], ['over', 'Overdue'], ['due', 'Due soon'], ['ok', 'OK']]
  const clientOptions = [...new Set(equipment.map((e) => e.client))]
  const rowPad = narrow ? '13px 16px' : '13px 16px'

  return (
    <div style={{ padding: padMain, animation: 'fadeUp .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Equipment Register</h1>
          <MonoLabel style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.8px' }}>{rows.length} UNITS UNDER AMC · 4 CLIENT SITES</MonoLabel>
        </div>
        <button className="hv-brand" onClick={() => setAddModal(true)} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '11px 18px', borderRadius: 7 }}>+ Add Equipment</button>
      </div>
      {addModal && <AddEquipmentModal onClose={() => setAddModal(false)} />}

      <div style={{ display: 'flex', gap: 10, margin: '20px 0 14px 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search equipment, serial, client…" style={{ flex: 1, minWidth: 220, maxWidth: 360, padding: '10px 14px', border: '1px solid #D4D7CF', borderRadius: 7, fontSize: 13.5, background: '#FFFFFF', color: '#1c1c1c' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {chips.map(([k, label]) => {
            const active = statusF === k
            return (
              <button key={k} className="hv-dark-border" onClick={() => setStatusF(k)} style={{ border: `1px solid ${active ? '#1c1c1c' : '#D4D7CF'}`, cursor: 'pointer', background: active ? '#1c1c1c' : '#FFFFFF', color: active ? '#FFFFFF' : '#3C4C61', fontSize: 12, fontWeight: 600, padding: '8px 13px', borderRadius: 20 }}>{label}</button>
            )
          })}
        </div>
        <select value={clientF} onChange={(e) => setClientF(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #D4D7CF', borderRadius: 7, fontSize: 13, background: '#FFFFFF', color: '#1c1c1c' }}>
          <option value="all">All clients</option>
          {clientOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, overflowX: 'auto' }}>
        <div style={{ minWidth: 920 }}>
          <div style={{ display: 'grid', gridTemplateColumns: REG_COLS, gap: 12, alignItems: 'center', padding: '10px 16px', background: '#F7F8F4', borderBottom: '1px solid #E0E2DA', fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E' }}>
            <div>QR</div><div>EQUIPMENT</div><div>CLIENT / SITE</div><div>LOCATION</div><div>INSTALLED</div><div>NEXT SERVICE</div><div>STATUS</div>
          </div>
          {rows.map((it) => (
            <div key={it.id} className="hv-row" onClick={() => onOpen(it.id)} style={{ display: 'grid', gridTemplateColumns: REG_COLS, gap: 12, alignItems: 'center', padding: rowPad, borderBottom: '1px solid #EEF0E9', cursor: 'pointer' }}>
              <QrThumb />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{it.name}</div>
                <div style={{ fontFamily: mono, fontSize: 10.5, color: '#6B7A8E', marginTop: 2 }}>{it.id} · {it.type}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{it.client}</div>
                <div style={{ fontSize: 11.5, color: '#6B7A8E' }}>{it.site}</div>
              </div>
              <div style={{ fontSize: 12.5, color: '#3C4C61' }}>{it.loc}</div>
              <div style={{ fontFamily: mono, fontSize: 11.5, color: '#3C4C61' }}>{it.install}</div>
              <div style={{ fontFamily: mono, fontSize: 11.5, fontWeight: 600, color: it.dueFg }}>{it.dueLabel}</div>
              <div><Badge label={it.bL} bg={it.bBg} fg={it.bFg} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- Detail -------------------------------- */

function useSelectedHistory() {
  const { selected, extraLogs } = useStore()
  const extra = extraLogs.filter((l) => l.eqId === selected.id).map((l) => ({
    date: l.date, tech: l.tech, tag: l.tag, desc: `${l.issue} ${l.work}`, dot: BRAND,
    partsLabel: l.parts.length ? l.parts.map((p) => `${p.name} ×${p.qty}`).join(', ') : '',
  }))
  const base = selected.history.map((h) => ({ ...h, dot: '#8FA0B6', partsLabel: h.parts.join(', ') }))
  return [...extra, ...base]
}

function Detail({ padMain, narrow, onBack, onReport }: { padMain: string; narrow: boolean; onBack: () => void; onReport: () => void }) {
  const { selected: sel } = useStore()
  const history = useSelectedHistory()
  const [logModal, setLogModal] = useState(false)

  return (
    <div style={{ padding: padMain, animation: 'fadeUp .3s ease', maxWidth: 1080 }}>
      {logModal && <LogVisitModal onClose={() => setLogModal(false)} onLogged={() => { setLogModal(false); onReport() }} />}
      <button className="hv-link" onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3C4C61', fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 14 }}>← Equipment Register</button>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-0.3px' }}>{sel.name}</h1>
            <Badge label={sel.bL} bg={sel.bBg} fg={sel.bFg} />
          </div>
          <MonoLabel style={{ marginTop: 5, fontSize: 11, letterSpacing: '0.6px' }}>{sel.id} · S/N {sel.serial} · {sel.client} — {sel.site}</MonoLabel>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="hv-dark-border" onClick={onReport} style={{ border: '1px solid #C9CDC3', cursor: 'pointer', background: '#FFFFFF', color: '#1c1c1c', fontWeight: 600, fontSize: 13, padding: '10px 16px', borderRadius: 7 }}>Generate PDF Report</button>
          <button className="hv-brand" onClick={() => setLogModal(true)} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '10px 16px', borderRadius: 7 }}>Log Maintenance Visit</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '340px 1fr', gap: 20, marginTop: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PhotoPlaceholder height={190} label="[ equipment photo ]" />
          <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, padding: '16px 18px' }}>
            <MonoLabel style={{ marginBottom: 10 }}>SPECIFICATIONS</MonoLabel>
            {sel.specs.map((s) => (
              <div key={s.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid #F0F1EA', fontSize: 12.5 }}>
                <span style={{ color: '#6B7A8E' }}>{s.k}</span><span style={{ fontWeight: 600, textAlign: 'right' }}>{s.v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', fontSize: 12.5 }}>
              <span style={{ color: '#6B7A8E' }}>Service interval</span><span style={{ fontWeight: 600 }}>{sel.interval}</span>
            </div>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, padding: '20px 22px' }}>
          <MonoLabel style={{ marginBottom: 16 }}>SERVICE HISTORY — MOST RECENT FIRST</MonoLabel>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: h.dot, marginTop: 4, flex: 'none' }} />
                <div style={{ width: 2, flex: 1, background: '#E7E9E1' }} />
              </div>
              <div style={{ paddingBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: mono, fontSize: 11.5, fontWeight: 600 }}>{h.date}</span>
                  <span style={{ background: '#EEF1F6', color: '#3C4C61', fontFamily: mono, fontSize: 9.5, letterSpacing: '0.8px', padding: '2px 7px', borderRadius: 3 }}>{h.tag}</span>
                  <span style={{ fontSize: 12, color: '#6B7A8E' }}>{h.tech}</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6, color: '#26364C' }}>{h.desc}</div>
                {h.partsLabel && <div style={{ fontFamily: mono, fontSize: 11, color: '#8A5A0B', marginTop: 5 }}>PARTS: {h.partsLabel}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Schedule ------------------------------- */

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function Schedule({ padMain, onOpen }: { padMain: string; onOpen: (id: string) => void }) {
  const { decorate, equipment } = useStore()
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  const dueByDay: Record<number, Equipment[]> = {}
  equipment.forEach((e) => { if (e.dueSort >= 701 && e.dueSort <= 731) { const d = e.dueSort - 700; (dueByDay[d] = dueByDay[d] || []).push(e) } })

  const calDays = [] as { n: string; events: { t: string; bg: string; fg: string; bar: string }[]; bg: string; nBg: string; nFg: string }[]
  for (let i = 0; i < 35; i++) {
    const dayNum = i - 1 // Jul 1 2026 = Wednesday, Monday-start grid
    let n: number
    let faded = false
    if (dayNum < 1) { n = 29 + i; faded = true } else if (dayNum > 31) { n = dayNum - 31; faded = true } else n = dayNum
    const isToday = !faded && dayNum === 14
    const events = (!faded && dueByDay[dayNum] ? dueByDay[dayNum] : []).map((e) => {
      const d = decorate(e)
      return { t: e.name.split(' ').slice(0, 3).join(' '), bg: d.bBg, fg: d.bFg, bar: d.dot }
    })
    if (!faded && dayNum === 16) events.push({ t: 'Chiller PM visit · 9:00', bg: '#E9EDF4', fg: '#2A466B', bar: '#2A466B' })
    calDays.push({
      n: String(n).padStart(2, '0'), events,
      bg: faded ? '#F7F8F4' : (isToday ? '#F0F7FC' : '#FFFFFF'),
      nBg: isToday ? BRAND : 'transparent', nFg: isToday ? '#FFFFFF' : (faded ? '#B7BEC9' : '#3C4C61'),
    })
  }

  const schedList = [...equipment].sort((a, b) => a.dueSort - b.dueSort).map((e) => ({ ...decorate(e), remind: e.status !== 'ok' }))

  const tab = (active: boolean) => ({ border: 'none', cursor: 'pointer', padding: '7px 16px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, background: active ? '#FFFFFF' : 'transparent', color: active ? '#1c1c1c' : '#6B7A8E' } as const)

  return (
    <div style={{ padding: padMain, animation: 'fadeUp .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Preventive Maintenance Schedule</h1>
          <MonoLabel style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.8px' }}>JULY 2026 · 2 OVERDUE · 2 DUE THIS MONTH</MonoLabel>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#E7E9E1', padding: 4, borderRadius: 8 }}>
          <button onClick={() => setView('calendar')} style={tab(view === 'calendar')}>Calendar</button>
          <button onClick={() => setView('list')} style={tab(view === 'list')}>List</button>
        </div>
      </div>

      {view === 'calendar' && (
        <div style={{ marginTop: 20, background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, overflowX: 'auto' }}>
          <div style={{ minWidth: 680 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: '#F7F8F4', borderBottom: '1px solid #E0E2DA' }}>
              {WEEKDAYS.map((w) => <div key={w} style={{ padding: '9px 12px', fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E' }}>{w}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
              {calDays.map((d, i) => (
                <div key={i} style={{ minHeight: 96, borderBottom: '1px solid #EEF0E9', borderRight: '1px solid #EEF0E9', padding: '8px 9px', background: d.bg }}>
                  <div style={{ display: 'inline-grid', placeItems: 'center', minWidth: 22, height: 22, borderRadius: 11, fontFamily: mono, fontSize: 11, fontWeight: 600, background: d.nBg, color: d.nFg, padding: '0 4px' }}>{d.n}</div>
                  {d.events.map((e, j) => (
                    <div key={j} style={{ marginTop: 5, background: e.bg, color: e.fg, borderLeft: `3px solid ${e.bar}`, fontSize: 10.5, fontWeight: 600, padding: '4px 6px', borderRadius: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.t}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <div style={{ marginTop: 20, background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, overflowX: 'auto' }}>
          <div style={{ minWidth: 720 }}>
            {schedList.map((s) => (
              <div key={s.id} className="hv-row" onClick={() => onOpen(s.id)} style={{ display: 'grid', gridTemplateColumns: '12px 120px 1.6fr 1.2fr 110px 80px', gap: 14, alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #EEF0E9', cursor: 'pointer' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.dot }} />
                <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: s.dueFg }}>{s.dueLabel}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.name}</div>
                  <div style={{ fontFamily: mono, fontSize: 10.5, color: '#6B7A8E', marginTop: 2 }}>{s.id} · {s.interval.toUpperCase()} SERVICE</div>
                </div>
                <div style={{ fontSize: 12.5, color: '#3C4C61' }}>{s.client} — {s.site}</div>
                <div><Badge label={s.bL} bg={s.bBg} fg={s.bFg} /></div>
                {s.remind ? <div style={{ fontFamily: mono, fontSize: 10, color: '#8A5A0B' }}>🔔 SENT</div> : <div />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------- Faults -------------------------------- */

function Faults({ padMain, onNew }: { padMain: string; onNew: () => void }) {
  const { tickets, equipment } = useStore()
  const eqName = (id: string) => equipment.find((e) => e.id === id)?.name ?? id
  const eqClient = (id: string) => equipment.find((e) => e.id === id)?.client ?? ''
  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length

  return (
    <div style={{ padding: padMain, animation: 'fadeUp .3s ease', maxWidth: 1080 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Fault Tickets</h1>
          <MonoLabel style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.8px' }}>{openTickets} OPEN · UNSCHEDULED BREAKDOWNS & CLIENT REPORTS</MonoLabel>
        </div>
        <button className="hv-brand" onClick={onNew} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '11px 18px', borderRadius: 7 }}>+ New Fault Ticket</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        {tickets.map((t) => {
          const bar = t.status === 'Resolved' ? '#B9C2CE' : (t.pri === 'Critical' || t.pri === 'High' ? ACCENT : '#8FA0B6')
          return (
            <div key={t.id} style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderLeft: `4px solid ${bar}`, borderRadius: 8, padding: '15px 18px', display: 'flex', flexWrap: 'wrap', gap: '10px 16px', alignItems: 'center' }}>
              <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: '#3C4C61', width: 78, flex: 'none' }}>{t.id}</div>
              <div style={{ flex: '1 1 260px', minWidth: 220 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.title}</div>
                <div style={{ fontSize: 11.5, color: '#6B7A8E', marginTop: 3 }}>{eqName(t.eqId)} · {eqClient(t.eqId)} · raised {t.date} by {t.by}</div>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#3C4C61', flex: 'none' }}>{t.tech}</div>
              <Badge label={t.pri} bg={PRI[t.pri].bg} fg={PRI[t.pri].fg} />
              <Badge label={t.status} bg={STAT[t.status].bg} fg={STAT[t.status].fg} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* --------------------------------- Parts -------------------------------- */

const PART_COLS = '1.7fr 110px 70px 56px 150px 100px'

function Parts({ padMain, lowCount }: { padMain: string; narrow: boolean; lowCount: number }) {
  const { parts } = useStore()
  return (
    <div style={{ padding: padMain, animation: 'fadeUp .3s ease', maxWidth: 1080 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Spare Parts Inventory</h1>
      <MonoLabel style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.8px' }}>STORE: SURULERE WAREHOUSE · UPDATED 14 JUL 2026</MonoLabel>
      <div style={{ marginTop: 18, background: '#FBE2D5', border: '1px solid #F0C4AC', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: '#8A3410' }}>{lowCount} items below minimum stock — reorder recommended before next PM cycle.</div>
      </div>
      <div style={{ marginTop: 14, background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, overflowX: 'auto' }}>
        <div style={{ minWidth: 780 }}>
          <div style={{ display: 'grid', gridTemplateColumns: PART_COLS, gap: 12, padding: '10px 18px', background: '#F7F8F4', borderBottom: '1px solid #E0E2DA', fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E' }}>
            <div>PART</div><div>SKU</div><div>ON HAND</div><div>MIN</div><div>LAST USED ON</div><div>STATUS</div>
          </div>
          {parts.map((p) => {
            const low = p.qty < p.min
            return (
              <div key={p.sku} className="hv-row" style={{ display: 'grid', gridTemplateColumns: PART_COLS, gap: 12, alignItems: 'center', padding: '13px 18px', borderBottom: '1px solid #EEF0E9' }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: '#6B7A8E' }}>{p.sku}</div>
                <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: low ? '#AE3D0C' : '#166A45' }}>{p.qty}</div>
                <div style={{ fontFamily: mono, fontSize: 12, color: '#9AA5B3' }}>{p.min}</div>
                <div style={{ fontSize: 11.5, color: '#6B7A8E' }}>{p.used}</div>
                <div><Badge label={low ? 'LOW STOCK' : 'IN STOCK'} bg={low ? '#FBE2D5' : '#DCEEE3'} fg={low ? '#AE3D0C' : '#166A45'} /></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- Report preview --------------------------- */

function ReportPreview({ padMain, narrow }: { padMain: string; narrow: boolean }) {
  const { selected, lastLog, equipment } = useStore()
  const [emailed, setEmailed] = useState(false)
  const r = buildReportValues(lastLog, selected, equipment)
  const metaCols = narrow ? 2 : 4
  const meta = [
    ['CLIENT', r.rClient], ['SITE', r.rSite], ['EQUIPMENT', r.rEq], ['SERIAL NO.', r.rSerial],
    ['DATE OF VISIT', r.rDate], ['TECHNICIAN', r.rTech], ['CONTRACT', 'AMC-2024-118'], ['NEXT SERVICE', r.rNext],
  ]

  return (
    <div style={{ padding: padMain, animation: 'fadeUp .3s ease' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Service Report Preview</h1>
            <MonoLabel style={{ marginTop: 3, fontSize: 11 }}>{r.rRef} · COMPILED FROM VISIT LOG</MonoLabel>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="hv-dark-border" onClick={() => setEmailed(true)} disabled={emailed} style={{ border: `1px solid ${emailed ? '#9CCBB0' : '#C9CDC3'}`, cursor: emailed ? 'default' : 'pointer', background: emailed ? '#DCEEE3' : '#FFFFFF', color: emailed ? '#166A45' : '#1c1c1c', fontWeight: 600, fontSize: 13, padding: '10px 16px', borderRadius: 7 }}>{emailed ? '✓ Sent to client' : 'Email to Client'}</button>
            <button className="hv-brand" onClick={() => window.print()} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '10px 16px', borderRadius: 7 }}>Download PDF</button>
          </div>
        </div>

        {/* A4 page */}
        <div className="print-area" style={{ background: '#FFFFFF', border: '1px solid #D8DAD2', boxShadow: '0 8px 30px rgba(10,22,38,0.14)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ background: '#0E1E33', padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Logo height={32} onDark />
              <div style={{ color: '#7A8CA3', fontFamily: mono, fontSize: 9.5, letterSpacing: '1.4px' }}>HVAC · PLUMBING · FIRE SAFETY · ELECTRICAL</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: BRAND, fontFamily: mono, fontSize: 11, letterSpacing: '1.5px', fontWeight: 600 }}>AMC SERVICE REPORT</div>
              <div style={{ color: '#7A8CA3', fontFamily: mono, fontSize: 10.5, marginTop: 3 }}>{r.rRef}</div>
            </div>
          </div>
          <div style={{ padding: '26px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metaCols},1fr)`, gap: 14, paddingBottom: 18, borderBottom: '2px solid #0E1E33' }}>
              {meta.map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1.2px', color: '#8A94A2' }}>{k}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.2px', color: '#8A5A0B' }}>FAULT / ISSUE FOUND</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, marginTop: 5 }}>{r.rIssue}</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.2px', color: '#166A45' }}>WORK PERFORMED</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, marginTop: 5 }}>{r.rWork}</div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.2px', color: '#8A94A2' }}>PARTS REPLACED</div>
              {r.rParts.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #EEF0E9', fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span><span style={{ fontFamily: mono, color: '#6B7A8E' }}>QTY {p.qty}</span>
                </div>
              ))}
              {r.rParts.length === 0 && <div style={{ fontSize: 12.5, color: '#6B7A8E', marginTop: 5 }}>None — routine service only.</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }}>
              <PhotoPlaceholder height={130} label="[ before photo ]" />
              <PhotoPlaceholder height={130} label="[ after photo ]" />
            </div>

            <div style={{ marginTop: 18, background: '#F7F8F4', border: '1px solid #E7E9E1', borderRadius: 6, padding: '12px 16px' }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.2px', color: '#8A94A2' }}>RECOMMENDATIONS</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.55, marginTop: 5 }}>{r.rNotes}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 26 }}>
              <div>
                <div style={{ fontStyle: 'italic', fontSize: 19, color: '#26364C', paddingBottom: 4 }}>{r.rTech}</div>
                <div style={{ borderTop: '1.5px solid #1c1c1c', paddingTop: 5, fontFamily: mono, fontSize: 9.5, letterSpacing: '1px', color: '#8A94A2' }}>TECHNICIAN SIGN-OFF</div>
              </div>
              <div>
                <div style={{ height: 27 }} />
                <div style={{ borderTop: '1.5px solid #1c1c1c', paddingTop: 5, fontFamily: mono, fontSize: 9.5, letterSpacing: '1px', color: '#8A94A2' }}>CLIENT REPRESENTATIVE</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#F2F3EF', borderTop: '1px solid #E0E2DA', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 9.5, color: '#8A94A2', letterSpacing: '0.6px', flexWrap: 'wrap', gap: 8 }}>
            <span>33, FATAI IRAWO STREET, OFF MURITALA MUHAMMED INTERNATIONAL AIRPORT ROAD, AJAO ESTATE, LAGOS</span><span>+234 7065947035, 08033545484 · INFO@ULTRAMODERNENG.COM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Fault modal ----------------------------- */

function FaultModal({ onClose }: { onClose: () => void }) {
  const { addTicket, nextTicketId, equipment } = useStore()
  const [fEq, setFEq] = useState('EQ-0064')
  const [fDesc, setFDesc] = useState('')
  const [fPri, setFPri] = useState('High')
  const [fTech, setFTech] = useState('Tunde Bakare')

  const submit = () => {
    addTicket({ id: nextTicketId, title: fDesc.trim() || 'Fault reported — details to follow', eqId: fEq, pri: fPri, tech: fTech, status: 'Open', date: '14 Jul', by: 'Office' })
    onClose()
  }

  const label = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 5 } as const
  const field = { width: '100%', padding: '10px 12px', border: '1px solid #D4D7CF', borderRadius: 7, fontSize: 13, background: '#FFFFFF', color: '#1c1c1c', boxSizing: 'border-box' } as const

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.55)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: 480, maxWidth: '92vw', padding: '24px 26px', animation: 'popIn .2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>New Fault Ticket</h2>
          <button className="hv-close" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#6B7A8E', padding: 4 }}>✕</button>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={label}>EQUIPMENT</div>
          <select value={fEq} onChange={(e) => setFEq(e.target.value)} style={field}>
            {equipment.map((o) => <option key={o.id} value={o.id}>{o.name} — {o.client}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={label}>FAULT DESCRIPTION</div>
          <textarea value={fDesc} onChange={(e) => setFDesc(e.target.value)} placeholder="e.g. Chilled water temperature not holding setpoint…" style={{ ...field, minHeight: 76, resize: 'vertical' }} />
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={label}>PRIORITY</div>
            <div style={{ display: 'flex', gap: 5 }}>
              {['Critical', 'High', 'Medium'].map((p) => {
                const active = fPri === p
                return <button key={p} onClick={() => setFPri(p)} style={{ flex: 1, border: `1px solid ${active ? '#1c1c1c' : '#D4D7CF'}`, cursor: 'pointer', background: active ? '#1c1c1c' : '#FFFFFF', color: active ? '#FFFFFF' : '#3C4C61', fontSize: 12, fontWeight: 600, padding: '9px 4px', borderRadius: 6 }}>{p}</button>
              })}
            </div>
          </div>
          <div>
            <div style={label}>ASSIGN TECHNICIAN</div>
            <select value={fTech} onChange={(e) => setFTech(e.target.value)} style={field}>
              {TECHS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <button className="hv-brand" onClick={submit} style={{ marginTop: 20, width: '100%', border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8 }}>Create Ticket & Assign</button>
      </div>
    </div>
  )
}

/* --------------------------- Add equipment modal ------------------------- */

const EQUIPMENT_TYPES = ['HVAC — CHILLER', 'HVAC — VRV', 'HVAC — AHU', 'PLUMBING', 'FIRE SAFETY', 'ELECTRICAL', 'ELECTRICAL — GENSET']
const INTERVALS = ['Monthly', 'Quarterly', 'Bi-annual', 'Annual']

function AddEquipmentModal({ onClose }: { onClose: () => void }) {
  const { addEquipment, nextEquipmentId, equipment } = useStore()
  const clients = [...new Set(equipment.map((e) => e.client))]
  const [name, setName] = useState('')
  const [type, setType] = useState(EQUIPMENT_TYPES[0])
  const [client, setClient] = useState(clients[0] ?? '')
  const [site, setSite] = useState('')
  const [loc, setLoc] = useState('')
  const [serial, setSerial] = useState('')
  const [interval, setInterval_] = useState('Quarterly')
  const [error, setError] = useState('')

  const submit = () => {
    if (!name.trim()) { setError('Equipment name is required.'); return }
    const siteFallback = equipment.find((e) => e.client === client)?.site ?? 'Lagos'
    addEquipment({
      id: nextEquipmentId,
      name: name.trim(),
      type,
      client,
      site: site.trim() || siteFallback,
      loc: loc.trim() || 'To be confirmed',
      serial: serial.trim() || `${nextEquipmentId}-SN`,
      install: '14 Jul 2026',
      due: '14 Oct', dueSort: 1014, status: 'ok', interval, next: '14 Oct 2026',
      specs: [],
      history: [],
    })
    onClose()
  }

  const label = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 5 } as const
  const field = { width: '100%', padding: '10px 12px', border: '1px solid #D4D7CF', borderRadius: 7, fontSize: 13, background: '#FFFFFF', color: '#1c1c1c', boxSizing: 'border-box' } as const

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.55)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: 500, maxWidth: '92vw', maxHeight: '90vh', overflow: 'auto', padding: '24px 26px', animation: 'popIn .2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Add Equipment</h2>
          <button className="hv-close" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#6B7A8E', padding: 4 }}>✕</button>
        </div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: '#6B7A8E', marginTop: 4 }}>{nextEquipmentId} · A QR LABEL WILL BE GENERATED ON SAVE</div>

        <div style={{ marginTop: 16 }}>
          <div style={label}>EQUIPMENT NAME</div>
          <input value={name} onChange={(e) => { setName(e.target.value); setError('') }} placeholder="e.g. Trane CVHE Centrifugal Chiller" style={field} />
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={label}>TYPE</div>
            <select value={type} onChange={(e) => setType(e.target.value)} style={field}>
              {EQUIPMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div style={label}>SERVICE INTERVAL</div>
            <select value={interval} onChange={(e) => setInterval_(e.target.value)} style={field}>
              {INTERVALS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={label}>CLIENT</div>
            <select value={client} onChange={(e) => setClient(e.target.value)} style={field}>
              {clients.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={label}>SITE</div>
            <input value={site} onChange={(e) => setSite(e.target.value)} placeholder="e.g. Victoria Island" style={field} />
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={label}>LOCATION ON SITE</div>
            <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="e.g. Roof Plant Room" style={field} />
          </div>
          <div>
            <div style={label}>SERIAL NO.</div>
            <input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="e.g. TRN-CVHE-10021" style={field} />
          </div>
        </div>
        {error && (
          <div style={{ marginTop: 12, background: '#FBE2D5', border: '1px solid #F0C4AC', borderRadius: 7, padding: '9px 12px', fontSize: 12.5, color: '#8A3410' }}>{error}</div>
        )}
        <button className="hv-brand" onClick={submit} style={{ marginTop: 20, width: '100%', border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8 }}>Save &amp; Generate QR</button>
      </div>
    </div>
  )
}

/* -------------------------- Log visit modal (admin) ---------------------- */

// Admin logs a maintenance visit against the selected asset in place — the office
// records work on the technician's behalf without leaving the admin console.
function LogVisitModal({ onClose, onLogged }: { onClose: () => void; onLogged: () => void }) {
  const { selected: sel, addLog, parts: inventory } = useStore()
  const [tech, setTech] = useState(TECHS[0])
  const [issue, setIssue] = useState('')
  const [work, setWork] = useState('')
  const [notes, setNotes] = useState('')
  const [parts, setParts] = useState<{ name: string; qty: number }[]>([])
  const [partQ, setPartQ] = useState('')

  const results = partQ.trim() ? inventory.filter((p) => p.name.toLowerCase().includes(partQ.toLowerCase())).slice(0, 4) : []
  const addPart = (name: string) => {
    setParts((prev) => prev.find((x) => x.name === name) ? prev.map((x) => x.name === name ? { ...x, qty: x.qty + 1 } : x) : [...prev, { name, qty: 1 }])
    setPartQ('')
  }

  const submit = () => {
    addLog({
      eqId: sel.id, date: '14 Jul 2026', tech, tag: 'OFFICE LOG',
      issue: issue.trim() || 'Routine preventive maintenance — no faults found.',
      work: work.trim() || 'Full PM checklist completed per AMC scope; unit tested and returned to service.',
      notes: notes.trim() || 'No further action required before next scheduled service.',
      parts: parts.map((p) => ({ ...p })),
    })
    onLogged()
  }

  const label = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 5 } as const
  const field = { width: '100%', padding: '10px 12px', border: '1px solid #D4D7CF', borderRadius: 7, fontSize: 13, background: '#FFFFFF', color: '#1c1c1c', boxSizing: 'border-box' } as const
  const ta = { ...field, minHeight: 66, resize: 'vertical' } as const

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.55)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: 520, maxWidth: '92vw', maxHeight: '90vh', overflow: 'auto', padding: '24px 26px', animation: 'popIn .2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Log Maintenance Visit</h2>
          <button className="hv-close" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#6B7A8E', padding: 4 }}>✕</button>
        </div>
        <div style={{ marginTop: 14, background: '#F0F7FC', border: '1px solid #C9D4E2', borderRadius: 8, padding: '10px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#5E7391' }}>EQUIPMENT</div>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 2 }}>{sel.name}</div>
          </div>
          <span style={{ fontFamily: mono, fontSize: 10, color: '#5E7391' }}>{sel.id} · {sel.client}</span>
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={label}>TECHNICIAN</div>
            <select value={tech} onChange={(e) => setTech(e.target.value)} style={field}>
              {TECHS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div style={label}>DATE OF VISIT</div>
            <input value="14 Jul 2026" readOnly style={{ ...field, color: '#6B7A8E' }} />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={label}>FAULT / ISSUE FOUND</div>
          <textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Describe what was found on site…" style={ta} />
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={label}>WORK PERFORMED</div>
          <textarea value={work} onChange={(e) => setWork(e.target.value)} placeholder="What was done?" style={ta} />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={label}>PARTS REPLACED · FROM INVENTORY</div>
          <input value={partQ} onChange={(e) => setPartQ(e.target.value)} placeholder="Search spare parts…" style={field} />
          {results.length > 0 && (
            <div style={{ border: '1px solid #D4D7CF', borderRadius: 7, marginTop: 6, overflow: 'hidden', background: '#FFFFFF' }}>
              {results.map((p) => (
                <button key={p.sku} className="hv-soft" onClick={() => addPart(p.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', border: 'none', cursor: 'pointer', background: '#FFFFFF', textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #EEF0E9', fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: '#1c1c1c' }}>{p.name}</span>
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: p.qty < p.min ? '#AE3D0C' : '#166A45' }}>{p.qty} IN STOCK</span>
                </button>
              ))}
            </div>
          )}
          {parts.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 9 }}>
              {parts.map((c) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BRAND, color: '#FFFFFF', borderRadius: 20, padding: '6px 8px 6px 12px', fontSize: 12, fontWeight: 600 }}>
                  <span>{c.name}</span>
                  <button className="hv-chip-part" onClick={() => setParts((prev) => prev.map((x) => x.name === c.name ? { ...x, qty: x.qty + 1 } : x))} style={{ border: 'none', cursor: 'pointer', background: '#2A3E58', color: '#F4F6F3', borderRadius: 12, minWidth: 32, height: 24, fontFamily: mono, fontSize: 11, fontWeight: 600 }}>×{c.qty} +</button>
                  <button className="hv-link" onClick={() => setParts((prev) => prev.filter((x) => x.name !== c.name))} style={{ border: 'none', cursor: 'pointer', background: 'none', color: '#BEE0F5', fontSize: 13, padding: '2px 4px' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={label}>RECOMMENDATIONS / NOTES</div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything the client or office should know…" style={{ ...ta, minHeight: 54 }} />
        </div>

        <button className="hv-brand" onClick={submit} style={{ marginTop: 18, width: '100%', border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8 }}>Save Visit &amp; Compile Report</button>
      </div>
    </div>
  )
}

/* ---------------------------- Users & Access ----------------------------- */

const ROLE_BADGE: Record<string, { l: string; bg: string; fg: string }> = {
  admin: { l: 'ADMIN', bg: '#E9EDF4', fg: '#2A466B' },
  tech: { l: 'FIELD TECH', bg: '#DCEEE3', fg: '#166A45' },
  client: { l: 'CLIENT', bg: '#FCEFD6', fg: '#8A5A0B' },
}

const USER_COLS = '1.4fr 1.8fr 120px 1fr'

// Admins create Field Technician and Client accounts here — the only way to
// get access, since the sign-in screen has no self-service signup.
function UsersScreen({ padMain }: { padMain: string }) {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [loadErr, setLoadErr] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    let cancelled = false
    api.users.list()
      .then((u) => { if (!cancelled) { setUsers(u); setLoaded(true) } })
      .catch(() => { if (!cancelled) { setLoadErr('Could not load users — the API is unreachable.'); setLoaded(true) } })
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ padding: padMain, animation: 'fadeUp .3s ease', maxWidth: 1080 }}>
      {modal && <AddUserModal onClose={() => setModal(false)} onCreated={(u) => setUsers((prev) => [...prev, u])} />}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.3px' }}>Users &amp; Access</h1>
          <MonoLabel style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.8px' }}>
            {loaded && !loadErr ? `${users.length} ACCOUNTS · ` : ''}FIELD TECHNICIAN &amp; CLIENT ACCOUNTS ARE CREATED HERE
          </MonoLabel>
        </div>
        <button className="hv-brand" onClick={() => setModal(true)} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '11px 18px', borderRadius: 7 }}>+ Add User</button>
      </div>

      {loadErr && (
        <div style={{ marginTop: 18, background: '#FBE2D5', border: '1px solid #F0C4AC', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#8A3410' }}>{loadErr}</div>
      )}

      <div style={{ marginTop: 20, background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, overflowX: 'auto' }}>
        <div style={{ minWidth: 680 }}>
          <div style={{ display: 'grid', gridTemplateColumns: USER_COLS, gap: 12, padding: '10px 18px', background: '#F7F8F4', borderBottom: '1px solid #E0E2DA', fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E' }}>
            <div>NAME</div><div>EMAIL</div><div>ROLE</div><div>TITLE</div>
          </div>
          {users.map((u) => {
            const b = ROLE_BADGE[u.role] ?? ROLE_BADGE.client
            return (
              <div key={u.email} className="hv-row" style={{ display: 'grid', gridTemplateColumns: USER_COLS, gap: 12, alignItems: 'center', padding: '13px 18px', borderBottom: '1px solid #EEF0E9' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{u.name}</div>
                <div style={{ fontFamily: mono, fontSize: 11.5, color: '#3C4C61' }}>{u.email}</div>
                <div><Badge label={b.l} bg={b.bg} fg={b.fg} /></div>
                <div style={{ fontSize: 12.5, color: '#6B7A8E' }}>{u.title}</div>
              </div>
            )
          })}
          {loaded && !loadErr && users.length === 0 && (
            <div style={{ padding: '18px', fontSize: 13, color: '#6B7A8E' }}>No accounts yet — add the first one.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function AddUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: UserAccount) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'tech' | 'client'>('tech')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (busy) return
    if (!name.trim()) { setError('Full name is required.'); return }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setBusy(true)
    try {
      const created = await api.users.create({ name: name.trim(), email: email.trim(), password, role })
      onCreated(created)
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create the account — the API is unreachable.')
    } finally {
      setBusy(false)
    }
  }

  const label = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 5 } as const
  const field = { width: '100%', padding: '10px 12px', border: '1px solid #D4D7CF', borderRadius: 7, fontSize: 13, background: '#FFFFFF', color: '#1c1c1c', boxSizing: 'border-box' } as const

  const roleCard = (r: 'tech' | 'client', title: string, desc: string) => {
    const active = role === r
    return (
      <button key={r} onClick={() => setRole(r)} style={{ flex: 1, border: `1px solid ${active ? '#1c1c1c' : '#D4D7CF'}`, cursor: 'pointer', background: active ? '#1c1c1c' : '#FFFFFF', color: active ? '#FFFFFF' : '#3C4C61', textAlign: 'left', padding: '11px 13px', borderRadius: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
        <div style={{ fontSize: 11, marginTop: 2, opacity: 0.75 }}>{desc}</div>
      </button>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.55)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: 480, maxWidth: '92vw', maxHeight: '90vh', overflow: 'auto', padding: '24px 26px', animation: 'popIn .2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Add User</h2>
          <button className="hv-close" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#6B7A8E', padding: 4 }}>✕</button>
        </div>
        <div style={{ fontSize: 13, color: '#6B7A8E', marginTop: 6, lineHeight: 1.5 }}>
          The new user signs in at the portal with this email and password.
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={label}>ACCOUNT TYPE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {roleCard('tech', 'Field Technician', 'Scans QR, logs visits, signs off')}
            {roleCard('client', 'Client', 'Read-only portal: equipment & reports')}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={label}>{role === 'client' ? 'COMPANY / CONTACT NAME' : 'FULL NAME'}</div>
          <input value={name} onChange={(e) => { setName(e.target.value); setError('') }} placeholder={role === 'client' ? 'e.g. Harbour Point Facilities Ltd' : 'e.g. Chinedu Obi'} style={field} />
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={label}>EMAIL</div>
            <input value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="name@company.com" autoComplete="off" style={field} />
          </div>
          <div>
            <div style={label}>PASSWORD</div>
            <input value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} type="password" placeholder="min. 6 characters" autoComplete="new-password" style={field} />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, background: '#FBE2D5', border: '1px solid #F0C4AC', borderRadius: 7, padding: '9px 12px', fontSize: 12.5, color: '#8A3410' }}>{error}</div>
        )}
        <button className="hv-brand" onClick={() => void submit()} disabled={busy} style={{ marginTop: 18, width: '100%', border: 'none', cursor: busy ? 'wait' : 'pointer', background: busy ? '#7FB4D6' : BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8 }}>{busy ? 'Creating…' : 'Create Account'}</button>
      </div>
    </div>
  )
}
