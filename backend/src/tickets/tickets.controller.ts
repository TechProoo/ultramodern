import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { Ticket } from '../data/types';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly data: DataService) {}

  @Get()
  list(): Ticket[] {
    return this.data.listTickets();
  }

  @Post()
  create(@Body() body: Partial<Ticket>): Ticket {
    if (!body || typeof body.eqId !== 'string' || !this.data.hasEquipment(body.eqId)) {
      throw new BadRequestException('eqId must reference existing equipment');
    }
    return this.data.addTicket({ ...body, eqId: body.eqId });
  }
}
