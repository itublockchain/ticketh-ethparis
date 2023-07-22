import * as CCIP from "@chainlink/ccip-read-server";
import * as fs from "fs";
import { Contract, Wallet, providers, utils } from "ethers";

const fromHumanAbi = (fragments: ReadonlyArray<string>) =>
    new utils.Interface(fragments).format(utils.FormatTypes.json);

const ccipGatewayAbi = fromHumanAbi([
    "function resolveEvents(bytes32 domain, address user) view returns (bytes memory, uint64, bytes memory)",
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
export function makeMockApp(signer: utils.SigningKey, basePath: string) {
    const server = new CCIP.Server();
    server.add(ccipGatewayAbi, [
        {
            type: "resolveEvents",
            func: async (args, request) => {
                const result =
                    "0x0000000000000000000000000000000000000000000000000000000000000020000000000000" +
                    "000000000000000000000000000000000000000000000000000100000000000000000000000000" +
                    "000000000000000000000000000000000000200000000000000000000000000000000000000000" +
                    "000000000000000000000000000000000000000000000000000000000000000000000000000000" +
                    "000000006000000000000000000000000000000000000000000000000000000000000000a00000" +
                    "00000000000000000000000000000000000000000000000000000000000d4578616d706c652045" +
                    "76656e740000000000000000000000000000000000000000000000000000000000000000000000" +
                    "00000000000000000000000000000000";

                // Hash and sign the response
                const validUntil = (2n ** 64n - 1n).toString(); // U64 max
                const messageHash = utils.solidityKeccak256(
                    ["bytes", "address", "uint64", "bytes32", "bytes32"],
                    [
                        "0x1900",
                        request?.to,
                        validUntil,
                        utils.keccak256(request?.data || "0x"),
                        utils.keccak256(result),
                    ]
                );
                const signature = signer.signDigest(messageHash);
                const sigData = utils.joinSignature(signature)
                return [result, validUntil, sigData];
            },
        },
    ]);

    return server.makeApp(basePath);
}
