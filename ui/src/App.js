import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

function App() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Connect to Ganache
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    };

    loadBlockchainData();
  }, []);

  useEffect(() => {
    const loadContractData = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const myContract = new web3.eth.Contract(contractABI, 'Your_Contract_Address_Here');
      // You can now call methods from your contract
    };

    loadContractData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ethereum Accounts</h1>
        <ul>
          {accounts.map((account, idx) => (
            <li key={idx}>{account}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
