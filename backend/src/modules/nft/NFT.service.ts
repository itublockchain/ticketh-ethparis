import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alchemy, Network, NftTokenType, OwnedNftsResponse } from 'alchemy-sdk';
import { BigNumber, Wallet, ethers } from 'ethers';
import { Attestation } from 'src/entities/Attestation.entity';
import { EasService } from 'src/modules/eas/Eas.service';
import { Environment } from 'src/utils/Environment';
import { ERC1155 } from 'src/utils/abi';
import { getRpcProvider } from 'src/utils/getRPCProvider';
import { Repository } from 'typeorm';

@Injectable()
export class NFTService {
  alchemy: Alchemy;

  constructor(
    @InjectRepository(Attestation)
    private attestationRepository: Repository<Attestation>,

    private easService: EasService,
  ) {
    const settings = {
      apiKey: Environment.ALCHEMY_API_KEY,
      network: Network.ETH_SEPOLIA,
    };

    this.alchemy = new Alchemy(settings);
  }

  public async genNFTs(address: string): Promise<OwnedNftsResponse> {
    // return await this.alchemy.nft.getNftsForOwner(address, {
    //   contractAddresses: [Environment.NFT_CONTRACT],
    // });
    const attestations = await this.attestationRepository.find({
      where: {
        recipient: address,
      },
    });

    return {
      ownedNfts: attestations.map((item) => {
        return {
          contract: {
            address: Environment.NFT_CONTRACT,
            tokenType: NftTokenType.ERC1155,
          },
          balance: 1,
          description: '',
          media: [],
          metadataError: '',
          rawMetadata: {},
          timeLastUpdated: '0',
          title: '',
          tokenId: String(item.eventId),
          tokenType: NftTokenType.ERC1155,
          tokenUri: {
            gateway: '',
            raw: '',
          },
        };
      }),
      blockHash: '',
      pageKey: '',
      totalCount: 0,
    };
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
