import type { Equipment } from './data'
import type { DecoratedEquipment, FieldLog } from './store'

export interface ReportValues {
  rRef: string
  rClient: string
  rSite: string
  rEq: string
  rSerial: string
  rDate: string
  rTech: string
  rNext: string
  rIssue: string
  rWork: string
  rNotes: string
  rParts: { name: string; qty: number }[]
}

// Builds the service-report fields from the most recent field log, falling back
// to sample content anchored on the currently selected equipment.
export function buildReportValues(lastLog: FieldLog | null, selected: DecoratedEquipment, equipment: Equipment[]): ReportValues {
  const eq = lastLog ? equipment.find((e) => e.id === lastLog.eqId) ?? selected : selected
  const rParts = lastLog ? lastLog.parts : [{ name: 'Panel Air Filter 592×592×48', qty: 2 }]
  return {
    rRef: 'UEL-SR-2026-0412',
    rClient: eq.client,
    rSite: eq.site,
    rEq: eq.name,
    rSerial: eq.serial,
    rDate: '14 Jul 2026',
    rTech: lastLog ? lastLog.tech : 'Emeka Okafor',
    rNext: eq.next,
    rIssue: lastLog ? lastLog.issue : 'Quarterly PM due; condenser approach temperature trending 1.8°C above baseline.',
    rWork: lastLog ? lastLog.work : 'Condenser coils chemically cleaned, refrigerant charge verified, panel filters replaced, safeties and controls tested. Unit returned to service at 14:20.',
    rNotes: lastLog ? lastLog.notes : 'Recommend R-134a top-up cylinder on next visit; approach temps should be re-checked in 30 days.',
    rParts,
  }
}
