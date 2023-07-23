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

    function resolveSocial(
        string memory username
    ) external view returns (bytes memory, uint64, bytes memory);
}

/// @dev Reads attestation events using EIP3668
contract EventReader is Ownable {
    ////////////////////////////////////////////////////////////////////////////
    // Constants
    ////////////////////////////////////////////////////////////////////////////

    bytes32 constant EMPTY_BYTES32 = bytes32(0);
    bytes32 constant EVENT_DOMAIN = keccak256("ETHGlobal");
    bytes32 constant TWITTER_DOMAIN = keccak256("Twitter");

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

    error InvalidDomain();

    ////////////////////////////////////////////////////////////////////////////
    // Storage
    ////////////////////////////////////////////////////////////////////////////

    /// @dev Maps event type to score
    mapping(EventDataType => uint256) scores;
    uint256 twitterVerificationScore = 2;

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

    function setTwitterVerificationScore(
        uint256 _twitterVerificationScore
    ) external onlyOwner {
        twitterVerificationScore = _twitterVerificationScore;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////////

    /// @notice Calculates repuation of the user
    /// @param domains Hash of events, e.g. keccak256("ETHGlobal")
    /// @param user Address of the user
    /// @return Reputation of the user
    function getReputation(
        bytes32[] calldata domains,
        address user
    ) external view returns (uint256) {
        uint256 totalReputation;
        for (uint256 i = 0; i < domains.length; i++) {
            bytes32 domain = domains[i];
            if (domain == EVENT_DOMAIN) {
                totalReputation += getEventReputation(domain, user);
            } else if (domain == TWITTER_DOMAIN) {
                totalReputation += getTwitterReputation(domain, user);
            } else {
                revert InvalidDomain();
            }
        }
        return totalReputation;
    }

    function getTwitterReputation(
        bytes32 domain,
        address user
    ) public view returns (uint256) {
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
                EventReader.getTwitterReputationWithProof.selector,
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

    function getTwitterReputationWithProof(
        bytes calldata response,
        bytes calldata extraData
    ) public view returns (uint256) {
        (address signer, bytes memory result) = SignatureVerifier.verify(
            extraData,
            response
        );
        require(signers[signer], "SignatureVerifier: Invalid signature");

        bool verified = abi.decode(result, (bool));
        return verified ? twitterVerificationScore : 0;
    }

    function getEventReputation(
        bytes32 domain,
        address user
    ) public view returns (uint256) {
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
                EventReader.getEventReputationWithProof.selector,
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

    function getEventReputationWithProof(
        bytes calldata response,
        bytes calldata extraData
    ) external view returns (uint256) {
        (address signer, bytes memory result) = SignatureVerifier.verify(
            extraData,
            response
        );
        require(signers[signer], "SignatureVerifier: Invalid signature");

        EventData[] memory eventDatas = abi.decode(result, (EventData[]));
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
