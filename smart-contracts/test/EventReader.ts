import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const SERVER_ADDRESS = "0xccaec61d44566fAE4bd1bdb47A92C5894bdE4eBF";
const GATEWAY_URL = "http://localhost:3668/";

describe("EventReader", () => {
    async function deployEventFixture() {
        const HARDHAT_CHAIN_ID = 31337;
        const FAKE_CHAIN_ID = 31338;

        const CORRECT_DOMAIN = ethers.id("Example Domain");
        const FAKE_DOMAIN = ethers.id(
            "Example Domain 2: Electric Bungaloo"
        );
        const [owner, user] = await ethers.getSigners();

        const SchemaRegistry = await ethers.getContractFactory(
            "SchemaRegistry"
        );
        const schemaRegistry = await SchemaRegistry.deploy();
        await schemaRegistry.waitForDeployment();

        const EASF = await ethers.getContractFactory("EAS");
        const eas = await EASF.deploy(await schemaRegistry.getAddress());
        await eas.waitForDeployment();

        const schema = "uint256 eventDataType, string name, bytes extraData";
        const EventManager = await ethers.getContractFactory("EventManager");
        const eventManager = await EventManager.deploy(
            await eas.getAddress(),
            owner.address
        );
        await eventManager.waitForDeployment();

        const AttesterResolver = await ethers.getContractFactory(
            "AttesterResolver"
        );
        const attester = await AttesterResolver.deploy(
            await eas.getAddress(),
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

        await eventManager.initialize(schemaUid);

        const EventReader = await ethers.getContractFactory("EventReader");
        const eventReader = await EventReader.deploy(
            await eventManager.getAddress(),
            FAKE_CHAIN_ID,
            GATEWAY_URL,
            SERVER_ADDRESS
        );
        await eventReader.waitForDeployment();

        return {
            owner,
            user,
            eas,
            schemaRegistry,
            attester,
            eventManager,
            eventReader,
            HARDHAT_CHAIN_ID,
            FAKE_CHAIN_ID,
            CORRECT_DOMAIN,
            FAKE_DOMAIN,
            schemaData,
            schemaUid,
        };
    }

    it("Should declare the schema", async () => {
        const { schemaRegistry, schemaData, schemaUid, owner } =
            await loadFixture(deployEventFixture);
        await schemaRegistry.connect(owner).register(...schemaData);
        const schema = await schemaRegistry.getSchema(schemaUid);
        expect([...schema]).to.be.deep.equal([
            schemaUid,
            schemaData[1],
            schemaData[2],
            schemaData[0],
        ]);
    });

    it("Should create same UID for manager", async () => {
        const { schemaUid, eventManager, schemaData } = await loadFixture(
            deployEventFixture
        );
        expect(await eventManager.schemaUid()).to.be.equal(schemaUid);
    });

    it("Should attest if manager", async () => {
        const {
            eventManager,
            schemaRegistry,
            schemaData,
            owner,
            user,
            CORRECT_DOMAIN,
        } = await loadFixture(deployEventFixture);
        await schemaRegistry.connect(owner).register(...schemaData);
        await eventManager
            .connect(owner)
            .addEventAttestation(CORRECT_DOMAIN, user.address, {
                eventType: 0,
                name: "Example Event",
                extraData: "0x",
            });
        const attestations = await eventManager.getAllEvents(
            CORRECT_DOMAIN,
            user.address
        );

        expect(attestations).to.be.length(1);
        expect(attestations[0].eventType).to.be.equal(0);
        expect(attestations[0].name).to.be.equal("Example Event");
    });

    it("Should use CCIP-Read", async () => {
        const {
            eventReader,
            eventManager,
            schemaRegistry,
            owner,
            schemaData,
            CORRECT_DOMAIN,
            user,
        } = await loadFixture(deployEventFixture);
        await schemaRegistry.connect(owner).register(...schemaData);
        await eventManager
            .connect(owner)
            .addEventAttestation(CORRECT_DOMAIN, user.address, {
                eventType: 0,
                name: "Example Event",
                extraData: "0x",
            });

        const reputationScore = await eventReader.getReputation(
            CORRECT_DOMAIN,
            user.address,
            { enableCcipRead: true }
        );
        expect(reputationScore).to.be.equal(1);
    });
});
