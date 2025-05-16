// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPolicyEvaluator {
    function evaluate(address user, uint weightInKg) external view returns (bool, string memory);
}

contract SecureChain {
    address public owner;
    IPolicyEvaluator public policyEvaluator;

    enum Role { None, Driver, Inspector }
    enum StatusCode { None, InTransit, Delivered, Locked }

    struct Cargo {
        string id;
        uint weight;
        address registeredBy;
        StatusCode status;
    }

    struct CargoEvent {
        string description;
        address recordedBy;
        uint256 timestamp;
    }

    mapping(address => Role) public roles;
    mapping(bytes32 => Cargo) public cargos;
    mapping(bytes32 => CargoEvent[]) public cargoEvents;

    constructor(address _evaluatorAddress) {
        owner = msg.sender;
        policyEvaluator = IPolicyEvaluator(_evaluatorAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRole(Role r) {
        require(roles[msg.sender] == r || msg.sender == owner, "Access denied");
        _;
    }

    function assignRole(address user, uint8 roleId) external onlyOwner {
        require(roleId <= uint8(Role.Inspector), "Invalid role");
        roles[user] = Role(roleId);
    }

    function revokeRole(address user) external onlyOwner {
        roles[user] = Role.None;
    }

    function registerCargo(string memory cargoId, uint weight) external onlyRole(Role.Driver) {
        (bool allowed, string memory reason) = policyEvaluator.evaluate(msg.sender, weight);
        require(allowed, reason);

        bytes32 cargoHash = keccak256(abi.encodePacked(cargoId));
        cargos[cargoHash] = Cargo({
            id: cargoId,
            weight: weight,
            registeredBy: msg.sender,
            status: StatusCode.InTransit
        });

        cargoEvents[cargoHash].push(CargoEvent({
            description: "Cargo Registered",
            recordedBy: msg.sender,
            timestamp: block.timestamp
        }));
    }

    function updateCargoStatus(string memory cargoId, uint8 statusCode) public {
        require(statusCode <= uint8(StatusCode.Locked), "Invalid status");

        bytes32 cargoHash = keccak256(abi.encodePacked(cargoId));
        Cargo storage c = cargos[cargoHash];
        require(bytes(c.id).length > 0, "Cargo not found");

        if (statusCode == uint8(StatusCode.Locked)) {
            require(roles[msg.sender] == Role.Inspector || msg.sender == owner, "Not authorized to lock");
        } else {
            require(roles[msg.sender] == Role.Driver || msg.sender == owner, "Not authorized to update");
        }

        c.status = StatusCode(statusCode);

        string memory desc = statusCode == uint8(StatusCode.Delivered)
            ? "Cargo Delivered"
            : statusCode == uint8(StatusCode.InTransit)
                ? "Cargo In Transit"
                : "Cargo Locked";

        cargoEvents[cargoHash].push(CargoEvent({
            description: desc,
            recordedBy: msg.sender,
            timestamp: block.timestamp
        }));
    }

    function lockCargo(string memory cargoId) external onlyRole(Role.Inspector) {
        updateCargoStatus(cargoId, uint8(StatusCode.Locked));
    }

    function getCargo(string memory cargoId) external view returns (string memory, uint, address, StatusCode) {
        bytes32 hash = keccak256(abi.encodePacked(cargoId));
        Cargo memory c = cargos[hash];
        return (c.id, c.weight, c.registeredBy, c.status);
    }

    function getCargoHistory(string memory cargoId) external view returns (CargoEvent[] memory) {
        bytes32 hash = keccak256(abi.encodePacked(cargoId));
        return cargoEvents[hash];
    }
}
