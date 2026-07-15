import type { StatusKey } from './theme'

export interface Spec {
  k: string
  v: string
}

export interface HistoryEntry {
  date: string
  tech: string
  tag: string
  desc: string
  parts: string[]
}

export interface Equipment {
  id: string
  name: string
  type: string
  client: string
  site: string
  loc: string
  serial: string
  install: string
  due: string
  dueSort: number
  status: StatusKey
  interval: string
  next: string
  specs: Spec[]
  history: HistoryEntry[]
}

export interface Part {
  name: string
  sku: string
  qty: number
  min: number
  used: string
}

export interface Ticket {
  id: string
  title: string
  eqId: string
  pri: string
  tech: string
  status: string
  date: string
  by: string
}

export interface ClientReport {
  ref: string
  date: string
  eq: string
  type: string
}

export const EQ: Equipment[] = [
  {
    id: 'EQ-0117', name: 'Carrier 30XA Air-Cooled Chiller', type: 'HVAC — CHILLER',
    client: 'Zenith Towers Facilities', site: 'Victoria Island', loc: 'Roof Plant Room',
    serial: 'CAR30XA-88213', install: '14 Mar 2022', due: '02 Jul', dueSort: 702,
    status: 'over', interval: 'Quarterly', next: '02 Oct 2026',
    specs: [
      { k: 'Cooling capacity', v: '350 kW' },
      { k: 'Refrigerant', v: 'R-134a' },
      { k: 'Compressors', v: '2× twin screw' },
      { k: 'Power supply', v: '415V / 3Ph / 50Hz' },
    ],
    history: [
      { date: '02 Apr 2026', tech: 'Emeka Okafor', tag: 'QUARTERLY PM', desc: 'Condenser coils chemically cleaned, refrigerant pressures verified, oil sample drawn for analysis. Approach temps within spec.', parts: [] },
      { date: '08 Jan 2026', tech: 'Tunde Bakare', tag: 'REPAIR', desc: 'Replaced failed condenser fan motor #3 after client noise complaint. Vibration levels re-checked and passed.', parts: ['Fan motor 1.5kW ×1'] },
      { date: '05 Oct 2025', tech: 'Emeka Okafor', tag: 'QUARTERLY PM', desc: 'Controls calibration, safeties tested, strainers cleaned. Chilled water ΔT restored to 5.6°C.', parts: ['Panel air filter ×2'] },
      { date: '11 Jul 2025', tech: 'Ifeoma Eze', tag: 'ANNUAL OVERHAUL', desc: 'Annual major service — eddy current testing on condenser tubes, full refrigerant charge check, contactor inspection.', parts: [] },
    ],
  },
  {
    id: 'EQ-0092', name: 'Grundfos Hydro MPC Fire Pump Set', type: 'FIRE SAFETY',
    client: 'Harbour Point Mall', site: 'Lekki Phase 1', loc: 'Fire Pump Room, B1',
    serial: 'GRU-MPC-40417', install: '22 Aug 2021', due: '22 Jul', dueSort: 722,
    status: 'due', interval: 'Monthly', next: '22 Aug 2026',
    specs: [
      { k: 'Duty', v: 'Jockey + 2 main' },
      { k: 'Rated flow', v: '2,850 L/min' },
      { k: 'Standard', v: 'NFPA 20' },
    ],
    history: [
      { date: '22 Jun 2026', tech: 'Tunde Bakare', tag: 'MONTHLY PM', desc: 'Weekly churn test witnessed, pressure switches verified, packing glands adjusted.', parts: [] },
      { date: '22 May 2026', tech: 'Tunde Bakare', tag: 'MONTHLY PM', desc: 'Flow test at 100% duty, batteries load-tested on diesel driver.', parts: [] },
    ],
  },
  {
    id: 'EQ-0138', name: 'Daikin VRV IV Heat Recovery System', type: 'HVAC — VRV',
    client: 'First Atlantic Bank HQ', site: 'Marina', loc: 'Roof Deck, Block A',
    serial: 'DKN-RXYQ-77120', install: '03 Feb 2023', due: '10 Sep', dueSort: 910,
    status: 'ok', interval: 'Quarterly', next: '10 Sep 2026',
    specs: [
      { k: 'Capacity', v: '56 HP combined' },
      { k: 'Indoor units', v: '38 cassettes' },
      { k: 'Refrigerant', v: 'R-410A' },
    ],
    history: [
      { date: '10 Jun 2026', tech: 'Ifeoma Eze', tag: 'QUARTERLY PM', desc: 'Outdoor coil wash, refrigerant piping inspection, indoor unit filter swap on floors 3–7.', parts: ['Cassette filter set ×12'] },
    ],
  },
  {
    id: 'EQ-0075', name: 'FG Wilson P500 Generator 500kVA', type: 'ELECTRICAL — GENSET',
    client: 'Zenith Towers Facilities', site: 'Victoria Island', loc: 'Generator House',
    serial: 'FGW-P500-33019', install: '30 Nov 2020', due: '18 Jul', dueSort: 718,
    status: 'due', interval: 'Monthly', next: '18 Aug 2026',
    specs: [
      { k: 'Prime rating', v: '500 kVA' },
      { k: 'Engine', v: 'Perkins 2506A' },
      { k: 'Fuel', v: 'AGO diesel, 2,000L day tank' },
    ],
    history: [
      { date: '18 Jun 2026', tech: 'Emeka Okafor', tag: 'MONTHLY PM', desc: 'Oil & filter change at 250hrs, coolant checked, load bank test 30min at 80%.', parts: ['Fuel filter ×1', 'Oil filter ×1'] },
      { date: '10 Jul 2026', tech: 'Emeka Okafor', tag: 'CALLOUT', desc: 'Investigated failed auto-start on mains outage — AVR module flagged for replacement.', parts: [] },
    ],
  },
  {
    id: 'EQ-0121', name: 'York AHU-03 Air Handling Unit', type: 'HVAC — AHU',
    client: 'Crestview Estate', site: 'Ikoyi', loc: 'Clubhouse Roof',
    serial: 'YRK-AHU-56102', install: '17 May 2022', due: '30 Aug', dueSort: 830,
    status: 'ok', interval: 'Quarterly', next: '30 Aug 2026',
    specs: [
      { k: 'Airflow', v: '12,000 m³/h' },
      { k: 'Coil', v: 'Chilled water, 6-row' },
      { k: 'Filters', v: 'G4 + F7 bag' },
    ],
    history: [
      { date: '30 May 2026', tech: 'Ifeoma Eze', tag: 'QUARTERLY PM', desc: 'Belt tension set, bearings greased, filter bank replaced, condensate tray treated.', parts: ['Panel air filter ×4'] },
    ],
  },
  {
    id: 'EQ-0064', name: 'Tyco Sprinkler Zone Valve Set', type: 'FIRE SAFETY',
    client: 'Harbour Point Mall', site: 'Lekki Phase 1', loc: 'Riser Room, L2',
    serial: 'TYC-ZV6-21458', install: '22 Aug 2021', due: '08 Jul', dueSort: 708,
    status: 'over', interval: 'Quarterly', next: '08 Oct 2026',
    specs: [
      { k: 'Zones', v: '6 (retail levels 1–3)' },
      { k: 'Valve type', v: 'Butterfly, supervised' },
      { k: 'Standard', v: 'NFPA 25' },
    ],
    history: [
      { date: '08 Apr 2026', tech: 'Tunde Bakare', tag: 'QUARTERLY PM', desc: 'Main drain test per zone, tamper switches verified, flow switch alarms confirmed at panel.', parts: [] },
    ],
  },
  {
    id: 'EQ-0143', name: 'Pedrollo Booster Pump Skid', type: 'PLUMBING',
    client: 'Crestview Estate', site: 'Ikoyi', loc: 'Pump House',
    serial: 'PED-BPS-90233', install: '09 Jan 2024', due: '25 Aug', dueSort: 825,
    status: 'ok', interval: 'Quarterly', next: '25 Aug 2026',
    specs: [
      { k: 'Configuration', v: 'Duty / assist / standby' },
      { k: 'Pressure', v: '6.5 bar delivery' },
    ],
    history: [
      { date: '25 May 2026', tech: 'Chinedu Obi', tag: 'QUARTERLY PM', desc: 'Pressure vessel pre-charge checked, mechanical seals inspected, VFD parameters logged.', parts: [] },
    ],
  },
  {
    id: 'EQ-0089', name: 'Schneider LV Distribution Panel', type: 'ELECTRICAL',
    client: 'First Atlantic Bank HQ', site: 'Marina', loc: 'Basement Switchroom',
    serial: 'SCH-LVP-11876', install: '03 Feb 2023', due: '02 Oct', dueSort: 1002,
    status: 'ok', interval: 'Bi-annual', next: '02 Oct 2026',
    specs: [
      { k: 'Rating', v: '2,500A main incomer' },
      { k: 'Sections', v: '12 outgoing ways' },
    ],
    history: [
      { date: '02 Apr 2026', tech: 'Chinedu Obi', tag: 'BI-ANNUAL PM', desc: 'Thermographic scan of busbars, torque check on terminations, breaker exercise cycle.', parts: [] },
    ],
  },
  {
    id: 'EQ-0150', name: 'Ebara Sewage Lift Station', type: 'PLUMBING',
    client: 'Zenith Towers Facilities', site: 'Victoria Island', loc: 'Basement 2',
    serial: 'EBR-SLS-44091', install: '14 Mar 2022', due: '18 Sep', dueSort: 918,
    status: 'ok', interval: 'Quarterly', next: '18 Sep 2026',
    specs: [
      { k: 'Pumps', v: '2× 5.5kW submersible' },
      { k: 'Control', v: 'Float + duty rotation' },
    ],
    history: [
      { date: '18 Jun 2026', tech: 'Chinedu Obi', tag: 'QUARTERLY PM', desc: 'Wet well cleaned, float switches tested, non-return valves inspected.', parts: [] },
    ],
  },
]

export const PARTS: Part[] = [
  { name: 'R-134a Refrigerant (13.6kg cyl)', sku: 'RF-134A-13', qty: 3, min: 4, used: '02 Apr 26 · EQ-0117' },
  { name: 'Compressor Oil POE 68 (5L)', sku: 'OL-POE68-5', qty: 12, min: 6, used: '02 Apr 26 · EQ-0117' },
  { name: 'Panel Air Filter 592×592×48', sku: 'FL-592-48', qty: 26, min: 20, used: '30 May 26 · EQ-0121' },
  { name: 'V-Belt SPB-2240', sku: 'VB-SPB2240', qty: 8, min: 10, used: '30 May 26 · EQ-0121' },
  { name: 'Fire Pump Mechanical Seal 40mm', sku: 'MS-FP-40', qty: 5, min: 2, used: '14 Feb 26 · EQ-0092' },
  { name: 'Sprinkler Head 68°C Pendent', sku: 'SH-68-PEN', qty: 44, min: 30, used: '08 Apr 26 · EQ-0064' },
  { name: 'Contactor 3P 95A 415V', sku: 'CT-3P95', qty: 6, min: 4, used: '02 Apr 26 · EQ-0089' },
  { name: 'Diesel Fuel Filter (FG Wilson)', sku: 'FF-FGW-P5', qty: 2, min: 6, used: '18 Jun 26 · EQ-0075' },
  { name: 'Pressure Gauge 0–16 bar', sku: 'PG-016B', qty: 9, min: 4, used: '25 May 26 · EQ-0143' },
  { name: 'AVR Module R450', sku: 'AVR-R450', qty: 1, min: 2, used: '10 Jul 26 · EQ-0075' },
]

export const TECHS = ['Emeka Okafor', 'Tunde Bakare', 'Ifeoma Eze', 'Chinedu Obi']

export const INITIAL_TICKETS: Ticket[] = [
  { id: 'TKT-1042', title: 'Sprinkler zone 4 low pressure alarm', eqId: 'EQ-0064', pri: 'High', tech: 'Tunde Bakare', status: 'Open', date: '12 Jul', by: 'Client' },
  { id: 'TKT-1041', title: 'Generator failed auto-start on mains outage', eqId: 'EQ-0075', pri: 'Critical', tech: 'Emeka Okafor', status: 'In Progress', date: '10 Jul', by: 'Client' },
  { id: 'TKT-1039', title: 'AHU vibration noise reported on 3rd floor', eqId: 'EQ-0138', pri: 'Medium', tech: 'Ifeoma Eze', status: 'Resolved', date: '06 Jul', by: 'Office' },
]

export const CLIENT_REPORTS: ClientReport[] = [
  { ref: 'UEL-SR-2026-0361', date: '18 Jun 2026', eq: 'FG Wilson P500 Generator', type: 'MONTHLY PM' },
  { ref: 'UEL-SR-2026-0355', date: '18 Jun 2026', eq: 'Ebara Sewage Lift Station', type: 'QUARTERLY PM' },
  { ref: 'UEL-SR-2026-0298', date: '02 Apr 2026', eq: 'Carrier 30XA Chiller', type: 'QUARTERLY PM' },
  { ref: 'UEL-SR-2026-0214', date: '08 Jan 2026', eq: 'Carrier 30XA Chiller', type: 'REPAIR' },
]

export const CLIENT_NAME = 'Zenith Towers Facilities'
