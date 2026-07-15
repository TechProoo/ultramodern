import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { FieldLog } from '../data/types';

@Controller('logs')
export class LogsController {
  constructor(private readonly data: DataService) {}

  @Get()
  list(@Query('eqId') eqId?: string): Promise<FieldLog[]> {
    return this.data.listLogs(eqId);
  }

  @Post()
  async create(@Body() body: Partial<FieldLog>): Promise<FieldLog> {
    if (!body || typeof body.eqId !== 'string' || !(await this.data.hasEquipment(body.eqId))) {
      throw new BadRequestException('eqId must reference existing equipment');
    }
    return this.data.addLog({ ...body, eqId: body.eqId });
  }
}
