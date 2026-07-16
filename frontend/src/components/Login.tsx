import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAND } from '../theme'
import { useStore } from '../store'
import { signIn } from '../auth'
import { mono, Logo } from './ui'

const labelStyle = { fontFamily: mono, fontSize: 10, letterSpacing: '1px', color: '#6B7A8E', marginBottom: 5 } as const
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1px solid #D4D7CF', borderRadius: 8, fontSize: 14, color: '#1c1c1c' } as const

export default function Login() {
  const navigate = useNavigate()
  const { login } = useStore()
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
        setError('Invalid email or password.')
      }
    } catch {
      setError('Cannot reach the server. Please try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ flex: 1, background: '#F5F6F8', display: 'grid', placeItems: 'center', padding: 24, overflow: 'auto', minHeight: 0 }}>
      <div style={{ width: 400, maxWidth: '100%', background: '#FFFFFF', border: '1px solid #E3E5E8', boxShadow: '0 12px 40px rgba(28,28,28,0.10)', borderRadius: 14, padding: '30px 28px', animation: 'fadeUp .3s ease', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Logo height={32} />
          <div style={{ fontWeight: 800, fontSize: 15 }}>AMC Manager</div>
        </div>
        <h2 style={{ margin: '20px 0 0 0', fontSize: 20, fontWeight: 800 }}>Sign in</h2>
        <div style={{ fontSize: 13, color: '#6B7A8E', marginTop: 6, lineHeight: 1.5 }}>
          Use the email and password provided by your administrator.
        </div>

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
          <button type="submit" disabled={busy} className="hv-brand" style={{ marginTop: 16, width: '100%', border: 'none', cursor: busy ? 'wait' : 'pointer', background: busy ? '#7FB4D6' : BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 8 }}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>

        <div style={{ fontSize: 12, color: '#8A94A2', marginTop: 14, lineHeight: 1.5 }}>
          Need access? Field technician and client accounts are created by the operations admin.
        </div>

        <button className="hv-link" onClick={() => navigate('/')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B7A8E', fontSize: 12.5, fontWeight: 600, padding: 0, marginTop: 18 }}>← Back to site</button>
      </div>
    </div>
  )
}
