import { Injectable } from '@nestjs/common';
import { Alchemy, Network, OwnedNftsResponse } from 'alchemy-sdk';
import { Environment } from 'src/utils/Environment';

@Injectable()
export class NFTService {
  alchemy: Alchemy;

  constructor() {
    const settings = {
      apiKey: Environment.ALCHEMY_API_KEY,
      network: Network.ETH_SEPOLIA,
    };

    this.alchemy = new Alchemy(settings);
  }

  public async genNFTs(address: string): Promise<OwnedNftsResponse> {
    return await this.alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [],
    });
  }
}
