import { ethers } from "hardhat";

const SEPHOLIA_EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const SEPHOLIA_SCHEMA_REGISTRY_ADDRESS =
    "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const DOMAIN = ethers.id("ETHGlobal");
const GATEWAY_URL = "";

async function deploy() {
    const chainId = await ethers.provider
        .getNetwork()
        .then((network) => network.chainId);
    const [deployer] = await ethers.getSigners();

    const schema = "uint256 eventDataType, string name, bytes extraData";
    const EventManager = await ethers.getContractFactory("EventManager");
    const eventManager = await EventManager.deploy(
        SEPHOLIA_EAS_ADDRESS,
        deployer.address
    );
    await eventManager.waitForDeployment();

    const AttesterResolver = await ethers.getContractFactory(
        "AttesterResolver"
    );
    const attester = await AttesterResolver.deploy(
        SEPHOLIA_EAS_ADDRESS,
        await eventManager.getAddress()
    );
    await attester.waitForDeployment();

    const schemaData: [string, string, boolean] = [
        schema,
        await attester.getAddress(),
        true,
    ];
    const schemaUid = ethers.keccak256(
        ethers.solidityPacked(["string", "address", "bool"], schemaData)
    );

    const tx = await eventManager.initialize(schemaUid);
    await tx.wait();

    const EventReader = await ethers.getContractFactory("EventReader");
    const eventReader = await EventReader.deploy(
        await eventManager.getAddress(),
        chainId,
        GATEWAY_URL,
        deployer.address
    );
    await eventReader.waitForDeployment();
}

deploy();
