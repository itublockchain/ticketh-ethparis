// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {IEventReader} from "./interfaces/IEventReader.sol";
import {EventDataType, EventData, IEventManager} from "./interfaces/IEventManager.sol";

interface CCIPGateway {
    function getAllEvents(
        bytes32 domain,
        address user
    ) external view returns (EventData[] memory);
}

/// @dev Reads attestation events using EIP3668
contract EventReader {
    ////////////////////////////////////////////////////////////////////////////
    // Constants
    ////////////////////////////////////////////////////////////////////////////

    bytes32 constant EMPTY_BYTES32 = bytes32(0);

    ////////////////////////////////////////////////////////////////////////////
    // Errors
    ////////////////////////////////////////////////////////////////////////////

    error OffchainLookup(
        address sender,
        string[] urls,
        bytes callData,
        bytes4 callbackFunction,
        bytes extraData
    );

    ////////////////////////////////////////////////////////////////////////////
    // Storage
    ////////////////////////////////////////////////////////////////////////////

    /// @dev Maps event type to score
    mapping(EventDataType => uint256) scores;

    /// @dev Address that manages events
    IEventManager eventManager;

    bool useOffchainResolver;
    string offchainResolverUrl;

    ////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////

    constructor(
        IEventManager _eventManager,
        uint256 _mainChainId,
        string memory _offchainResolverUrl
    ) {
        eventManager = _eventManager;
        useOffchainResolver = _mainChainId != block.chainid;
        offchainResolverUrl = _offchainResolverUrl;

        scores[EventDataType.Attendance] = 1;
        scores[EventDataType.HackathonPlacement] = 5;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////////

    /// @notice Calculates repuation of the user
    /// @param domain Hash of event, e.g. keccak256("ETHGlobal")
    /// @param user Address of the user
    /// @return Reputation of the user
    function getReputation(
        bytes32 domain,
        address user
    ) external view returns (uint256) {
        if (useOffchainResolver) {
            string[] memory urls = new string[](1);
            urls[0] = offchainResolverUrl;
            revert OffchainLookup(
                address(this),
                urls,
                abi.encodeWithSelector(
                    CCIPGateway.getAllEvents.selector,
                    domain,
                    user
                ),
                EventReader.getReputationOffchain.selector,
                abi.encodePacked(domain, user)
            );
        } else {
            EventData[] memory eventDatas = eventManager.getAllEvents(
                domain,
                user
            );
            return computeReputation(eventDatas);
        }
    }

    function getReputationOffchain(
        EventData[] calldata eventDatas
    ) external view returns (uint256) {
        return computeReputation(eventDatas);
    }

    function computeReputation(
        EventData[] memory eventDatas
    ) private view returns (uint256) {
        uint256 totalReputation;
        for (uint256 i = 0; i < eventDatas.length; i++) {
            EventData memory eventData = eventDatas[i];
            totalReputation += scores[eventData.eventType];
        }
        return totalReputation;
    }
}
