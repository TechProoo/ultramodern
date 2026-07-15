import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { Equipment } from '../data/types';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly data: DataService) {}

  @Get()
  list(): Promise<Equipment[]> {
    return this.data.listEquipment();
  }

  @Post()
  create(@Body() body: Partial<Equipment>): Promise<Equipment> {
    if (!body || typeof body.name !== 'string' || !body.name.trim()) {
      throw new BadRequestException('name is required');
    }
    return this.data.addEquipment({ ...body, name: body.name.trim() });
  }
}
