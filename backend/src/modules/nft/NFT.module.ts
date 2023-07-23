import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/entities/Event.entity';
import { EventService } from 'src/modules/event/Event.service';
import { NFTController } from 'src/modules/nft/NFT.controller';
import { NFTService } from 'src/modules/nft/NFT.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [NFTController],
  providers: [NFTService, EventService],
})
export class NFTModule {}
