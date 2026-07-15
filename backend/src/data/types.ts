// Domain types shared by all AMC Manager endpoints.
// These mirror the frontend's src/data.ts / src/auth.ts shapes 1:1.

export type StatusKey = 'ok' | 'due' | 'over';

export interface Spec {
  k: string;
  v: string;
}

export interface HistoryEntry {
  date: string;
  tech: string;
  tag: string;
  desc: string;
  parts: string[];
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  client: string;
  site: string;
  loc: string;
  serial: string;
  install: string;
  due: string;
  dueSort: number;
  status: StatusKey;
  interval: string;
  next: string;
  specs: Spec[];
  history: HistoryEntry[];
}

export interface Part {
  name: string;
  sku: string;
  qty: number;
  min: number;
  used: string;
}

export interface Ticket {
  id: string;
  title: string;
  eqId: string;
  pri: string;
  tech: string;
  status: string;
  date: string;
  by: string;
}

export interface FieldLog {
  eqId: string;
  date: string;
  tech: string;
  tag: string;
  issue: string;
  work: string;
  notes: string;
  parts: { name: string; qty: number }[];
}

export type UserRole = 'admin' | 'tech' | 'client';

export interface User {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  title: string;
}

export interface Session {
  email: string;
  name: string;
  role: UserRole;
}
