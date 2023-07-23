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
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepholia: {
      url: getEnv("SEPHOLIA_RPC_URL"),
      chainId: 11155111,
      accounts: [getEnv("DEPLOYER_PRIVATE_KEY")],
    },
    mumbai: {
      url: getEnv("MUMBAI_RPC_URL"),
      chainId: 80001,
      accounts: [getEnv("DEPLOYER_PRIVATE_KEY")],
    }
  }
};

export default config;
