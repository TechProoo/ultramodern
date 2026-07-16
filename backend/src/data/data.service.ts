import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Equipment, FieldLog, Part, Ticket, User } from './types';

// System of record backed by Supabase Postgres via Prisma. Controllers only
// talk to this service, so swapping storage never touches the HTTP layer.
@Injectable()
export class DataService {
  constructor(private readonly prisma: PrismaService) {}

  /* ------------------------------- auth -------------------------------- */

  async findUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' }, password },
    });
    return (user as User | null) ?? undefined;
  }

  /* ------------------------------- users -------------------------------- */

  async listUsers(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: { email: true, name: true, role: true, title: true },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
    }) as Promise<Omit<User, 'password'>[]>;
  }

  async emailTaken(email: string): Promise<boolean> {
    const row = await this.prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
      select: { email: true },
    });
    return row !== null;
  }

  async addUser(input: { email: string; password: string; name: string; role: 'tech' | 'client' }): Promise<Omit<User, 'password'>> {
    const title = input.role === 'tech' ? 'Field Technician' : 'Client';
    const created = await this.prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        password: input.password,
        name: input.name.trim(),
        role: input.role,
        title,
      },
      select: { email: true, name: true, role: true, title: true },
    });
    return created as Omit<User, 'password'>;
  }

  /* ----------------------------- equipment ------------------------------ */

  async listEquipment(): Promise<Equipment[]> {
    const rows = await this.prisma.equipment.findMany({ orderBy: { seq: 'asc' } });
    return rows as unknown as Equipment[];
  }

  async hasEquipment(id: string): Promise<boolean> {
    const row = await this.prisma.equipment.findUnique({ where: { id }, select: { id: true } });
    return row !== null;
  }

  async addEquipment(input: Partial<Equipment> & { name: string }): Promise<Equipment> {
    const id =
      input.id && !(await this.hasEquipment(input.id))
        ? input.id
        : await this.nextEquipmentId();
    const created = await this.prisma.equipment.create({
      data: {
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
        specs: (input.specs ?? []) as unknown as Prisma.InputJsonValue,
        history: (input.history ?? []) as unknown as Prisma.InputJsonValue,
      },
    });
    return created as unknown as Equipment;
  }

  /* ------------------------------- parts -------------------------------- */

  async listParts(): Promise<Part[]> {
    // Keep the original inventory ordering (by seed insertion, sku is stable)
    const rows = await this.prisma.part.findMany();
    return rows as Part[];
  }

  /* ------------------------------ tickets ------------------------------- */

  async listTickets(): Promise<Ticket[]> {
    const rows = await this.prisma.ticket.findMany({ orderBy: { seq: 'desc' } });
    return rows as unknown as Ticket[];
  }

  async addTicket(input: Partial<Ticket> & { eqId: string }): Promise<Ticket> {
    const id =
      input.id && !(await this.prisma.ticket.findUnique({ where: { id: input.id }, select: { id: true } }))
        ? input.id
        : await this.nextTicketId();
    const created = await this.prisma.ticket.create({
      data: {
        id,
        title: input.title ?? 'Fault reported — details to follow',
        eqId: input.eqId,
        pri: input.pri ?? 'High',
        tech: input.tech ?? 'Tunde Bakare',
        status: input.status ?? 'Open',
        date: input.date ?? '14 Jul',
        by: input.by ?? 'Office',
      },
    });
    return created as unknown as Ticket;
  }

  /* ------------------------------- logs --------------------------------- */

  async listLogs(eqId?: string): Promise<FieldLog[]> {
    const rows = await this.prisma.fieldLog.findMany({
      where: eqId ? { eqId } : undefined,
      orderBy: { id: 'desc' },
    });
    return rows as unknown as FieldLog[];
  }

  async addLog(input: Partial<FieldLog> & { eqId: string }): Promise<FieldLog> {
    const created = await this.prisma.fieldLog.create({
      data: {
        eqId: input.eqId,
        date: input.date ?? '14 Jul 2026',
        tech: input.tech ?? 'Emeka Okafor',
        tag: input.tag ?? 'FIELD LOG',
        issue: input.issue ?? 'Routine preventive maintenance — no faults found.',
        work: input.work ?? 'Full PM checklist completed per AMC scope; unit tested and returned to service.',
        notes: input.notes ?? 'No further action required before next scheduled service.',
        parts: (Array.isArray(input.parts) ? input.parts : []) as unknown as Prisma.InputJsonValue,
      },
    });
    return created as unknown as FieldLog;
  }

  /* ------------------------------ helpers ------------------------------- */

  private async nextEquipmentId(): Promise<string> {
    const ids = await this.prisma.equipment.findMany({ select: { id: true } });
    return this.nextId(ids.map((r) => r.id), 'EQ-', 4);
  }

  private async nextTicketId(): Promise<string> {
    const ids = await this.prisma.ticket.findMany({ select: { id: true } });
    return this.nextId(ids.map((r) => r.id), 'TKT-', 4);
  }

  private nextId(ids: string[], prefix: string, pad: number): string {
    const max = ids.reduce((m, id) => {
      const n = parseInt(id.slice(prefix.length), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 0);
    return prefix + String(max + 1).padStart(pad, '0');
  }
}
