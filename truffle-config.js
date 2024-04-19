module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Make sure this matches the Ganache port
      network_id: "*", // Match any network ID
      gas: 6721975, // Increase the gas limit to the maximum allowed on Ganache
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", 
      settings: {
        optimizer: {
          enabled: true, // Enable the optimizer for more efficient bytecode
          runs: 200
        },
        evmVersion: "istanbul"
      }
    }
  }
};
