//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

struct TwitterProofData {
    string username;
    string postId;
    string uuid;
    uint64 createdAt;
}

interface ISocialManager {
    function verifyTwitterSocial(TwitterProofData calldata proofData) external;
    function verified(address user) external view returns (bool);
}
