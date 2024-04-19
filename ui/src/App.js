import React, { useState, useEffect } from 'react';

import Web3 from 'web3';
import './App.css';
import contractData from './ProductManager.json';
const ContractABI = contractData.abi;
const contractAddress = '0x5CebfEc765d01A64b7296fcD891bc2e4B8D33e3B';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState(null);

  const [productIdToTransfer, setProductIdToTransfer] = useState(0);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  

  const [productName, setProductName] = useState('');
  const [lotNumber, setLotNumber] = useState(0);
  const [totalPerLot, setTotalPerLot] = useState(0);
  

  const [manufacturer, setManufacturer] = useState('');
  const [viewProductId, setViewProductId] = useState(0);

  const [whitelistAddress, setWhitelistAddress] = useState('');
  const [whitelistAddressToRemove, setWhitelistAddressToRemove] = useState('');
  const [whitelistCheckAddress, setWhitelistCheckAddress] = useState('');
  const [isAddressWhitelisted, setIsAddressWhitelisted] = useState(null);


  const [roleAddress, setRoleAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState('0'); // Default to 'None'
  const [role, setRole] = useState('');
  const [revokeRoleAddress, setRevokeRoleAddress] = useState('');
  const [checkWhitelistAddress, setCheckWhitelistAddress] = useState('');



  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Connect to the local blockchain on Ganache
        const ganacheProvider = new Web3.providers.HttpProvider("http://localhost:7545");
        const web3 = new Web3(ganacheProvider);
        //const web3 = new Web3(window.ethereum);
        
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ContractABI, contractAddress);
        
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
  
        await loadProducts(contract);
      } catch (error) {
        console.error("Error connecting to Ganache. Make sure Ganache is running.", error);
      }
    };
  
    loadBlockchainData();
  }, []);
  
  
  const loadProducts = async (loadedContract) => {
    if (!loadedContract) {
      console.error("Contract not loaded, cannot load products.");
      return;
    }
    try {
      const productCount = await loadedContract.methods.nextProductId().call();
      const loadedProducts = [];
      for (let i = 0; i < productCount; i++) {
        let product = await loadedContract.methods.getProductDetails(i).call();
        loadedProducts.push(product);
      }
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };
  

  const viewProduct = async (productId) => {
    const product = await contract.methods.getProductDetails(productId).call();
    setProductDetails({
      ...product,
      lotNumber: product.lotNumber.toString(),
      totalPerLot: product.totalPerLot.toString()
    });
    
  };

  const handleTransferOwnership = async (event) => {
    event.preventDefault();
    try {
      // Make sure to convert the productIdToTransfer to a number if it's taken as a string from the input
      const productId = Number(productIdToTransfer);
      await contract.methods.transferProductOwnership(productId, newOwnerAddress)
        .send({ from: accounts[0] });
      console.log(`Ownership of product ${productId} transferred to ${newOwnerAddress}`);
      // Handle the UI updates or notifications here
    } catch (error) {
      console.error("Error transferring product ownership:", error);
    }
  };
  


  const handleAssignManufacturerRole = async () => {
    try {
      const manufacturerRole = 2; // Role ID for Manufacturer
      await contract.methods.assignRole(accounts[0], manufacturerRole).send({ from: accounts[0] });
      console.log('Manufacturer role assigned to account:', accounts[0]);
    } catch (error) {
      console.error("Error assigning manufacturer role:", error);
    }
  };
  
  // Call this before trying to create a product
  handleAssignManufacturerRole();

  const createProduct = async (name, lotNumber, totalPerLot, manufacturer) => {
    try {
      // Estimate gas limit for the transaction
  
      // Add a buffer to the estimated gas limit to ensure the transaction doesn't run out of gas
      // Adding a buffer of 100,000
  
      const response = await contract.methods.createProduct(name, lotNumber, totalPerLot, manufacturer)
        .send({ from: accounts[0], gas: 6721970 });
      
      console.log('Transaction successful:', response);
      await loadProducts();
    } catch (error) {
      console.error("Error happened while trying to execute a function inside a smart contract", error);
    }
  };


  const handleCreateProduct = async (event) => {
    event.preventDefault();
    if (!web3.utils.isAddress(manufacturer)) {
      console.error("Invalid address");
      return;
    }

    try {
      const lotNumberInt = BigInt(lotNumber);
      const totalPerLotInt = BigInt(totalPerLot);

      // Estimate the gas and add buffer using BigInt
      const estimatedGas = BigInt(await contract.methods.createProduct(productName, lotNumberInt, totalPerLotInt, manufacturer)
        .estimateGas({ from: accounts[0] }));

      const buffer = BigInt(100000);  // Gas buffer
      const totalGas = estimatedGas + buffer;

      // Sending the transaction with totalGas
      const response = await contract.methods.createProduct(productName, lotNumberInt, totalPerLotInt, manufacturer)
        .send({ from: accounts[0], gas: totalGas.toString() });  // Converting BigInt to string for web3

      console.log('Transaction successful:', response);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  
  
  
  const handleViewProduct = async (event) => {
    event.preventDefault();
    try {
      const product = await contract.methods.getProductDetails(viewProductId).call();
      setProductDetails({
        ...product,
        lotNumber: product.lotNumber.toString(),
        totalPerLot: product.totalPerLot.toString()
      });
      // Display product details here.
    } catch (error) {
      console.error("Error viewing product details:", error);
      // Display an error message to the user here.
      setProductDetails(null);
    }
  };


  const handleWhitelistAddress = async (event) => {
    event.preventDefault();
    try {
      const response = await contract.methods.addAddressToWhitelist(whitelistAddress)
        .send({ from: accounts[0] });
      console.log('Address whitelisted:', response);
      // Optionally, refresh the state or display a success message.
    } catch (error) {
      console.error("Error whitelisting address:", error);
      // Optionally, display an error message to the user.
    }
  };

  const handleRemoveFromWhitelist = async (event) => {
    event.preventDefault();
    try {
      const response = await contract.methods.removeAddressFromWhitelist(whitelistAddressToRemove)
        .send({ from: accounts[0] });
      console.log('Address removed from whitelist:', response);
      // Refresh state or display success message
    } catch (error) {
      console.error("Error removing address from whitelist:", error);
    }
  };
  
  const checkIfAddressIsWhitelisted = async (event) => {
    event.preventDefault();
    try {
      const isWhitelisted = await contract.methods.isWhitelisted(whitelistCheckAddress).call();
      setIsAddressWhitelisted(isWhitelisted);
    } catch (error) {
      console.error("Error checking if address is whitelisted:", error);
    }
  };
  

  
  const handleAssignRole = async (event) => {
    event.preventDefault();
    try {
      const roleId = parseInt(selectedRole); // Convert to integer as roles are uint256 in the contract
      const response = await contract.methods.assignRole(roleAddress, roleId)
        .send({ from: accounts[0] });
      console.log('Role assigned:', response);
      // Optionally, refresh the state or display a success message.
    } catch (error) {
      console.error("Error assigning role:", error);
      // Optionally, display an error message to the user.
    }
  };
  
  const handleRevokeRole = async (event) => {
    event.preventDefault();
    try {
      const response = await contract.methods.revokeRole(revokeRoleAddress)
        .send({ from: accounts[0] });
      console.log('Role revoked:', response);
      // Optionally, refresh the state or display a success message.
    } catch (error) {
      console.error("Error revoking role:", error);
      // Optionally, display an error message to the user.
    }
  };
  


  return (
    <div className="App">
    <header className="App-header">
      <h1>Smart Contract Interaction</h1>
      <p>Connect your wallet to interact with the contract.</p>
    </header>
    
    <div className="form-section">
      <h2>Create Product</h2>
      <form onSubmit={handleCreateProduct} className="form">
        <div className="form-group">
          <label htmlFor="productName">Name:</label>
          <input id="productName" type="text" placeholder="Product Name" onChange={e => setProductName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="lotNumber">Lot Number:</label>
          <input id="lotNumber" type="number" placeholder="Lot Number" onChange={e => setLotNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="totalPerLot">Total per Lot:</label>
          <input id="totalPerLot" type="number" placeholder="Total per Lot" onChange={e => setTotalPerLot(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="manufacturerAddress">Manufacturer Address:</label>
          <input id="manufacturerAddress" type="text" placeholder="Manufacturer Address" onChange={e => setManufacturer(e.target.value)} required />
        </div>
        <div className="button-group">
          <button type="submit">Create Product</button>
        </div>
      </form>
    </div>
    
    <div className="form-section">
      <h2>View Product Details</h2>
      <form onSubmit={handleViewProduct} className="form">
        <div className="form-group">
          <label htmlFor="viewProductId">Product ID:</label>
          <input id="viewProductId" type="number" placeholder="Product ID" onChange={e => setViewProductId(e.target.value)} required />
        </div>
        <div className="button-group">
          <button type="submit">View Product</button>
        </div>
      </form>
      {productDetails && (
        <div className="product-details">
          <p>Product ID: {productDetails.id}</p>
          <p>Name: {productDetails.name}</p>
          <p>Lot Number: {productDetails.lotNumber}</p>
          <p>Total per Lot: {productDetails.totalPerLot}</p>
          <p>Manufacturer: {productDetails.manufacturer}</p>
        </div>
      )}
    </div>

    <div className="form-section">
      <h2>Transfer Product Ownership</h2>
      <form onSubmit={handleTransferOwnership} className="form">
        <div className="form-group">
          <label htmlFor="productIdToTransfer">Product ID:</label>
          <input
            id="productIdToTransfer"
            type="number"
            placeholder="Enter Product ID"
            value={productIdToTransfer}
            onChange={e => setProductIdToTransfer(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newOwnerAddress">New Owner Address:</label>
          <input
            id="newOwnerAddress"
            type="text"
            placeholder="Enter New Owner Address"
            value={newOwnerAddress}
            onChange={e => setNewOwnerAddress(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Transfer Ownership</button>
        </div>
      </form>
    </div>


    {/* Whitelist Management Section */}
      <div className="form-section">
        <h2>Whitelist Management</h2>
        <form onSubmit={handleWhitelistAddress} className="form">
          <div className="form-group">
            <label htmlFor="whitelistAddress">Address to Whitelist:</label>
            <input id="whitelistAddress" type="text" placeholder="Enter address" value={whitelistAddress} onChange={e => setWhitelistAddress(e.target.value)} required />
          </div>
          <div className="button-group">
            <button type="submit">Whitelist Address</button>
          </div>
        </form>

        <form onSubmit={handleRemoveFromWhitelist} className="form">
          <div className="form-group">
            <label htmlFor="whitelistAddressToRemove">Address to Remove:</label>
            <input id="whitelistAddressToRemove" type="text" placeholder="Enter address" value={whitelistAddressToRemove} onChange={e => setWhitelistAddressToRemove(e.target.value)} required />
          </div>
          <div className="button-group">
            <button type="submit">Remove from Whitelist</button>
          </div>
        </form>

        <form onSubmit={checkIfAddressIsWhitelisted} className="form">
          <div className="form-group">
            <label htmlFor="whitelistCheckAddress">Address to Check:</label>
            <input id="whitelistCheckAddress" type="text" placeholder="Enter address" value={whitelistCheckAddress} onChange={e => setWhitelistCheckAddress(e.target.value)} required />
          </div>
          <div className="button-group">
            <button type="submit">Check if Whitelisted</button>
          </div>
        </form>
        {isAddressWhitelisted !== null && (
          <div className="whitelist-status">
            <p>{whitelistCheckAddress} is {isAddressWhitelisted ? 'currently whitelisted' : 'not whitelisted'}.</p>
          </div>
        )}
      </div>

      {/* User Accreditation Section */}
      <div className="form-section">
        <h2>Handle Users Accreditation</h2>
        <form onSubmit={handleAssignRole} className="form">
          <div className="form-group">
            <label htmlFor="roleAddress">Address to Assign Role:</label>
            <input id="roleAddress" type="text" placeholder="Enter address" value={roleAddress} onChange={e => setRoleAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="selectedRole">Select Role:</label>
            <select id="selectedRole" value={selectedRole} onChange={e => setSelectedRole(e.target.value)} required>
              <option value="0">None</option>
              <option value="1">Admin</option>
              <option value="2">Manufacturer</option>
              <option value="3">Distributor</option>
              <option value="4">Retailer</option>
              <option value="5">Consumer</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit">Assign Role</button>
          </div>
        </form>

        <form onSubmit={handleRevokeRole} className="form">
          <div className="form-group">
            <label htmlFor="revokeRoleAddress">Address to Revoke Role:</label>
            <input id="revokeRoleAddress" type="text" placeholder="Enter address" value={revokeRoleAddress} onChange={e => setRevokeRoleAddress(e.target.value)} required />
          </div>
          <div className="button-group">
            <button type="submit">Revoke Role</button>
          </div>
        </form>
      </div>
    </div>
  );
  
}

export default App;
