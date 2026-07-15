import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DataService } from './data.service';

// Global so every feature module gets the same Prisma-backed store.
@Global()
@Module({
  providers: [PrismaService, DataService],
  exports: [DataService],
})
export class DataModule {}
