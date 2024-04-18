// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract AccessControl is Ownable {
    mapping(address => uint256) public roles;  // 0: None, 1: Admin, 2: Manufacturer, 3: Distributor, 4: Retailer, 5: Consumer

    event RoleAssigned(address indexed user, uint256 indexed role);
    event RoleRevoked(address indexed user, uint256 indexed oldRole);

    function assignRole(address user, uint256 role) public onlyOwner {
        roles[user] = role;
        emit RoleAssigned(user, role);
    }

    function revokeRole(address user) public onlyOwner {
        uint256 oldRole = roles[user];
        roles[user] = 0;  // Assign no role
        emit RoleRevoked(user, oldRole);
    }

    modifier onlyRole(uint256 role) {
        require(roles[msg.sender] == role, "AccessControl: insufficient permission");
        _;
    }
}
