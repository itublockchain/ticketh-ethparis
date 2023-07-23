import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NFTService } from 'src/modules/nft/NFT.service';
import { DefaultApiOperation } from 'src/utils/docs';
import { OwnedNftsResponse } from 'alchemy-sdk';
import {
  HasNFTQueryDto,
  NFTQueryDto,
  PasskitDto,
} from 'src/modules/nft/NFT.dto';
import { PKPass } from 'passkit-generator';
import { Environment } from 'src/utils/Environment';

import * as fs from 'fs';
import { EventService } from 'src/modules/event/Event.service';

@ApiTags('NFT')
@Controller('nfts')
export class NFTController {
  constructor(
    private nftService: NFTService,
    private eventService: EventService,
  ) {}

  @DefaultApiOperation('Get all NFTs of a user')
  @Get()
  public async genNFTs(
    @Query() query: NFTQueryDto,
  ): Promise<OwnedNftsResponse> {
    return await this.nftService.genNFTs(query.address);
  }

  @DefaultApiOperation('Check whether user has nft')
  @Get('hasNft')
  public async genHasNFT(
    @Query() query: HasNFTQueryDto,
  ): Promise<{ hasNft: boolean }> {
    const hasNft = await this.nftService.genHasNft(
      query.address,
      query.tokenId,
    );

    return { hasNft };
  }

  @DefaultApiOperation('Generate Passkit')
  @Post('passkit')
  public async genPasskit(
    @Body() body: PasskitDto,
  ): Promise<{ buffer: string }> {
    const relatedEvent = await this.eventService.genNullableEventById(
      Number(body.eventId),
    );

    const pass = await PKPass.from(
      {
        /**
         * Note: .pass extension is enforced when reading a
         * model from FS, even if not specified here below
         */
        model: __dirname + '/model/Custom.pass',
        certificates: {
          wwdr: fs.readFileSync(__dirname + '/certs/wwdr.pem'),
          signerCert: fs.readFileSync(__dirname + '/certs/signerCert.pem'),
          signerKey: fs.readFileSync(__dirname + '/certs/signerKey.pem'),
          signerKeyPassphrase: Environment.PASSKIT_SECRET,
        },
      },
      {
        authenticationToken: 'NONE_NONE_NONE_NONE',
        organizationName: 'ETH Global',
        passTypeIdentifier: 'pass.com.passkit.ticketh',
        serialNumber: 'AAGH44625236dddaffbda',
        description: relatedEvent.name ?? body.eventId,
        foregroundColor: 'rgb(60, 60, 60)',
        backgroundColor: 'rgb(0, 0, 0)',
        labelColor: 'rgb(0, 0, 0)',
        teamIdentifier: '38K4G66MUY',
      },
    );

    pass.type = 'eventTicket';
    pass.setBarcodes(
      JSON.stringify({ eventId: body.eventId, address: body.address }),
    );

    if (relatedEvent != null) {
      pass.primaryFields.push({
        key: 'name',
        label: relatedEvent.name,
        value: '',
      });

      pass.secondaryFields.push({
        key: 'address',
        label: body.address,
        value: '',
      });
    }

    return { buffer: Buffer.from(pass.getAsBuffer()).toString('base64') };
  }
}
