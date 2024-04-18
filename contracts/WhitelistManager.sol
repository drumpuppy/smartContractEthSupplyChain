// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract WhitelistManager is Ownable {
    mapping(address => bool) private _whitelist;

    event WhitelistedAddressAdded(address indexed addr);
    event WhitelistedAddressRemoved(address indexed addr);

    function addAddressToWhitelist(address addr) public onlyOwner {
        require(addr != address(0), "WhitelistManager: address is the zero address");
        _whitelist[addr] = true;
        emit WhitelistedAddressAdded(addr);
    }

    function removeAddressFromWhitelist(address addr) public onlyOwner {
        require(addr != address(0), "WhitelistManager: address is the zero address");
        _whitelist[addr] = false;
        emit WhitelistedAddressRemoved(addr);
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return _whitelist[addr];
    }
}
