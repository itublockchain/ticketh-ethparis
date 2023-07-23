//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

struct TwitterProofData {
    string username;
    string postId;
}

interface ISocialManager {
    function verifyTwitterSocial(
        string memory username,
        string memory postId
    ) external;
}
