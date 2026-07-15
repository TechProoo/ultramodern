// Brand + status palette for AMC Manager (Ultramodern Engineering)
export const BRAND = '#0274be'
export const ACCENT = '#e8622c'

export type StatusKey = 'ok' | 'due' | 'over'

export interface BadgeStyle {
  l: string
  bg: string
  fg: string
  dot: string
  dueFg: string
}

export const BADGE: Record<StatusKey, BadgeStyle> = {
  ok: { l: 'OK', bg: '#DCEEE3', fg: '#166A45', dot: '#1F8A5B', dueFg: '#3C4C61' },
  due: { l: 'DUE SOON', bg: '#FCEFD6', fg: '#8A5A0B', dot: '#D97706', dueFg: '#8A5A0B' },
  over: { l: 'OVERDUE', bg: '#FBE2D5', fg: '#AE3D0C', dot: '#e8622c', dueFg: '#AE3D0C' },
}

// Fault ticket priority + status colors
export const PRI: Record<string, { bg: string; fg: string }> = {
  Critical: { bg: '#FBE2D5', fg: '#AE3D0C' },
  High: { bg: '#FCEFD6', fg: '#8A5A0B' },
  Medium: { bg: '#E9EDF4', fg: '#2A466B' },
  Low: { bg: '#EEF1F6', fg: '#5E7391' },
}

export const STAT: Record<string, { bg: string; fg: string }> = {
  Open: { bg: '#FBE2D5', fg: '#AE3D0C' },
  'In Progress': { bg: '#E9EDF4', fg: '#2A466B' },
  Resolved: { bg: '#DCEEE3', fg: '#166A45' },
}
