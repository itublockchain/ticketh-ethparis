// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IEventReader {
    function getReputation(
        bytes32 domain,
        address user
    ) external view returns (uint256);
}
