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
    mapping(bytes32 => mapping(address => bytes32)) public attestations;

    bytes32 eventSchema;
    address attestationAdmin;
    IEAS attestationService;

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
    function getEventAttestation(
        bytes32 eventId,
        address user
    ) external view returns (EventData memory) {
        bytes32 uid = attestations[eventId][user];
        require(uid != EMPTY_BYTES32, "EM: EMPTY_UID");

        Attestation memory attestation = attestationService.getAttestation(uid);
        require(attestation.uid != EMPTY_BYTES32, "EM: EMPTY_ATTESTATION");

        EventData memory data = abi.decode(attestation.data, (EventData));
        return data;
    }

    /// @inheritdoc IEventManager
    function updateEventAttestation(
        bytes32 eventId,
        address recipient,
        EventData calldata eventData
    ) external onlyAdmin returns (bytes32) {
        bytes32 uid = attestations[eventId][recipient];
        if (uid != EMPTY_BYTES32) {
            RevocationRequest memory revocationRequest = RevocationRequest(
                eventSchema,
                RevocationRequestData({uid: uid, value: ATTEST_VALUE})
            );

            // There exists an attestation already, cancel it
            attestationService.revoke(revocationRequest);
        }

        bytes memory attestationData = abi.encode(eventData);
        AttestationRequest memory attestationRequest = AttestationRequest(
            eventSchema,
            AttestationRequestData({
                recipient: recipient,
                expirationTime: U64_MAX,
                revocable: true,
                refUID: EMPTY_BYTES32,
                data: attestationData,
                value: ATTEST_VALUE
            })
        );

        return attestationService.attest(attestationRequest);
    }
}
