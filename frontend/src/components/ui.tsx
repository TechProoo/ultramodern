import type { CSSProperties, ReactNode } from 'react'
import logoImg from '../assets/logo.jpeg'

export const mono = "'IBM Plex Mono', monospace"

// Ultramodern Engineering's logo (gear mark + wordmark). The source file has
// a white background baked in, so on dark chrome it's set inside a white
// rounded chip; on light backgrounds it sits directly on the page.
export function Logo({ height = 32, onDark = false, style }: { height?: number; onDark?: boolean; style?: CSSProperties }) {
  const img = <img src={logoImg} alt="Ultramodern Engineering Limited" style={{ height, width: 'auto', display: 'block' }} />
  if (!onDark) return <div style={{ flex: 'none', ...style }}>{img}</div>
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 8, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', flex: 'none', ...style }}>
      {img}
    </div>
  )
}

export function Badge({ label, bg, fg, size = 10 }: { label: string; bg: string; fg: string; size?: number }) {
  return (
    <span style={{ background: bg, color: fg, fontFamily: mono, fontSize: size, fontWeight: 600, letterSpacing: '0.5px', padding: '4px 9px', borderRadius: 4, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

// Small monospace uppercase section label.
export function MonoLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '1.2px', color: '#6B7A8E', ...style }}>
      {children}
    </div>
  )
}

// A hatched placeholder block standing in for a photo.
export function PhotoPlaceholder({ height, label }: { height: number; label: string }) {
  return (
    <div style={{ height, borderRadius: 8, border: '1px solid #E0E2DA', background: 'repeating-linear-gradient(45deg,#E9EBE4 0 12px,#E1E4DB 12px 24px)', display: 'grid', placeItems: 'center' }}>
      <span style={{ fontFamily: mono, fontSize: 10.5, color: '#7C8798' }}>{label}</span>
    </div>
  )
}

// A little faux QR square used in the register table.
export function QrThumb() {
  return (
    <div style={{ width: 34, height: 34, border: '1px solid #D4D7CF', borderRadius: 4, padding: 3, background: '#FFFFFF' }}>
      <div style={{ width: '100%', height: '100%', backgroundImage: 'repeating-linear-gradient(0deg,#1c1c1c 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,#1c1c1c 0 2px,transparent 2px 5px)', opacity: 0.8 }} />
    </div>
  )
}
