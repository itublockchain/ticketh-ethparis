import { ethers } from 'ethers';
import { Environment } from 'src/utils/Environment';
import { getRpcProvider } from 'src/utils/getRPCProvider';

export const getSigner = (): ethers.Wallet => {
  return new ethers.Wallet(Environment.PRIVATE_KEY, getRpcProvider());
};
