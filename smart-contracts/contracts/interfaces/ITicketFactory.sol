//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

struct Ticket {
    string domain;
    string name;
    uint256 price;
    uint256 deadline;
    bool isRefundable;
}

interface ITicketFactory is IERC1155 {
    /**
     * @param ticket Ticket - Ticket data
     * @dev Can only be called by the owner
     */
    function initTicket(Ticket calldata ticket) external;

    /**
     * @param tID uint256 - Ticket token id
     * @dev This function calls other chains to create attestations if the current chain is not the main chain
     */
    function mint(uint256 tID) external payable;

    /**
     * @param tID uint256 - Ticket token id
     * @dev If the token is refundable, the user can get a refund by this function, also creates attestations
     */
    function getRefund(uint256 tID) external;
}
