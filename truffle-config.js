module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      gas: 9007199254740991,
      gasPrice: 1,
      host: "localhost",
      port: 8500,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  }
};
