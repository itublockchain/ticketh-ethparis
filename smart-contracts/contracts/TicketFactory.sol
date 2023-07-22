//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITicketFactory.sol";
import "./AttestationMessenger.sol";
import "./interfaces/IEventManager.sol";
import "./interfaces/IEventReader.sol";

contract TicketFactory is ITicketFactory, ERC1155, Ownable {
    // Token identifiers
    string public constant name = "Ticketh";
    string public constant symbol = "TETH";
    uint64 constant RECEIVER_CHAIN_ID = 16015286601757825753;

    bool public immutable isMainChain;
    uint256 public ticketID;
    address public receiver;
    IEventManager public eventManager;
    IEventReader public reader;
    Messenger public messenger;
    mapping(uint256 => Ticket) public ticketInfo;
    mapping(address => mapping(uint256 => uint256)) public paidPrices;
    mapping(address => mapping(uint256 => bool)) public locks;

    event TicketInitiated(uint256 ticketID, Ticket ticket);
    event Attestation(address user);

    /// @param isMain bool - Specify the current deploying chain is the main chain
    /// @param manager address - Address of the EventManager contract for attestation
    constructor(
        bool isMain,
        address manager,
        address readerAddress
    ) ERC1155("") {
        isMainChain = isMain;
        eventManager = IEventManager(manager);
        reader = IEventReader(readerAddress);
    }

    /// @inheritdoc ITicketFactory
    function initTicket(Ticket calldata ticket) external onlyOwner {
        require(
            ticket.deadline > block.timestamp,
            "[initTicket] deadline must be in a future date"
        );

        ticketID++;
        ticketInfo[ticketID] = ticket;

        emit TicketInitiated(ticketID, ticket);
    }

    /// @inheritdoc ITicketFactory
    function mint(uint256 tID) external payable {
        Ticket memory ticket = ticketInfo[tID];
        require(
            ticket.deadline >= block.timestamp,
            "[mint] deadline must be in a future date"
        );

        uint256 price;
        uint256 reputation = reader.getReputation(
            ticket.domain,
            msg.sender
        );

        if (reputation < 1) {
            price = ticket.price;
        } else if (reputation < 3) {
            price = (ticket.price * 90) / 100;
        } else if (reputation < 7) {
            price = (ticket.price * 70) / 100;
        } else {
            price = ticket.price / 2;
        }

        require(msg.value >= price, "[mint] insufficient funds");
        paidPrices[msg.sender][tID] = msg.value;

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
        payable(msg.sender).transfer(paidPrices[msg.sender][tID]);

        attest(ticket, msg.sender);
    }

    function setReceiver(address receiverAddress) external onlyOwner {
        receiver = receiverAddress;
    }

    function setMessenger(address payable messengerAddress) external onlyOwner {
        messenger = Messenger(messengerAddress);
    }

    /// @dev also set in constructor
    function setManager(address managerAddress) external onlyOwner {
        eventManager = IEventManager(managerAddress);
    }

    /// @dev also set in constructor
    function setReader(address readerAddress) external onlyOwner {
        reader = IEventReader(readerAddress);
    }

    /// @inheritdoc ITicketFactory
    function attest(Ticket memory ticket, address user) public onlyMessenger {
        if (isMainChain) {
            eventManager.addEventAttestation(
                ticket.domain,
                user,
                EventData({
                    eventType: EventDataType.Attendance,
                    name: ticket.name,
                    extraData: ""
                })
            );
        } else {
            bytes memory data = abi.encode(ticket, user);

            messenger.sendMessagePayLINK(
                RECEIVER_CHAIN_ID,
                receiver,
                string(data)
            );
        }

        emit Attestation(user);
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

    modifier onlyMessenger() {
        require(
            msg.sender == address(messenger) || msg.sender == address(this),
            "[onlyMessenger] caller is not the messenger"
        );
        _;
    }
}
