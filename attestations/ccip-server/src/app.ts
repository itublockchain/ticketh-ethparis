import * as CCIP from "@chainlink/ccip-read-server";
import * as fs from "fs";
import { Contract, providers, utils } from "ethers";

const fromHumanAbi = (fragments: ReadonlyArray<string>) =>
    new utils.Interface(fragments).format(utils.FormatTypes.json);

const ccipGatewayAbi = fromHumanAbi([
    "function getAllEvents(bytes32 domain, address user) view returns (tuple(uint8 eventType, string name, bytes extraData)[])",
]);

const eventManagerAbi = fromHumanAbi([
    "constructor(address _attestationService, address _attestationAdmin, bytes32 _eventSchema) nonpayable",
    "event AttestationUpdated(bytes32 uid)",
    "function addEventAttestation(bytes32 domain, address recipient, tuple(uint8 eventType, string name, bytes extraData) eventData) returns (bytes32)",
    "function attestationService() view returns (address)",
    "function attestations(bytes32, address) view returns (bytes32)",
    "function attestationsLen(bytes32, address) view returns (uint256)",
    "function getAllEvents(bytes32 domain, address user) view returns (tuple(uint8 eventType, string name, bytes extraData)[])",
]);

const providerDetails: Record<string, [number, string]> = {
    avaxFuji: [44787, "https://avalanche-fuji-c-chain.publicnode.com"],
    celoAlfajores: [43113, "https://alfajores-forno.celo-testnet.org"],
    sepholia: [11155111, "https://sepolia.gateway.tenderly.co"],
};

/**
 * @param privateKey Private key
 * @param basePath Path to get requests
 * @returns Server instance
 */
export function makeApp(_privateKey: string, basePath: string) {
    const server = new CCIP.Server();
    server.add(ccipGatewayAbi, [
        {
            type: "getAllEvents",
            func: async (args: utils.Result) => {
                const [domain, user] = args;
                const [providerChainId, providerUrl] = providerDetails.sepholia;
                const provider = new providers.StaticJsonRpcProvider(
                    providerUrl,
                    providerChainId
                );
                const eventManagerAddress = "";
                const eventManager = new Contract(
                    eventManagerAddress,
                    eventManagerAbi,
                    provider
                );
                const events = await eventManager.getAllEvents(domain, user);
                return [events];
            },
        },
    ]);

    return server.makeApp(basePath);
}
