// Import the the ethers shims (**BEFORE** ethers)
import '@ethersproject/shims';
// Import the ethers library
import { ethers } from 'ethers';

const wrappedEthers = ethers;

export { wrappedEthers };
