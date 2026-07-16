import { useNavigate } from 'react-router-dom'
import { BRAND } from '../theme'
import { mono, Logo } from './ui'
import heroImg from '../assets/hero_img.jpeg'

const services = [
  { name: 'HVAC', desc: 'Chillers, VRV/VRF systems, AHUs, precision cooling — quarterly PM with coil chemistry and refrigerant analysis.' },
  { name: 'Plumbing', desc: 'Booster pump skids, sewage lift stations, water treatment — pressure, seals and controls checked on schedule.' },
  { name: 'Fire Safety', desc: 'Fire pump sets, sprinkler zones, alarm panels — tested to NFPA 20/25 with witnessed flow tests.' },
  { name: 'Electrical', desc: 'Generators, LV panels, switchgear — load bank tests, thermographic scans and torque checks, logged per asset.' },
]

const steps = [
  { n: '01', title: 'Tag & register', desc: 'Every asset gets a QR label linked to its specs, install date and full service record.' },
  { n: '02', title: 'Preventive visits', desc: 'Technicians scan on-site, work the checklist, log parts and photos, and sign off on a phone.' },
  { n: '03', title: 'Signed reports', desc: 'Each visit compiles into a branded PDF report, delivered to your client portal automatically.' },
]

const stats = [
  { v: '120+', l: 'Sites under contract', c: '#1c1c1c' },
  { v: '2,400', l: 'Assets QR-tagged', c: '#1c1c1c' },
  { v: '4 hrs', l: 'Critical fault response', c: BRAND },
  { v: '98.2%', l: 'PM visits on time', c: '#1c1c1c' },
]

export default function Landing() {
  const navigate = useNavigate()
  const goLogin = () => navigate('/login')

  return (
    <div style={{ flex: 1, background: '#FFFFFF', color: '#1c1c1c', overflow: 'auto', minHeight: 0 }}>
      {/* top nav */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo height={34} />
          <div style={{ color: '#6B7280', fontFamily: mono, fontSize: 9.5, letterSpacing: '1.4px' }}>HVAC · PLUMBING · FIRE SAFETY · ELECTRICAL</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <a href="#services" style={{ color: '#1c1c1c', fontSize: 13.5, fontWeight: 600 }}>Services</a>
          <a href="#how" style={{ color: '#1c1c1c', fontSize: 13.5, fontWeight: 600 }}>How AMC works</a>
          <a href="#contact" style={{ color: '#1c1c1c', fontSize: 13.5, fontWeight: 600 }}>Contact</a>
          <button className="hv-brand" onClick={goLogin} style={{ border: 'none', cursor: 'pointer', background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '11px 20px', borderRadius: 7 }}>Sign in</button>
        </div>
      </div>

      {/* hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px,8vw,90px) 24px clamp(36px,6vw,70px) 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'clamp(28px,5vw,56px)', alignItems: 'center' }}>
          {/* copy */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '2px', color: BRAND }}>ANNUAL MAINTENANCE CONTRACTS · LAGOS, NIGERIA</div>
            <h1 style={{ margin: '16px 0 0 0', fontSize: 'clamp(34px,6vw,60px)', fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.04 }}>
              Your building's equipment,<br />always on.
            </h1>
            <p style={{ margin: '20px 0 0 0', fontSize: 'clamp(15px,2vw,17.5px)', lineHeight: 1.6, color: '#4B5563', maxWidth: 560 }}>
              We keep chillers, generators, pumps, fire systems and switchgear running for corporate and real-estate portfolios — with QR-tagged assets, scheduled preventive visits, and signed digital reports for every job.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 30, flexWrap: 'wrap' }}>
              <a href="#contact" className="hv-brand" style={{ background: BRAND, color: '#FFFFFF', fontWeight: 700, fontSize: 14.5, padding: '15px 26px', borderRadius: 9 }}>Request an AMC quote</a>
              <button className="hv-outline" onClick={goLogin} style={{ border: '1px solid #0274be', cursor: 'pointer', background: 'transparent', color: '#0274be', fontWeight: 700, fontSize: 14.5, padding: '15px 26px', borderRadius: 9 }}>Sign in to AMC Manager</button>
            </div>
          </div>

          {/* photo */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid #E3E5E8', boxShadow: '0 20px 50px rgba(28,28,28,0.16)', aspectRatio: '4 / 5', maxHeight: 520 }}>
            <img src={heroImg} alt="A serviced corporate property with pool plant maintained by Ultramodern Engineering" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', left: 16, bottom: 16, background: 'rgba(14,30,51,0.82)', color: '#F4F6F3', backdropFilter: 'blur(2px)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '1.4px', color: '#8FB8DA' }}>UNDER CONTRACT</div>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 2 }}>Zenith Towers · Victoria Island</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'clamp(24px,5vw,56px)', marginTop: 'clamp(40px,7vw,72px)', flexWrap: 'wrap' }}>
          {stats.map((s) => (
            <div key={s.l}>
              <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 600, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* services */}
      <div id="services" style={{ background: '#F5F6F8', borderTop: '1px solid #E3E5E8', borderBottom: '1px solid #E3E5E8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px,6vw,64px) 24px' }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '2px', color: '#6B7280' }}>WHAT WE MAINTAIN</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, marginTop: 20 }}>
            {services.map((s) => (
              <div key={s.name} style={{ background: '#FFFFFF', border: '1px solid #E3E5E8', borderTop: `3px solid ${BRAND}`, borderRadius: 10, padding: 20, boxShadow: '0 1px 3px rgba(28,28,28,0.05)' }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.55, marginTop: 8 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* how it works */}
      <div id="how" style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px,6vw,64px) 24px' }}>
        <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '2px', color: '#6B7280' }}>HOW AMC MANAGER WORKS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'clamp(16px,3vw,32px)', marginTop: 20 }}>
          {steps.map((s) => (
            <div key={s.n}>
              <div style={{ fontFamily: mono, fontSize: 13, color: BRAND }}>{s.n}</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginTop: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.55, marginTop: 7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* contact */}
      <div id="contact" style={{ background: '#F5F6F8', borderTop: '1px solid #E3E5E8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(36px,5vw,56px) 24px', display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Talk to our operations desk</div>
            <div style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.7, marginTop: 10 }}>
              Plot 14B Adeola Odeku St, Victoria Island, Lagos<br />
              +234 809 442 1100 · <a href="mailto:service@ultramoderneng.ng">service@ultramoderneng.ng</a>
            </div>
          </div>
          <button className="hv-outline" onClick={goLogin} style={{ border: '1px solid #0274be', cursor: 'pointer', background: 'transparent', color: '#0274be', fontWeight: 700, fontSize: 14, padding: '14px 24px', borderRadius: 9 }}>Client portal sign in</button>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 26px 24px', fontFamily: mono, fontSize: 10, color: '#8A94A2', letterSpacing: '0.8px' }}>
          © 2026 ULTRAMODERN ENGINEERING LIMITED · RC 448211
        </div>
      </div>
    </div>
  )
}
