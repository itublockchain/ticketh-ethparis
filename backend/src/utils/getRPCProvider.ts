import { ethers } from 'ethers';
import { Environment } from 'src/utils/Environment';

export type ProviderEventFilter = {
  address: string;
  topics: Array<string>;
};

export const getRpcProvider = (): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(
    Environment.ALCHEMY_URL ?? Environment.NETWORK_RPC_URL,
  );
};
