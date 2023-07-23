// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEAS, AttestationRequest, AttestationRequestData} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {SignatureVerifier} from "./utils/SignatureVerifier.sol";
import {ISocialManager, TwitterProofData} from "./interfaces/ISocialManager.sol";

interface CCIPGateway {
    function resolveSocialProof(
        string memory username,
        string memory postId,
        string memory uuid,
        uint64 createdAt
    ) external view returns (bytes memory, uint64, bytes memory);
}

contract SocialManager is Ownable, ISocialManager {
    ////////////////////////////////////////////////////////////////////////////
    // Constants
    ////////////////////////////////////////////////////////////////////////////

    bytes32 constant EMPTY_BYTES32 = bytes32(0);
    uint64 constant U64_MAX = type(uint64).max;
    uint256 constant ATTEST_VALUE = 0;

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

    bool private initialized;
    bytes32 public schemaUid;
    string public offchainResolverUrl;
    IEAS public attestationService;

    /// @dev Set of signers
    mapping(address => bool) signers;

    /// @dev Verified users
    mapping(address => bool) public verified;

    function setOffchainResolverUrl(
        string memory _offchainResolverUrl
    ) external onlyOwner {
        offchainResolverUrl = _offchainResolverUrl;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////

    constructor(
        IEAS _attestationService,
        string memory _offchainResolverUrl,
        address _offchainSigner
    ) {
        offchainResolverUrl = _offchainResolverUrl;
        attestationService = _attestationService;

        signers[_offchainSigner] = true;
    }

    /// @dev This function has to be called before running anything
    /// @dev TODO: Add access control
    function initialize(bytes32 _schemaUid) external {
        require(!initialized, "EM: Already initialized");
        schemaUid = _schemaUid;
        initialized = true;
    }

    function verifyTwitterSocial(TwitterProofData memory proofData) external {
        bytes memory callData = abi.encodeWithSelector(
            CCIPGateway.resolveSocialProof.selector,
            proofData.username,
            proofData.postId,
            proofData.uuid,
            proofData.createdAt
        );

        string[] memory urls = new string[](1);
        urls[0] = offchainResolverUrl;

        revert OffchainLookup(
            address(this),
            urls,
            callData,
            SocialManager.verifyTwitterSocialWithProof.selector,
            callData
        );
    }

    function verifyTwitterSocialWithProof(
        bytes calldata response,
        bytes calldata extraData
    ) external {
        (address signer, bytes memory result) = SignatureVerifier.verify(
            extraData,
            response
        );
        require(signers[signer], "SM: Invalid signature");

        (bool success, TwitterProofData memory proofData) = abi.decode(
            result,
            (bool, TwitterProofData)
        );
        require(success, "SM: Invalid social proof");

        makeSocialAttestation(proofData);
    }

    function makeSocialAttestation(
        TwitterProofData memory proofData
    ) internal returns (bytes32) {
        bytes memory attestationData = abi.encode(proofData);
        AttestationRequest memory attestationRequest = AttestationRequest(
            schemaUid,
            AttestationRequestData({
                recipient: msg.sender,
                expirationTime: U64_MAX,
                revocable: false,
                refUID: EMPTY_BYTES32,
                data: attestationData,
                value: ATTEST_VALUE
            })
        );

        verified[msg.sender] = true;
        return attestationService.attest(attestationRequest);
    }
}
