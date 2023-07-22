// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {IEventReader} from "./interfaces/IEventReader.sol";
import {EventDataType, EventData, IEventManager} from "./interfaces/IEventManager.sol";
import {SignatureVerifier} from "./utils/SignatureVerifier.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface CCIPGateway {
    function resolveEvents(
        bytes32 domain,
        address user
    ) external view returns (bytes memory, uint64, bytes memory);
}

/// @dev Reads attestation events using EIP3668
contract EventReader is Ownable {
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

    // @dev Set of signers
    mapping(address => bool) signers;

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
        string memory _offchainResolverUrl,
        address _offchainSigner
    ) {
        eventManager = _eventManager;
        useOffchainResolver = _mainChainId != block.chainid;
        offchainResolverUrl = _offchainResolverUrl;

        scores[EventDataType.Attendance] = 1;
        scores[EventDataType.HackathonPlacement] = 5;

        signers[_offchainSigner] = true;
    }

    function setOffchainResolverUrl(
        string memory _offchainResolverUrl
    ) external onlyOwner {
        offchainResolverUrl = _offchainResolverUrl;
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
            bytes memory callData = abi.encodeWithSelector(
                CCIPGateway.resolveEvents.selector,
                domain,
                user
            );

            string[] memory urls = new string[](1);
            urls[0] = offchainResolverUrl;
            revert OffchainLookup(
                address(this),
                urls,
                callData,
                EventReader.getReputationWithProof.selector,
                callData
            );
        } else {
            EventData[] memory eventDatas = eventManager.getAllEvents(
                domain,
                user
            );
            return computeReputation(eventDatas);
        }
    }

    function getReputationWithProof(
        bytes calldata response,
        bytes calldata extraData
    ) external view returns (uint256) {
        (address signer, bytes memory result) = SignatureVerifier.verify(
            extraData,
            response
        );
        require(signers[signer], "SignatureVerifier: Invalid signature");

        (EventData[] memory eventDatas, , ) = abi.decode(
            result,
            (EventData[], uint64, bytes)
        );
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
