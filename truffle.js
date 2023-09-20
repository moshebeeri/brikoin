var HDWalletProvider = require("truffle-hdwallet-provider");

var rpc_endpoint = "http://brik3q-dns-reg1.eastus.cloudapp.azure.com:8545";
var mnemonic =
  "liar tragic valid cable ready thrive symbol bag mansion suggest envelope kiss";

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8500,
      network_id: "*", // Match any network id
      gas: 9007199254740991,
      gasPrice: 1
    }
    // poa: {
    //   provider: new HDWalletProvider(mnemonic, rpc_endpoint),
    //   network_id: 3,
    //   gasPrice: 0
    // }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
