import { Injectable } from '@nestjs/common';
import { SEED_EQUIPMENT, SEED_PARTS, SEED_TICKETS, SEED_USERS } from './seed';
import { Equipment, FieldLog, Part, Ticket, User } from './types';

// In-memory system of record. This is the single seam to replace with a real
// database (TypeORM/Prisma) later — controllers only talk to this service.
@Injectable()
export class DataService {
  private readonly users: User[] = SEED_USERS;
  private equipment: Equipment[] = SEED_EQUIPMENT.map((e) => ({ ...e }));
  private tickets: Ticket[] = SEED_TICKETS.map((t) => ({ ...t }));
  private logs: FieldLog[] = [];
  readonly parts: Part[] = SEED_PARTS.map((p) => ({ ...p }));

  /* ------------------------------- auth -------------------------------- */

  findUser(email: string, password: string): User | undefined {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
  }

  /* ----------------------------- equipment ------------------------------ */

  listEquipment(): Equipment[] {
    return this.equipment;
  }

  hasEquipment(id: string): boolean {
    return this.equipment.some((e) => e.id === id);
  }

  addEquipment(input: Partial<Equipment> & { name: string }): Equipment {
    const id =
      input.id && !this.hasEquipment(input.id)
        ? input.id
        : this.nextId(this.equipment.map((e) => e.id), 'EQ-', 4);
    const eq: Equipment = {
      id,
      name: input.name,
      type: input.type ?? 'HVAC — CHILLER',
      client: input.client ?? 'Zenith Towers Facilities',
      site: input.site ?? 'Lagos',
      loc: input.loc ?? 'To be confirmed',
      serial: input.serial ?? `${id}-SN`,
      install: input.install ?? '14 Jul 2026',
      due: input.due ?? '14 Oct',
      dueSort: input.dueSort ?? 1014,
      status: input.status ?? 'ok',
      interval: input.interval ?? 'Quarterly',
      next: input.next ?? '14 Oct 2026',
      specs: input.specs ?? [],
      history: input.history ?? [],
    };
    this.equipment = [eq, ...this.equipment];
    return eq;
  }

  /* ------------------------------ tickets ------------------------------- */

  listTickets(): Ticket[] {
    return this.tickets;
  }

  addTicket(input: Partial<Ticket> & { eqId: string }): Ticket {
    const id =
      input.id && !this.tickets.some((t) => t.id === input.id)
        ? input.id
        : this.nextId(this.tickets.map((t) => t.id), 'TKT-', 4);
    const ticket: Ticket = {
      id,
      title: input.title ?? 'Fault reported — details to follow',
      eqId: input.eqId,
      pri: input.pri ?? 'High',
      tech: input.tech ?? 'Tunde Bakare',
      status: input.status ?? 'Open',
      date: input.date ?? '14 Jul',
      by: input.by ?? 'Office',
    };
    this.tickets = [ticket, ...this.tickets];
    return ticket;
  }

  /* ------------------------------- logs --------------------------------- */

  listLogs(eqId?: string): FieldLog[] {
    return eqId ? this.logs.filter((l) => l.eqId === eqId) : this.logs;
  }

  addLog(input: Partial<FieldLog> & { eqId: string }): FieldLog {
    const log: FieldLog = {
      eqId: input.eqId,
      date: input.date ?? '14 Jul 2026',
      tech: input.tech ?? 'Emeka Okafor',
      tag: input.tag ?? 'FIELD LOG',
      issue: input.issue ?? 'Routine preventive maintenance — no faults found.',
      work: input.work ?? 'Full PM checklist completed per AMC scope; unit tested and returned to service.',
      notes: input.notes ?? 'No further action required before next scheduled service.',
      parts: Array.isArray(input.parts) ? input.parts : [],
    };
    this.logs = [log, ...this.logs];
    return log;
  }

  /* ------------------------------ helpers ------------------------------- */

  private nextId(ids: string[], prefix: string, pad: number): string {
    const max = ids.reduce((m, id) => {
      const n = parseInt(id.slice(prefix.length), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 0);
    return prefix + String(max + 1).padStart(pad, '0');
  }
}
