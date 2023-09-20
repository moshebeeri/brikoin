const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://ethmvmtct-dns-reg1-0.eastus.cloudapp.azure.com:8547"
    }
  },
  contracts: [],
  events: {},
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions;
