import { Global, Module } from '@nestjs/common';
import { DataService } from './data.service';

// Global so every feature module gets the same in-memory store instance.
@Global()
@Module({
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
