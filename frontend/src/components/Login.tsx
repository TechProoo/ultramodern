import { useState, type FormEvent } from 'react'
import { BRAND } from '../theme'
import { useStore } from '../store'
import { signIn, DEMO_USERS, type Session } from '../auth'
import { mono } from './ui'

const roleCards: { role: Session['role']; title: string; desc: string }[] = [
  { role: 'admin', title: 'Office Admin', desc: 'Equipment register, schedules, tickets & inventory' },
  { role: 'tech', title: 'Field Technician', desc: 'Scan QR, log visits & sign off on your phone' },
  { role: 'client', title: 'Client', desc: 'View your equipment, schedules & reports' },
]

const labelStyle = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 5 } as const
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1px solid #D4D7CF', borderRadius: 8, fontSize: 14, color: '#1c1c1c' } as const

export default function Login() {
  const { setRole, login, loginAs } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const session = await signIn(email, password)
      if (session) {
        setError('')
        login(session)
      } else {
        setError('Invalid email or password. Try one of the demo accounts below.')
      }
    } finally {
      setBusy(false)
    }
  }

  const demoLogin = async (role: Parameters<typeof loginAs>[0]) => {
    if (busy) return
    setBusy(true)
    try { await loginAs(role) } finally { setBusy(false) }
  }

  return (
    <div style={{ flex: 1, background: '#F5F6F8', display: 'grid', placeItems: 'center', padding: 24, overflow: 'auto', minHeight: 0 }}>
      <div style={{ width: 400, maxWidth: '100%', background: '#FFFFFF', border: '1px solid #E3E5E8', boxShadow: '0 12px 40px rgba(28,28,28,0.10)', borderRadius: 14, padding: '30px 28px', animation: 'fadeUp .3s ease', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 36, height: 36, background: BRAND, display: 'grid', placeItems: 'center', fontWeight: 800, color: '#FFFFFF', fontSize: 15 }}>UE</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>AMC Manager</div>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '1.2px', color: '#8A94A2' }}>ULTRAMODERN ENGINEERING LTD</div>
          </div>
        </div>
        <h2 style={{ margin: '20px 0 0 0', fontSize: 20, fontWeight: 800 }}>Sign in</h2>

        <form onSubmit={submit}>
          <div style={{ marginTop: 16 }}>
            <div style={labelStyle}>EMAIL</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="username" style={inputStyle} />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={labelStyle}>PASSWORD</div>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" autoComplete="current-password" style={inputStyle} />
          </div>
          {error && (
            <div style={{ marginTop: 10, background: '#FBE2D5', border: '1px solid #F0C4AC', borderRadius: 7, padding: '9px 12px', fontSize: 12.5, color: '#8A3410' }}>{error}</div>
          )}
          <button type="submit" disabled={busy} className="hv-brand" style={{ marginTop: 14, width: '100%', border: 'none', cursor: busy ? 'wait' : 'pointer', background: busy ? '#7FB4D6' : BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8 }}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 12px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E0E2DA' }} />
          <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '1.4px', color: '#8A94A2' }}>DEMO — CONTINUE AS</span>
          <div style={{ flex: 1, height: 1, background: '#E0E2DA' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roleCards.map((c) => {
            const demo = DEMO_USERS.find((u) => u.role === c.role)!
            return (
              <button key={c.role} className="hv-role" disabled={busy} onClick={() => void demoLogin(c.role)} style={{ border: '1px solid #D4D7CF', cursor: busy ? 'wait' : 'pointer', background: '#FFFFFF', textAlign: 'left', padding: '13px 15px', borderRadius: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.title}</div>
                  <div style={{ fontFamily: mono, fontSize: 9.5, color: '#8A94A2' }}>{demo.email} / {demo.password}</div>
                </div>
                <div style={{ fontSize: 12, color: '#6B7A8E', marginTop: 2 }}>{c.desc}</div>
              </button>
            )
          })}
        </div>

        <button className="hv-link" onClick={() => setRole('landing')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B7A8E', fontSize: 12.5, fontWeight: 600, padding: 0, marginTop: 18 }}>← Back to site</button>
      </div>
    </div>
  )
}
