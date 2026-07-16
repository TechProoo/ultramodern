import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAND, ACCENT } from '../../theme'
import { CLIENT_REPORTS, CLIENT_NAME } from '../../data'
import { useStore } from '../../store'
import { mono } from '../ui'

export default function ClientPortal() {
  const { decorate, equipment, logout } = useStore()
  const navigate = useNavigate()
  const signOut = () => { logout(); navigate('/') }
  const [modal, setModal] = useState(false)

  const clientEq = useMemo(() => equipment.filter((e) => e.client === CLIENT_NAME).map(decorate), [equipment, decorate])
  const clientSched = useMemo(() => [...clientEq].sort((a, b) => a.dueSort - b.dueSort), [clientEq])

  return (
    <div style={{ flex: 1, background: '#F2F3EF', overflow: 'auto' }}>
      {/* header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E0E2DA' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: '#1c1c1c', color: '#F4F6F3', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}>ZT</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Zenith Towers Facilities Ltd</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: '#6B7A8E', letterSpacing: '0.8px' }}>CLIENT PORTAL · READ-ONLY</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ background: '#EEF1F6', color: '#3C4C61', fontFamily: mono, fontSize: 10.5, padding: '6px 12px', borderRadius: 5 }}>AMC-2024-118 · VALID TO MAR 2027</span>
            <button className="hv-brand" onClick={() => setModal(true)} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '11px 18px', borderRadius: 7 }}>Report a Fault</button>
            <button className="hv-outline" onClick={signOut} style={{ border: '1px solid #D5D8DC', cursor: 'pointer', background: 'transparent', color: '#5B6470', fontSize: 12.5, fontWeight: 600, padding: '10px 14px', borderRadius: 7, whiteSpace: 'nowrap' }}>Sign out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: 24, animation: 'fadeUp .3s ease' }}>
        <div style={{ background: '#FBE2D5', border: '1px solid #F0C4AC', borderRadius: 9, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 11, marginBottom: 22 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT }} />
          <div style={{ fontSize: 13.5, color: '#8A3410' }}><strong>1 unit overdue for service.</strong> Your chiller quarterly PM was due 02 Jul — a technician visit is booked for Wed 16 Jul, 9:00 AM.</div>
        </div>

        <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '1.4px', color: '#6B7A8E', marginBottom: 12 }}>YOUR EQUIPMENT — {clientEq.length} UNITS UNDER CONTRACT</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14 }}>
          {clientEq.map((e) => (
            <div key={e.id} style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderTop: `4px solid ${e.dot}`, borderRadius: 10, padding: '17px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{e.name}</div>
                <span style={{ background: e.bBg, color: e.bFg, fontFamily: mono, fontSize: 9.5, fontWeight: 600, padding: '3px 8px', borderRadius: 4, flex: 'none' }}>{e.bL}</span>
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: '#6B7A8E', marginTop: 4 }}>{e.id} · {e.loc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #EEF0E9', fontSize: 12 }}>
                <span style={{ color: '#6B7A8E' }}>Next service</span>
                <span style={{ fontFamily: mono, fontWeight: 600, color: e.dueFg }}>{e.dueLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginTop: 24, alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.2px', color: '#6B7A8E', marginBottom: 12 }}>UPCOMING MAINTENANCE</div>
            {clientSched.map((s) => (
              <div key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F0F1EA' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.dot, flex: 'none' }} />
                <div style={{ fontFamily: mono, fontSize: 11.5, fontWeight: 600, width: 66, flex: 'none', color: s.dueFg }}>{s.dueLabel}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{s.name} <span style={{ color: '#8A94A2', fontWeight: 400 }}>· {s.interval} PM</span></div>
              </div>
            ))}
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.2px', color: '#6B7A8E', marginBottom: 12 }}>SERVICE REPORTS</div>
            {CLIENT_REPORTS.map((r) => (
              <div key={r.ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F0F1EA' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.eq}</div>
                  <div style={{ fontFamily: mono, fontSize: 10, color: '#8A94A2', marginTop: 2 }}>{r.ref} · {r.date} · {r.type}</div>
                </div>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 12.5, fontWeight: 700, flex: 'none' }}>Download PDF ↓</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal && <ClientFaultModal onClose={() => setModal(false)} />}
    </div>
  )
}

function ClientFaultModal({ onClose }: { onClose: () => void }) {
  const { equipment, addTicket, nextTicketId } = useStore()
  const clientEqOptions = equipment.filter((e) => e.client === CLIENT_NAME)
  const [cEq, setCEq] = useState('EQ-0117')
  const [cDesc, setCDesc] = useState('')
  const [createdId, setCreatedId] = useState<string | null>(null)
  const sent = createdId !== null

  const submit = () => {
    const id = nextTicketId
    addTicket({ id, title: cDesc.trim() || 'Fault reported via client portal', eqId: cEq, pri: 'High', tech: 'Tunde Bakare', status: 'Open', date: '14 Jul', by: 'Client' })
    setCreatedId(id)
  }

  const label = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 5 } as const
  const field = { width: '100%', padding: '10px 12px', border: '1px solid #D4D7CF', borderRadius: 7, fontSize: 13, background: '#FFFFFF', color: '#1c1c1c', boxSizing: 'border-box' } as const

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.55)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: 440, maxWidth: '92vw', padding: '24px 26px', animation: 'popIn .2s ease' }}>
        {!sent ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Report a fault</h2>
              <button className="hv-close" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#6B7A8E', padding: 4 }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: '#6B7A8E', marginTop: 6, lineHeight: 1.5 }}>Our operations desk will create a job ticket and dispatch a technician. Critical faults are attended within 4 hours.</div>
            <div style={{ marginTop: 16 }}>
              <div style={label}>EQUIPMENT</div>
              <select value={cEq} onChange={(e) => setCEq(e.target.value)} style={field}>
                {clientEqOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={label}>WHAT'S WRONG?</div>
              <textarea value={cDesc} onChange={(e) => setCDesc(e.target.value)} placeholder="e.g. Loud knocking noise from the generator house since this morning…" style={{ ...field, minHeight: 88, resize: 'vertical' }} />
            </div>
            <button className="hv-brand" onClick={submit} style={{ marginTop: 18, width: '100%', border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8 }}>Submit fault report</button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: 62, height: 62, margin: '0 auto', borderRadius: '50%', background: '#DCEEE3', display: 'grid', placeItems: 'center', fontSize: 26, color: '#166A45', animation: 'popIn .3s ease' }}>✓</div>
            <h2 style={{ margin: '14px 0 0 0', fontSize: 18, fontWeight: 800 }}>Ticket {createdId} created</h2>
            <div style={{ fontSize: 13, color: '#3C4C61', lineHeight: 1.55, marginTop: 7 }}>A technician has been assigned. You'll get an SMS when they're en route.</div>
            <button className="hv-dark-border" onClick={onClose} style={{ marginTop: 18, border: '1px solid #C9CDC3', cursor: 'pointer', background: '#FFFFFF', color: '#1c1c1c', fontWeight: 700, fontSize: 13.5, padding: '11px 26px', borderRadius: 8 }}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
