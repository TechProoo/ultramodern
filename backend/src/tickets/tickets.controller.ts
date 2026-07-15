import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { Ticket } from '../data/types';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly data: DataService) {}

  @Get()
  list(): Promise<Ticket[]> {
    return this.data.listTickets();
  }

  @Post()
  async create(@Body() body: Partial<Ticket>): Promise<Ticket> {
    if (!body || typeof body.eqId !== 'string' || !(await this.data.hasEquipment(body.eqId))) {
      throw new BadRequestException('eqId must reference existing equipment');
    }
    return this.data.addTicket({ ...body, eqId: body.eqId });
  }
}
