import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attestation } from 'src/entities/Attestation.entity';
import { Event } from 'src/entities/Event.entity';
import { EasController } from 'src/modules/eas/Eas.controller';
import { EasService } from 'src/modules/eas/Eas.service';
import { EventService } from 'src/modules/event/Event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attestation, Event])],
  controllers: [EasController],
  providers: [EasService, EventService],
})
export class EasModule {}
