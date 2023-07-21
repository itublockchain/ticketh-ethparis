// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

struct EventData {
    /// @member Index of the event, increased after each event
    uint256 index;
    /// @member Name of the event
    string name;
    /// @member Extra data related to the event
    bytes extraData;
}

interface IEventManager {
    /// @notice Gets event attestation for an event and user
    /// @param eventId Hash of event, e.g. keccak256("ETHGlobal Paris")
    /// @param user Address of the user
    /// @return Event data
    function getEventAttestation(
        bytes32 eventId,
        address user
    ) external view returns (EventData memory);

    /// @notice Creates or replaces event attestation for an event and user
    /// @param eventId Hash of event, e.g. keccak256("ETHGlobal Paris")
    /// @param user Address of the user
    /// @return UID of the new event attestation
    function updateEventAttestation(
        bytes32 eventId,
        address user,
        EventData calldata eventData
    ) external returns (bytes32);
}
