// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {IEventManager, EventData} from "./interfaces/IEventManager.sol";
import {IEAS, Attestation, RevocationRequest, RevocationRequestData, AttestationRequest, AttestationRequestData} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

contract EventManager is IEventManager {
    ////////////////////////////////////////////////////////////////////////////
    // Constants
    ////////////////////////////////////////////////////////////////////////////

    bytes32 constant EMPTY_BYTES32 = bytes32(0);
    uint64 constant U64_MAX = type(uint64).max;
    uint256 constant ATTEST_VALUE = 0;

    ////////////////////////////////////////////////////////////////////////////
    // Events
    ////////////////////////////////////////////////////////////////////////////

    event AttestationUpdated(bytes32 uid);

    ////////////////////////////////////////////////////////////////////////////
    // Storage
    ////////////////////////////////////////////////////////////////////////////

    // Event ID -> User -> Attestation
    mapping(bytes32 => mapping(address => uint256)) public attestationsLen;
    mapping(bytes32 => mapping(address => bytes32)) public attestations;

    bytes32 eventSchema;
    address attestationAdmin;
    IEAS public attestationService;

    ////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////

    constructor(
        IEAS _attestationService,
        address _attestationAdmin,
        bytes32 _eventSchema
    ) {
        attestationService = _attestationService;
        attestationAdmin = _attestationAdmin;
        eventSchema = _eventSchema;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Modifiers
    ////////////////////////////////////////////////////////////////////////////

    modifier onlyAdmin() {
        require(msg.sender == attestationAdmin, "EM: Only admin");
        _;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////////

    /// @inheritdoc IEventManager
    function getAllEvents(
        bytes32 domain,
        address user
    ) external view returns (EventData[] memory) {
        uint256 attestationLen = attestationsLen[domain][user];
        bytes32 latestUid = attestations[domain][user];
        EventData[] memory eventDatas = new EventData[](attestationLen);

        for (uint256 i = attestationLen - 1; i >= 0; i++) {
            Attestation memory attestation = attestationService.getAttestation(
                latestUid
            );
            EventData memory eventData = abi.decode(
                attestation.data,
                (EventData)
            );
            eventDatas[i] = eventData;
            latestUid = attestation.refUID;
        }

        return eventDatas;
    }

    /// @inheritdoc IEventManager
    function addEventAttestation(
        bytes32 domain,
        address recipient,
        EventData calldata eventData
    ) external onlyAdmin returns (bytes32) {
        // Create the new attestation, referencing the old one
        bytes32 uid = attestations[domain][recipient];
        bytes memory attestationData = abi.encode(eventData);
        AttestationRequest memory attestationRequest = AttestationRequest(
            eventSchema,
            AttestationRequestData({
                recipient: recipient,
                expirationTime: U64_MAX,
                revocable: true,
                refUID: uid,
                data: attestationData,
                value: ATTEST_VALUE
            })
        );

        // Set the newest UID
        bytes32 newUid = attestationService.attest(attestationRequest);
        attestations[domain][recipient] = newUid;
        attestationsLen[domain][recipient]++;
        return newUid;
    }
}
