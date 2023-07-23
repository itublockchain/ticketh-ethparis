import { Injectable } from '@nestjs/common';
import { Alchemy, Network, OwnedNftsResponse } from 'alchemy-sdk';
import { BigNumber, Wallet, ethers } from 'ethers';
import { Environment } from 'src/utils/Environment';
import { ERC1155 } from 'src/utils/abi';
import { getRpcProvider } from 'src/utils/getRPCProvider';

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
      contractAddresses: [Environment.NFT_CONTRACT],
    });
  }

  public async genHasNft(address: string, tokenId: number): Promise<boolean> {
    const contract = new ethers.Contract(
      Environment.NFT_CONTRACT,
      ERC1155,
      new Wallet(Environment.PRIVATE_KEY, getRpcProvider()),
    );

    try {
      const balance: BigNumber = await contract.balanceOf(
        address,
        BigNumber.from(tokenId),
      );
      return balance.gt(0);
    } catch (err) {
      return false;
    }
  }
}
