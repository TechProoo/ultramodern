import { Controller, Get } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { Part } from '../data/types';

@Controller('parts')
export class PartsController {
  constructor(private readonly data: DataService) {}

  @Get()
  list(): Part[] {
    return this.data.parts;
  }
}
