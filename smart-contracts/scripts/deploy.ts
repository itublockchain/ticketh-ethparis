import { ethers } from "hardhat";
import { EventReader } from "../typechain-types";

const SEPHOLIA_EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const SEPHOLIA_SCHEMA_REGISTRY_ADDRESS =
    "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const CCIP_ROUTER = "0xD0daae2231E9CB96b94C8512223533293C3693Bf";
const MUMBAI_CCIP_ROUTER = "0x70499c328e1E2a3c41108bd3730F6670a44595D1";
const LINK_SEPOLIA_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
const LINK_MUMBAI_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

async function deployManagerAndAttester() {
    const [deployer] = await ethers.getSigners();

    // console.log("Deploying event manager");
    const schema = "uint256 eventDataType, string name, bytes extraData";
    const EventManager = await ethers.getContractFactory("EventManager");
    const eventManager = await EventManager.deploy(
        SEPHOLIA_EAS_ADDRESS,
        deployer.address
    );
    console.log("Deployed event manager at", eventManager.address);
    console.log("Deploying attester resolver");
    const AttesterResolver = await ethers.getContractFactory(
        "AttesterResolver"
    );
    const attester = await AttesterResolver.deploy(
        SEPHOLIA_EAS_ADDRESS,
        eventManagerAddress
    );
    console.log("Deployed attester resolver at", attester.address);

    const schemaData: [string, string, boolean] = [
        schema,
        attesterAddress,
        true,
    ];
    const schemaUid = ethers.utils.keccak256(
        ethers.utils.solidityPack(["string", "address", "bool"], schemaData)
    );
    console.log("Schema UID:", schemaUid);

    console.log("Initializing event manager");
    const tx = await eventManager.initialize(schemaUid);
    await tx.wait();
    console.log("Initialized event manager");
}

async function deployEventReader(
    eventManagerAddress: string,
    gatewayUrl: string,
    overrideChainId?: number
) {
    const chainId = await ethers.provider
        .getNetwork()
        .then((network) => network.chainId);
    const [deployer] = await ethers.getSigners();

    console.log("Deploying event reader");
    const EventReader = await ethers.getContractFactory("EventReader");
    const eventReader = await EventReader.deploy(
        eventManagerAddress,
        overrideChainId ?? chainId,
        gatewayUrl,
        deployer.address
    );
    console.log("Deployed event reader at", eventReader.address);
}

async function changeOffchainResolverUrl(address: string, resolverUrl: string) {
    const [deployer] = await ethers.getSigners();
    const EventReaderFactory = await ethers.getContractFactory("EventReader");
    const eventReader: EventReader = EventReaderFactory.attach(
        address
    ) as EventReader;

    const tx = await eventReader
        .connect(deployer)
        .setOffchainResolverUrl(resolverUrl);
    await tx.wait();
    console.log(tx.hash);
}

async function deployTicketFactory() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying ticket factory");

    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    const ticketFactory = await TicketFactory.deploy(
        true,
        "0xfDCC186855EAcBbcc2a5Ca36570C7782cC5855F9",
        "0x063f94b7a9FCF762Ec6554AC7cD6929a7D1736f9"
    );
    await ticketFactory.deployed();

    console.log("Deployed ticket factory at", await ticketFactory.address);
}

async function deployMessenger() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying messenger");

    const Messenger = await ethers.getContractFactory("Messenger");
    const messenger = await Messenger.deploy(CCIP_ROUTER, LINK_SEPOLIA_ADDRESS);
    await messenger.deployed();

    console.log("Deployed messenger at", messenger.address);
}

async function deployMessengerMumbai() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying messenger");

    const Messenger = await ethers.getContractFactory("Messenger");
    const messenger = await Messenger.deploy(
        MUMBAI_CCIP_ROUTER,
        LINK_MUMBAI_ADDRESS
    );
    await messenger.deployed();

    console.log("Deployed messenger at", await messenger.address);
}

async function setFactorySettings() {
    const [deployer] = await ethers.getSigners();
    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    const factory = TicketFactory.attach(
        "0x21Eb8e80d915dd285a2Ac47c3042C0A4eb3CD924"
    );

    const tx = await factory.setReceiver(
        "0x52bDE7a29E0db26E015e28a7BD7F66489734c4F2"
    );
    // const tx = await factory.setMessenger("0x7f0a3a0C53AD91Cd8f63ee3555d956F25ab4aFEA");
    tx.wait();
}

async function initTicket() {
    const [deployer] = await ethers.getSigners();
    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    const factory = TicketFactory.attach(
        "0x21Eb8e80d915dd285a2Ac47c3042C0A4eb3CD924"
    );

    const tx = await factory.initTicket({
        domain: ethers.utils.id("ethglobal"),
        name: "paris cafe",
        price: ethers.utils.parseEther("0.03"),
        deadline: "99999999999",
        isRefundable: true,
    });

    tx.wait();
}

async function buyTicket() {
    const [deployer] = await ethers.getSigners();
    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    const factory = TicketFactory.attach(
        "0x21Eb8e80d915dd285a2Ac47c3042C0A4eb3CD924"
    );

    const tx = await factory.mint("1", {
        value: ethers.utils.parseEther("0.05"),
    });
    tx.wait();
    console.log(tx.hash);
}

// initTicket();

// deployManagerAndAttester();
deployEventReader(eventManagerAddress, "http://3.71.204.198:8080/");
