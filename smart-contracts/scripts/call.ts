import { ethers } from "hardhat";
import * as fs from "fs";

const deployments = JSON.parse(fs.readFileSync("deployments.json", "utf8"));
const address = deployments["sepholia"]["eventReader"];
const addressCcip = deployments["sepholia"]["eventReaderCcipEnabled"];
const addressManager = deployments["sepholia"]["eventManager"];

async function call() {
    const readerAbi = [
        "function getReputation(bytes32 domain, address user) view returns (uint256)"
    ];

    const managerAbi = [
        "function getAllEvents(bytes32 domain, address user) view returns (tuple(uint8 eventType, string name, bytes extraData)[])",
    ]

    const domain = ethers.utils.id("Hello");
    const queryAddress = ethers.Wallet.createRandom().address;

    const contract = new ethers.Contract(address, readerAbi, ethers.provider);
    const response = await contract.getReputation(domain, queryAddress, { ccipReadEnabled: true });
    console.log("Response: ", response);

    const eventManager = new ethers.Contract(addressManager, managerAbi, ethers.provider);
    const allEvents = await eventManager.getAllEvents(domain, queryAddress);
    console.log("All events: ", allEvents);
    
    const contractCcip = new ethers.Contract(addressCcip, readerAbi, ethers.provider);
    const responseCcip = await contractCcip.getReputation(domain, queryAddress, { ccipReadEnabled: true });
    console.log("Response CCIP: ", responseCcip);
}

call();