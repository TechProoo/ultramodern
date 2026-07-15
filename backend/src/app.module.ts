import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentModule } from './equipment/equipment.module';
import { PartsModule } from './parts/parts.module';
import { TicketsModule } from './tickets/tickets.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [DataModule, AuthModule, EquipmentModule, PartsModule, TicketsModule, LogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
