import { Module } from '@nestjs/common';
import { NFTController } from 'src/modules/nft/NFT.controller';
import { NFTService } from 'src/modules/nft/NFT.service';

@Module({
  imports: [],
  controllers: [NFTController],
  providers: [NFTService],
})
export class NFTModule {}
