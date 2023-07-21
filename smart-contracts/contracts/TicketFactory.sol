//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITicketFactory.sol";

contract TicketFactory is ITicketFactory, ERC1155, Ownable {
    // Token identifiers
    string public constant name = "Ticketh";
    string public constant symbol = "TETH";

    bool public immutable isMainChain;
    uint256 public ticketID;
    mapping(uint256 => Ticket) public ticketInfo;
    mapping(address => mapping(uint256 => bool)) public locks;

    /// @param isMain bool - Specify the current deploying chain is the main chain
    constructor(bool isMain) ERC1155("") {
        isMainChain = isMain;
    }

    /// @inheritdoc ITicketFactory
    function initTicket(Ticket calldata ticket) external onlyOwner {
        require(
            ticket.deadline > block.timestamp,
            "[initTicket] deadline must be in a future date"
        );

        ticketID++;
        ticketInfo[ticketID] = ticket;
    }

    /// @inheritdoc ITicketFactory
    function mint(uint256 tID) external payable {
        Ticket memory ticket = ticketInfo[tID];
        require(
            ticket.deadline >= block.timestamp,
            "[mint] deadline must be in a future date"
        );
        require(msg.value >= ticket.price, "[mint] insufficient funds");

        _mint(msg.sender, tID, 1, "");
    }

    /// @inheritdoc ITicketFactory
    function getRefund(uint256 tID) external {
        Ticket memory ticket = ticketInfo[tID];
        require(ticket.isRefundable, "[getRefund] ticket is not refundable");
        require(
            block.timestamp > ticket.deadline,
            "[getRefund] deadline is not over"
        );
        require(
            balanceOf(msg.sender, tID) > 0,
            "[getRefund] insufficient tickets"
        );

        locks[msg.sender][tID] = true;
        payable(msg.sender).transfer(ticket.price);

        attest();
    }

    function attest() private {
        if (isMainChain) {} else {}
    }

    /**
     * @inheritdoc ERC1155
     * @dev The token transfers are not allowed
     */
    function _safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) internal pure override {
        revert("[] transfers are not allowed");
    }
}
