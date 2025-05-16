// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title PolicyEvaluator
/// @dev Simulates Forte Rules Engine evaluation using dynamic weight input
contract PolicyEvaluator {
    address public admin;
    string public policyId;

    mapping(address => bool) public verifiedDrivers;
    mapping(address => uint) public stablecoinDeposits; // user => amount deposited (in smallest unit)

    constructor(string memory _policyId) {
        admin = msg.sender;
        policyId = _policyId;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function setPolicyId(string memory _policyId) external onlyAdmin {
        policyId = _policyId;
    }

    function setVerifiedDriver(address driver, bool isVerified) external onlyAdmin {
        verifiedDrivers[driver] = isVerified;
    }

    function depositStablecoin(address user, uint amount) external onlyAdmin {
        stablecoinDeposits[user] += amount;
    }

    /// @dev Evaluate policy using user and weight (instead of cargoId)
    function evaluate(address user, uint weightInKg) external view returns (bool allowed, string memory reason) {
        if (!verifiedDrivers[user]) {
            return (false, "Driver not verified");
        }

        if (weightInKg > 1000) {
            return (false, "Cargo exceeds max weight");
        }

        if (stablecoinDeposits[user] < 100 ether) { // Assuming 6 decimals like USDC
            return (false, "Insufficient stablecoin deposit");
        }

        return (true, "Access granted");
    }
}
