import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attestation } from 'src/entities/Attestation.entity';
import { Event } from 'src/entities/Event.entity';
import { EasService } from 'src/modules/eas/Eas.service';
import { EventService } from 'src/modules/event/Event.service';
import { NFTController } from 'src/modules/nft/NFT.controller';
import { NFTService } from 'src/modules/nft/NFT.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attestation])],
  controllers: [NFTController],
  providers: [NFTService, EventService, EasService],
})
export class NFTModule {}
