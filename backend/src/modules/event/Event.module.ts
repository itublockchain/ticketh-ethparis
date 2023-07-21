import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/entities/Event.entity';
import { EventContoller } from 'src/modules/event/Event.controller';
import { EventService } from 'src/modules/event/Event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventContoller],
  providers: [EventService],
})
export class EventModule {}
