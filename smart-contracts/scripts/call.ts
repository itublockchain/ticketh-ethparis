import { ethers } from "hardhat";
import * as fs from "fs";

const deployments = JSON.parse(fs.readFileSync("deployments.json", "utf8"));
const address = deployments["eventReader"];
const addressCcip = deployments["eventReaderCcipEnabled"];


async function call() {
    const abi = [
        "function getReputation(bytes32 domain, address user) view returns (uint256)"
    ];

    const domain = ethers.id("Hello");
    const queryAddress = ethers.Wallet.createRandom().address;

    const contract = new ethers.Contract(address, abi, ethers.provider);
    const response = await contract.getReputation(domain, queryAddress, { enableCcipRead: true });
    console.log("Response: ", response);

    const contractCcip = new ethers.Contract(addressCcip, abi, ethers.provider);
    const responseCcip = await contractCcip.getReputation(domain, queryAddress, { enableCcipRead: true });
    console.log("Response CCIP: ", responseCcip);
}

call();