import { ethers } from "hardhat";

const SEPHOLIA_EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const SEPHOLIA_SCHEMA_REGISTRY_ADDRESS =
    "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";

async function deployManagerAndAttester() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying event manager");
    const schema = "uint256 eventDataType, string name, bytes extraData";
    const EventManager = await ethers.getContractFactory("EventManager");
    const eventManager = await EventManager.deploy(
        SEPHOLIA_EAS_ADDRESS,
        deployer.address
    );
    await eventManager.waitForDeployment();
    console.log("Deployed event manager at", await eventManager.getAddress());

    console.log("Deploying attester resolver");
    const AttesterResolver = await ethers.getContractFactory(
        "AttesterResolver"
    );
    const attester = await AttesterResolver.deploy(
        SEPHOLIA_EAS_ADDRESS,
        await eventManager.getAddress()
    );
    await attester.waitForDeployment();
    console.log("Deployed attester resolver at", await attester.getAddress());

    const schemaData: [string, string, boolean] = [
        schema,
        await attester.getAddress(),
        true,
    ];
    const schemaUid = ethers.keccak256(
        ethers.solidityPacked(["string", "address", "bool"], schemaData)
    );
    console.log("Schema UID:", schemaUid);

    console.log("Initializing event manager");
    const tx = await eventManager.initialize(schemaUid);
    await tx.wait();
    console.log("Initialized event manager")
}

async function deployEventReader(eventManagerAddress: string, gatewayUrl: string) {
    const chainId = await ethers.provider
        .getNetwork()
        .then((network) => network.chainId);
    const [deployer] = await ethers.getSigners();

    const EventReader = await ethers.getContractFactory("EventReader");
    const eventReader = await EventReader.deploy(
        eventManagerAddress,
        chainId,
        gatewayUrl,
        deployer.address
    );
    await eventReader.waitForDeployment();
}

deployManagerAndAttester();
// deployEventReader(xxx, xxx);
