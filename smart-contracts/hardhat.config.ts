import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
dotenv.config();

const getEnv = (name: string): string => {
  const value = process.env[name];
  if (value == undefined) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
  },
  networks: {
    sepholia: {
      url: "https://sepolia.gateway.tenderly.co",
      chainId: 11155111,
      accounts: [getEnv("DEPLOYER_PRIVATE_KEY")],
    }
  }
};

export default config;
