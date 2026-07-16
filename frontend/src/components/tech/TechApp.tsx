import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAND } from '../../theme'
import { useStore, type FieldLog } from '../../store'
import { mono, PhotoPlaceholder } from '../ui'
import { buildReportValues } from '../../reportValues'

// The technician experience is its own mobile field app, framed inside a phone
// mockup on a dark backdrop — distinct from the admin console and client portal.
export default function TechApp() {
  const { techScreen, session, logout } = useStore()
  const navigate = useNavigate()
  const signOut = () => { logout(); navigate('/') }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse at 50% 0%, #16283F 0%, #0B1626 65%)' }}>
      {/* field-app chrome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: BRAND, display: 'grid', placeItems: 'center', fontWeight: 800, color: '#FFFFFF', fontSize: 13, letterSpacing: '-0.5px' }}>UE</div>
          <div>
            <div style={{ color: '#F4F6F3', fontWeight: 700, fontSize: 13.5 }}>AMC Field App</div>
            <div style={{ color: '#7A8CA3', fontFamily: mono, fontSize: 9, letterSpacing: '1.2px' }}>FIELD TECHNICIAN{session ? ` · ${session.name.toUpperCase()}` : ''}</div>
          </div>
        </div>
        <button onClick={signOut} style={{ border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer', background: 'transparent', color: '#C7D2E0', fontSize: 12, fontWeight: 600, padding: '8px 13px', borderRadius: 7, whiteSpace: 'nowrap' }}>Sign out</button>
      </div>

      <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px 16px 28px', minHeight: 0 }}>
        <div style={{ width: 390, maxWidth: '100%', height: 'min(790px, calc(100dvh - 170px))', minHeight: 520, background: '#F2F3EF', borderRadius: 34, border: '6px solid #1D2C40', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ background: '#0E1E33', color: '#C7D2E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px 8px 20px', fontFamily: mono, fontSize: 11 }}>
            <span>09:41</span><span style={{ letterSpacing: '1px' }}>MTN NG · ▂▄▆█</span>
          </div>
          {techScreen === 'scan' && <Scan />}
          {techScreen === 'detail' && <TechDetail />}
          {techScreen === 'log' && <LogForm />}
          {techScreen === 'done' && <Done />}
          {techScreen === 'report' && <MobileReport />}
        </div>
      </div>
    </div>
  )
}

function Scan() {
  const { setSelId, setTechScreen, equipment, session } = useStore()
  const [manual, setManual] = useState(false)
  const [code, setCode] = useState('')
  const [codeErr, setCodeErr] = useState('')
  const sim = () => { setSelId('EQ-0117'); setTechScreen('detail') }

  const openCode = () => {
    const id = code.trim().toUpperCase()
    const hit = equipment.find((e) => e.id.toUpperCase() === id || e.serial.toUpperCase() === id)
    if (!hit) { setCodeErr(`No asset found for “${code.trim()}”. Try e.g. EQ-0092.`); return }
    setSelId(hit.id)
    setTechScreen('detail')
  }

  return (
    <div style={{ flex: 1, background: '#0E1E33', display: 'flex', flexDirection: 'column', padding: '20px 22px', color: '#F4F6F3' }}>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.5px', color: '#7A8CA3' }}>FIELD APP · {(session?.name ?? 'Emeka Okafor').toUpperCase()}</div>
      <h2 style={{ margin: '8px 0 0 0', fontSize: 22, fontWeight: 800, letterSpacing: '-0.3px' }}>Scan equipment QR</h2>
      <div style={{ fontSize: 13, color: '#9DACBE', marginTop: 6, lineHeight: 1.5 }}>Point the camera at the QR label on the asset tag to open its service record.</div>
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: 230, height: 230, position: 'relative', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 36, height: 36, borderTop: `4px solid ${BRAND}`, borderLeft: `4px solid ${BRAND}` }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 36, height: 36, borderTop: `4px solid ${BRAND}`, borderRight: `4px solid ${BRAND}` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 36, height: 36, borderBottom: `4px solid ${BRAND}`, borderLeft: `4px solid ${BRAND}` }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderBottom: `4px solid ${BRAND}`, borderRight: `4px solid ${BRAND}` }} />
          <div style={{ position: 'absolute', inset: 40, backgroundImage: 'repeating-linear-gradient(0deg,#31445E 0 4px,transparent 4px 10px),repeating-linear-gradient(90deg,#31445E 0 4px,transparent 4px 10px)', opacity: 0.7 }} />
        </div>
      </div>
      <button className="hv-brand" onClick={sim} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 15, padding: 17, borderRadius: 12, width: '100%' }}>Simulate scan — EQ-0117</button>
      {manual ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value); setCodeErr('') }}
              onKeyDown={(e) => { if (e.key === 'Enter') openCode() }}
              placeholder="Asset code, e.g. EQ-0092"
              autoFocus
              style={{ flex: 1, minWidth: 0, padding: '13px 14px', border: '1px solid #31445E', borderRadius: 10, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#F4F6F3' }}
            />
            <button className="hv-brand" onClick={openCode} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13.5, padding: '0 18px', borderRadius: 10, flex: 'none' }}>Open</button>
          </div>
          {codeErr && <div style={{ fontSize: 12, color: '#F0A98C', marginTop: 7 }}>{codeErr}</div>}
        </div>
      ) : (
        <button className="hv-link" onClick={() => setManual(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#7A8CA3', fontSize: 13, fontWeight: 600, padding: 14, marginTop: 2 }}>Enter asset code manually</button>
      )}
    </div>
  )
}

function TechDetail() {
  const { selected: sel, extraLogs, setTechScreen } = useStore()
  const extra = extraLogs.filter((l) => l.eqId === sel.id).map((l) => ({ date: l.date, tech: l.tech, desc: `${l.issue} ${l.work}`, dot: BRAND }))
  const history = [...extra, ...sel.history.map((h) => ({ date: h.date, tech: h.tech, desc: h.desc, dot: '#8FA0B6' }))]

  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <div style={{ padding: '14px 18px 0 18px' }}>
          <button className="hv-link" onClick={() => setTechScreen('scan')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3C4C61', fontSize: 13, fontWeight: 600, padding: 0 }}>← Scanner</button>
          <div style={{ marginTop: 12 }}><PhotoPlaceholder height={140} label="[ equipment photo ]" /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: '-0.2px' }}>{sel.name}</h2>
            <span style={{ background: sel.bBg, color: sel.bFg, fontFamily: mono, fontSize: 10, fontWeight: 600, padding: '4px 9px', borderRadius: 4 }}>{sel.bL}</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: '#6B7A8E', marginTop: 4 }}>{sel.id} · S/N {sel.serial}</div>
          <div style={{ fontSize: 12.5, color: '#3C4C61', marginTop: 3 }}>{sel.client} — {sel.site} · {sel.loc}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 9, padding: '10px 12px' }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#8A94A2' }}>INSTALLED</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginTop: 3 }}>{sel.install}</div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 9, padding: '10px 12px' }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#8A94A2' }}>NEXT SERVICE</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginTop: 3, color: sel.dueFg }}>{sel.dueLabel}</div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, padding: '14px 15px', marginTop: 10 }}>
            <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '1.2px', color: '#6B7A8E', marginBottom: 8 }}>SERVICE HISTORY</div>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr', gap: 11 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: h.dot, marginTop: 4, flex: 'none' }} />
                  <div style={{ width: 2, flex: 1, background: '#E7E9E1' }} />
                </div>
                <div style={{ paddingBottom: 14 }}>
                  <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600 }}>{h.date} <span style={{ color: '#8A94A2', fontWeight: 400 }}>· {h.tech}</span></div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 4, color: '#26364C' }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 86 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px 20px 18px', background: 'linear-gradient(transparent, #F2F3EF 32%)' }}>
        <button className="hv-brand" onClick={() => setTechScreen('log')} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 15.5, padding: 17, borderRadius: 12, width: '100%', boxShadow: '0 6px 18px rgba(232,100,28,0.35)' }}>Log New Maintenance Visit</button>
      </div>
    </>
  )
}

interface PartChip { name: string; qty: number }

function LogForm() {
  const { selected: sel, addLog, setTechScreen, session, parts: inventory } = useStore()
  const techName = session?.name ?? 'Emeka Okafor'
  const [issue, setIssue] = useState('')
  const [work, setWork] = useState('')
  const [notes, setNotes] = useState('')
  const [parts, setParts] = useState<PartChip[]>([])
  const [partQ, setPartQ] = useState('')
  const [phB, setPhB] = useState(false)
  const [phA, setPhA] = useState(false)
  const [signed, setSigned] = useState(false)

  const canvasEl = useRef<HTMLCanvasElement | null>(null)

  const sigRef = useCallback((el: HTMLCanvasElement | null) => {
    if (!el || canvasEl.current === el) return
    canvasEl.current = el
    const w = el.offsetWidth || 320
    const h = el.offsetHeight || 120
    el.width = w * 2
    el.height = h * 2
    const ctx = el.getContext('2d')!
    ctx.scale(2, 2)
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1c1c1c'
    el.style.touchAction = 'none'
    let down = false
    const pos = (ev: PointerEvent): [number, number] => { const b = el.getBoundingClientRect(); return [ev.clientX - b.left, ev.clientY - b.top] }
    el.onpointerdown = (ev) => { down = true; el.setPointerCapture(ev.pointerId); const [x, y] = pos(ev); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); ctx.stroke(); setSigned(true) }
    el.onpointermove = (ev) => { if (!down) return; const [x, y] = pos(ev); ctx.lineTo(x, y); ctx.stroke() }
    el.onpointerup = () => { down = false }
  }, [])

  const clearSig = () => {
    const c = canvasEl.current
    if (c) c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    setSigned(false)
  }

  const results = partQ.trim()
    ? inventory.filter((p) => p.name.toLowerCase().includes(partQ.toLowerCase())).slice(0, 4)
    : []

  const addPart = (name: string) => {
    setParts((prev) => prev.find((x) => x.name === name) ? prev.map((x) => x.name === name ? { ...x, qty: x.qty + 1 } : x) : [...prev, { name, qty: 1 }])
    setPartQ('')
  }

  const submit = () => {
    if (!signed) return
    const log: FieldLog = {
      eqId: sel.id, date: '14 Jul 2026', tech: techName, tag: 'FIELD LOG',
      issue: issue.trim() || 'Routine preventive maintenance — no faults found.',
      work: work.trim() || 'Full PM checklist completed per AMC scope; unit tested and returned to service.',
      notes: notes.trim() || 'No further action required before next scheduled service.',
      parts: parts.map((p) => ({ ...p })),
    }
    addLog(log)
    setTechScreen('done')
  }

  const label = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 6 } as const
  const ta = { width: '100%', boxSizing: 'border-box', minHeight: 74, padding: '12px 13px', border: '1px solid #D4D7CF', borderRadius: 10, fontSize: 14, resize: 'vertical', background: '#FFFFFF', color: '#1c1c1c' } as const
  const photoStyle = (on: boolean) => ({ height: 88, cursor: 'pointer', borderRadius: 12, fontSize: 13, fontWeight: 700, border: `2px dashed ${on ? '#9CCBB0' : '#C9CDC3'}`, background: on ? '#DCEEE3' : '#FFFFFF', color: on ? '#166A45' : '#3C4C61' } as const)

  return (
    <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '14px 18px 20px 18px' }}>
      <button className="hv-link" onClick={() => setTechScreen('detail')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3C4C61', fontSize: 13, fontWeight: 600, padding: 0 }}>← Cancel</button>
      <h2 style={{ margin: '10px 0 0 0', fontSize: 20, fontWeight: 800, letterSpacing: '-0.2px' }}>Maintenance visit log</h2>

      <div style={{ marginTop: 14, background: '#E9EDF4', border: '1px solid #C9D4E2', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#5E7391' }}>EQUIPMENT · FROM QR SCAN</div>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 2 }}>{sel.name}</div>
        </div>
        <span style={{ fontFamily: mono, fontSize: 10, color: '#5E7391' }}>🔒 {sel.id}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, padding: '11px 13px' }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#8A94A2' }}>DATE</div>
          <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>14 Jul 2026</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E0E2DA', borderRadius: 10, padding: '11px 13px' }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#8A94A2' }}>TECHNICIAN</div>
          <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>{techName}</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={label}>FAULT / ISSUE FOUND</div>
        <textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Describe what you found…" style={ta} />
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={label}>WORK PERFORMED</div>
        <textarea value={work} onChange={(e) => setWork(e.target.value)} placeholder="What did you do?" style={ta} />
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={label}>PARTS REPLACED · FROM INVENTORY</div>
        <input value={partQ} onChange={(e) => setPartQ(e.target.value)} placeholder="Search spare parts…" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1px solid #D4D7CF', borderRadius: 10, fontSize: 14, background: '#FFFFFF', color: '#1c1c1c' }} />
        {results.length > 0 && (
          <div style={{ border: '1px solid #D4D7CF', borderRadius: 10, marginTop: 6, overflow: 'hidden', background: '#FFFFFF' }}>
            {results.map((p) => (
              <button key={p.sku} className="hv-soft" onClick={() => addPart(p.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', border: 'none', cursor: 'pointer', background: '#FFFFFF', textAlign: 'left', padding: '13px 14px', borderBottom: '1px solid #EEF0E9', fontSize: 13.5 }}>
                <span style={{ fontWeight: 600, color: '#1c1c1c' }}>{p.name}</span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: p.qty < p.min ? '#AE3D0C' : '#166A45' }}>{p.qty} IN STOCK</span>
              </button>
            ))}
          </div>
        )}
        {parts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 9 }}>
            {parts.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BRAND, color: '#FFFFFF', borderRadius: 20, padding: '8px 8px 8px 14px', fontSize: 12.5, fontWeight: 600 }}>
                <span>{c.name}</span>
                <button className="hv-chip-part" onClick={() => setParts((prev) => prev.map((x) => x.name === c.name ? { ...x, qty: x.qty + 1 } : x))} style={{ border: 'none', cursor: 'pointer', background: '#2A3E58', color: '#F4F6F3', borderRadius: 12, minWidth: 34, height: 26, fontFamily: mono, fontSize: 11, fontWeight: 600 }}>×{c.qty} +</button>
                <button className="hv-link" onClick={() => setParts((prev) => prev.filter((x) => x.name !== c.name))} style={{ border: 'none', cursor: 'pointer', background: 'none', color: '#7A8CA3', fontSize: 14, padding: '2px 6px' }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={label}>PHOTOS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button className="hv-outline" onClick={() => setPhB((v) => !v)} style={photoStyle(phB)}>{phB ? '✓ Before photo added' : '📷 Before photo'}</button>
          <button className="hv-outline" onClick={() => setPhA((v) => !v)} style={photoStyle(phA)}>{phA ? '✓ After photo added' : '📷 After photo'}</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={label}>RECOMMENDATIONS / NOTES</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything the client or office should know…" style={{ ...ta, minHeight: 60 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E' }}>TECHNICIAN SIGNATURE</div>
          <button className="hv-link" onClick={clearSig} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3C4C61', fontSize: 12, fontWeight: 600 }}>Clear</button>
        </div>
        <canvas ref={sigRef} style={{ width: '100%', height: 120, background: '#FFFFFF', border: '1px solid #D4D7CF', borderRadius: 10, display: 'block', boxSizing: 'border-box' }} />
        {!signed && <div style={{ fontSize: 11.5, color: '#8A94A2', marginTop: 5 }}>Sign above with your finger to enable sign-off.</div>}
      </div>

      <button onClick={submit} className={signed ? 'hv-brand' : undefined} style={{ marginTop: 16, border: 'none', cursor: signed ? 'pointer' : 'not-allowed', background: signed ? BRAND : '#B9C2CE', color: '#FFFFFF', fontWeight: 700, fontSize: 15.5, padding: 17, borderRadius: 12, width: '100%' }}>Save visit &amp; sign off</button>
    </div>
  )
}

function Done() {
  const { selected: sel, lastLog, setTechScreen, equipment } = useStore()
  const r = buildReportValues(lastLog, sel, equipment)
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 78, height: 78, borderRadius: '50%', background: '#DCEEE3', display: 'grid', placeItems: 'center', fontSize: 34, color: '#166A45', animation: 'popIn .35s ease' }}>✓</div>
      <h2 style={{ margin: '18px 0 0 0', fontSize: 21, fontWeight: 800 }}>Visit logged</h2>
      <div style={{ fontSize: 13.5, color: '#3C4C61', lineHeight: 1.55, marginTop: 8, maxWidth: 270 }}>{sel.name} history updated. Next service auto-scheduled for <strong>{r.rNext}</strong>. The office has been notified.</div>
      <button className="hv-brand" onClick={() => setTechScreen('report')} style={{ marginTop: 26, border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 15, padding: 16, borderRadius: 12, width: '100%' }}>View service report</button>
      <button className="hv-dark-border" onClick={() => setTechScreen('scan')} style={{ marginTop: 8, border: '1px solid #C9CDC3', cursor: 'pointer', background: '#FFFFFF', color: '#1c1c1c', fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 12, width: '100%' }}>Scan next equipment</button>
    </div>
  )
}

function MobileReport() {
  const { selected: sel, lastLog, setTechScreen, equipment } = useStore()
  const r = buildReportValues(lastLog, sel, equipment)
  return (
    <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '14px 16px 20px 16px' }}>
      <button className="hv-link" onClick={() => setTechScreen('done')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#3C4C61', fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 10 }}>← Back</button>
      <div style={{ background: '#FFFFFF', border: '1px solid #D8DAD2', borderRadius: 8, overflow: 'hidden', boxShadow: '0 6px 20px rgba(10,22,38,0.12)' }}>
        <div style={{ background: '#0E1E33', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, background: BRAND, display: 'grid', placeItems: 'center', fontWeight: 800, color: '#0B1626', fontSize: 12 }}>UE</div>
            <div style={{ color: '#F4F6F3', fontWeight: 800, fontSize: 11.5 }}>ULTRAMODERN ENGINEERING</div>
          </div>
          <div style={{ color: BRAND, fontFamily: mono, fontSize: 9, letterSpacing: '1px', textAlign: 'right', whiteSpace: 'nowrap', flex: 'none' }}>SERVICE REPORT<br />{r.rRef}</div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 12, borderBottom: '2px solid #0E1E33' }}>
            <div><div style={{ fontFamily: mono, fontSize: 8.5, letterSpacing: '1px', color: '#8A94A2' }}>EQUIPMENT</div><div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{r.rEq}</div></div>
            <div><div style={{ fontFamily: mono, fontSize: 8.5, letterSpacing: '1px', color: '#8A94A2' }}>DATE / TECH</div><div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{r.rDate} · {r.rTech}</div></div>
          </div>
          <div style={{ marginTop: 12 }}><div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#8A5A0B' }}>FAULT FOUND</div><div style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 4 }}>{r.rIssue}</div></div>
          <div style={{ marginTop: 11 }}><div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1px', color: '#166A45' }}>WORK PERFORMED</div><div style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 4 }}>{r.rWork}</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            <PhotoPlaceholder height={76} label="[ before ]" />
            <PhotoPlaceholder height={76} label="[ after ]" />
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontStyle: 'italic', fontSize: 16, color: '#26364C' }}>{r.rTech}</div>
            <div style={{ borderTop: '1.5px solid #1c1c1c', marginTop: 3, paddingTop: 4, fontFamily: mono, fontSize: 8.5, letterSpacing: '1px', color: '#8A94A2', width: 150 }}>TECHNICIAN SIGN-OFF</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontFamily: mono, fontSize: 10, color: '#8A94A2', marginTop: 10 }}>PDF SENT TO OFFICE &amp; CLIENT PORTAL</div>
    </div>
  )
}
