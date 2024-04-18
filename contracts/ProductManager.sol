// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./WhitelistManager.sol";
import "./AccessControl.sol";
import "./SafeMath.sol";

contract ProductManager is Ownable, WhitelistManager, AccessControl {
    using SafeMath for uint256;

    struct Product {
        uint256 id;
        string name;
        uint256 lotNumber;
        uint256 totalPerLot;
        address manufacturer;
        address currentOwner;
        uint256 purchaseDate;
    }

    Product[] public products;
    uint256 public nextProductId;

    event ProductCreated(uint256 indexed productId, string productName);
    event OwnershipTransferred(uint256 indexed productId, address indexed previousOwner, address indexed newOwner);

    constructor() Ownable() {
        nextProductId = 0;
    }

    function createProduct(string memory name, uint256 lotNumber, uint256 totalPerLot, address manufacturer) public onlyOwner {
        products.push(Product({
            id: nextProductId,
            name: name,
            lotNumber: lotNumber,
            totalPerLot: totalPerLot,
            manufacturer: manufacturer,
            currentOwner: manufacturer,  // Initially, the manufacturer owns the product
            purchaseDate: block.timestamp  // Timestamp of product creation
        }));
        emit ProductCreated(nextProductId, name);
        nextProductId = nextProductId.add(1);
    }

    function transferProductOwnership(uint256 productId, address newOwner) public {
        require(msg.sender == products[productId].currentOwner, "ProductManager: caller is not the current owner");
        address previousOwner = products[productId].currentOwner;
        products[productId].currentOwner = newOwner;
        products[productId].purchaseDate = block.timestamp;  // Update purchase date on transfer
        emit OwnershipTransferred(productId, previousOwner, newOwner);
    }

    function getProductDetails(uint256 productId) public view returns (Product memory) {
        require(productId < nextProductId, "ProductManager: invalid product ID");
        return products[productId];
    }
}
