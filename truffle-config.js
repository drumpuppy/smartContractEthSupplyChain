const HDWalletProvider = require('@truffle/hdwallet-provider');


module.exports = {
  networks: {
    // Add a development network
    development: {
      host: "127.0.0.1", // Localhost
      port: 7545,        // Standard Ganache UI port
      network_id: "*",   // Any network (default: none)
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0" // Fetch exact version from solc-bin
    }
  }
};