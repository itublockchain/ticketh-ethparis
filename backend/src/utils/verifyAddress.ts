import { ethers } from 'ethers';
import { CONFIG } from 'src/config';

//eslint-disable-next-line
const { hashMessage } = require('@ethersproject/hash');

export const verifyAddress = (header: string, address: string): boolean => {
  if (header == null) {
    return false;
  }

  return (
    ethers.utils.recoverAddress(hashMessage(CONFIG.AUTH_MESSAGE), header) ===
    address
  );
};
