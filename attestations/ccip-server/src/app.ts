import * as CCIP from "@chainlink/ccip-read-server";
import { Contract, providers, utils } from "ethers";

const fromHumanAbi = (fragments: ReadonlyArray<string>) =>
    new utils.Interface(fragments).format(utils.FormatTypes.json);

const ccipGatewayAbi = fromHumanAbi([
    "function resolveEvents(bytes32 domain, address user) view returns (bytes memory, uint64, bytes memory)",
    "function resolveTwitterProof(string username, string postId, string uuid, uint64 createdAt) view returns (bytes memory, uint64, bytes memory)",
    "function resolveTwitter(address user) view returns (bytes memory, uint64, bytes memory)"
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

const socialManagerAbi = fromHumanAbi([
    "constructor(address _attestationService, string _offchainResolverUrl, address _offchainSigner) nonpayable",
    "error OffchainLookup(address sender, string[] urls, bytes callData, bytes4 callbackFunction, bytes extraData)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "function attestationService() view returns (address)",
    "function initialize(bytes32 _schemaUid)",
    "function offchainResolverUrl() view returns (string)",
    "function owner() view returns (address)",
    "function renounceOwnership()",
    "function schemaUid() view returns (bytes32)",
    "function setOffchainResolverUrl(string _offchainResolverUrl)",
    "function transferOwnership(address newOwner)",
    "function verified(address) view returns (bool)",
    "function verifyTwitterSocial(tuple(string username, string postId, string uuid, uint64 createdAt) proofData)",
    "function verifyTwitterSocialWithProof(bytes response, bytes extraData)",
]);

const providerDetails: Record<string, [number, string]> = {
    hardhat: [31337, "http://localhost:8545"],
    avaxFuji: [44787, "https://avalanche-fuji-c-chain.publicnode.com"],
    celoAlfajores: [43113, "https://alfajores-forno.celo-testnet.org"],
    sepholia: [11155111, "https://sepolia.gateway.tenderly.co"],
};

/**
 * @param privateKey Private key
 * @param basePath Path to get requests
 * @returns Server instance
 */
export function makeApp(signer: utils.SigningKey, basePath: string) {
    const server = new CCIP.Server();
    server.add(ccipGatewayAbi, [
        {
            type: "resolveEvents",
            func: async (args: utils.Result, request) => {
                const [domain, user] = args;
                const [providerChainId, providerUrl] = providerDetails.sepholia;
                const provider = new providers.JsonRpcProvider(
                    providerUrl,
                    providerChainId
                );
                const eventManagerAddress =
                    "0xfDCC186855EAcBbcc2a5Ca36570C7782cC5855F9";
                const eventManager = new Contract(
                    eventManagerAddress,
                    eventManagerAbi,
                    provider
                );
                const events = await eventManager.getAllEvents(domain, user);
                const result = utils.defaultAbiCoder.encode(
                    ["tuple(uint8 eventType, string name, bytes extraData)[]"],
                    [events]
                );

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
                const sigData = utils.joinSignature(signature);
                return [result, validUntil, sigData];
            },
        },
        {
            type: "resolveTwitterProof",
            func: async (args: utils.Result, request) => {
                const [username, postId, uuid, createdAt] = args;

                fetch("https://proof-service.next.id/v1/proof", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "create",
                        platform: "twitter",
                        identity: username,
                        publicKey: signer.publicKey,
                        proofLocation: postId,
                        extra: [],
                        uuid,
                        createdAt: createdAt.toString(),
                    }),
                }).then((res) => {
                    // Check if response is 200ish
                    if (!res.ok) {
                        throw new Error("Failed to create proof");
                    }
                });
                const result = utils.defaultAbiCoder.encode(
                    [
                        "tuple(string username, string postId, string uuid, uint64 createdAt)",
                    ],
                    [{ username, postId, uuid, createdAt }]
                );

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
                const sigData = utils.joinSignature(signature);
                return [result, validUntil, sigData];
            },
        },
        {
            type: "resolveTwitter",
            func: async (args: utils.Result, request) => {
                const [user] = args;
                const [providerChainId, providerUrl] = providerDetails.sepholia;
                const provider = new providers.JsonRpcProvider(
                    providerUrl,
                    providerChainId
                );
                const socialManagerAddress =
                    "0x9819D2eA0e0e8744A9aCA7Dab5697C273a05f147";
                const socialManager = new Contract(
                    socialManagerAddress,
                    socialManagerAbi,
                    provider
                );
                const verified = await socialManager.verified(user);
                const result = utils.defaultAbiCoder.encode(
                    ["bool"],
                    [verified]
                );

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
                const sigData = utils.joinSignature(signature);
                return [result, validUntil, sigData];
            },
        },
    ]);

    return server.makeApp(basePath);
}
