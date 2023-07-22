import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NFTService } from 'src/modules/nft/NFT.service';
import { DefaultApiOperation } from 'src/utils/docs';
import { OwnedNftsResponse } from 'alchemy-sdk';
import { NFTQueryDto } from 'src/modules/nft/NFT.dto';

@ApiTags('NFT')
@Controller('nfts')
export class NFTController {
  constructor(private nftService: NFTService) {}

  @DefaultApiOperation('Get all NFTs of a user')
  @Get()
  public async genNFTs(
    @Query() query: NFTQueryDto,
  ): Promise<OwnedNftsResponse> {
    return await this.nftService.genNFTs(query.address);
  }
}
