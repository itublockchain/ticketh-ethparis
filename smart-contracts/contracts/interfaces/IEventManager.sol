// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IEAS} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

// Event Data Type is either Attendance or HackathonPlacement. Sure, it can be
// extended for different business logics but for simplicity we've gone with
// these two options
// This way different readers can interpret these events in their own way
enum EventDataType {
    Attendance,
    HackathonPlacement
}

struct EventData {
    /// @member Type of the event, e.g. EventDataType::Attendance
    EventDataType eventType;
    /// @member Name of the event, e.g. "ETHGlobal - Paris"
    string name;
    /// @member Extra data related to the event
    bytes extraData;
}

interface IEventManager {
    /// @notice Gets all events
    /// @param domain Hash of event, e.g. keccak256("ETHGlobal")
    /// @param user Address of the user
    /// @return All events for the domain and user
    function getAllEvents(
        bytes32 domain,
        address user
    ) external view returns (EventData[] memory);

    /// @notice Creates or replaces event attestation for an event and user
    /// @param domain Hash of event, e.g. keccak256("ETHGlobal")
    /// @param user Address of the user
    /// @return UID of the new event attestation
    function addEventAttestation(
        bytes32 domain,
        address user,
        EventData calldata eventData
    ) external returns (bytes32);
}
