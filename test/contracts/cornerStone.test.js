const CornerStone = artifacts.require("./CornerStone.sol");
const FeeManager = artifacts.require("./structures/FeeManager.sol");
const CornerStoneBase = artifacts.require("./CornerStoneBase.sol");
const MortgageStone = artifacts.require("./MortgageStone.sol");
const MortgageOperations = artifacts.require("./MortgageOperations.sol");
const CornerTransaction = artifacts.require("./CornerTransaction.sol");
const BrokerManager = artifacts.require("./structures/BrokerManager.sol");
const TradesHistory = artifacts.require("./structures/TradesHistory.sol");
const MortgageStoneStorage = artifacts.require(
  "./storage/MortgageStoneStorage.sol"
);
const CornerStoneBaseStorage = artifacts.require(
  "./storage/CornerStoneBaseStorage.sol"
);

// var Estimation = artifacts.require("../structures/Estimation.sol");
// var Manager = artifacts.require("../structures/ManagerFactory.sol");
// var Trustee = artifacts.require("../structures/TrusteeFactory.sol");
// var Registrar = artifacts.require("../structures/RegistrarFactory.sol");

// see https://ethereum.stackexchange.com/questions/17402/unlock-contract-deploy-address-in-truffle-testing-using-testrpc?rq=1
contract("CornerStone", function(accounts) {
  let cornerStone;
  let owner;

  // var cornerCoin;
  // var estimation;
  // var sendAmt = 10;
  // var cornerCoinOwner = accounts[0];
  // var estimatorOwner = accounts[1];
  // var managerOwner  = accounts[2];
  // var trusteeOwner  = accounts[3];
  const user0 = accounts[0];
  const user1 = accounts[4];
  const user2 = accounts[5];
  //
  // var cornerCoin = await CornerStone.deployed();
  // var estimation = await Estimation.deployed();
  // var manager = await Manager.deployed();
  // var trustee = await Trustee.deployed();
  // var registrar = await Registrar.deployed();

  before(async () => {
    cornerStone = await CornerStone.new({ from: user0 });
    let cornerStoneAddress = await cornerStone.getAddress();
    owner = await cornerStone.owner();
    let cornerStoneBaseStorage = await CornerStoneBaseStorage.new({
      from: user0
    });
    let cornerStoneBase = await CornerStoneBase.new({ from: user0 });
    let cornerStoneBaseStorageAddress = await cornerStoneBaseStorage.getAddress();
    await cornerStoneBase.setCornerStoneBaseStorage(
      cornerStoneBaseStorageAddress,
      { from: user0 }
    );
    let cornerBaseAddress = await cornerStoneBase.getAddress();
    await cornerStoneBaseStorage.addOwnership(cornerBaseAddress, {
      from: user0
    });
    await cornerStoneBase.init({ from: user0 });
    let mortgageStone = await MortgageStone.new({ from: user0 });
    let mortgageStoneStorage = await MortgageStoneStorage.new({ from: user0 });
    let mortgageStoneStorageAddress = await mortgageStoneStorage.getAddress();
    let mortgageStoneAddress = await mortgageStone.getAddress();
    await mortgageStoneStorage.addOwnership(mortgageStoneAddress, {
      from: user0
    });
    await mortgageStoneStorage.addOwnership(cornerStoneAddress, {
      from: user0
    });
    await mortgageStone.setStorageAddress(mortgageStoneStorageAddress, {
      from: user0
    });

    let mortgageOperation = await MortgageOperations.new({ from: user0 });
    await mortgageOperation.addOwnership(mortgageStoneAddress, { from: user0 });
    await cornerStoneBase.addOwnership(mortgageStoneAddress, { from: user0 });
    await cornerStoneBase.addOwnership(cornerStoneAddress, { from: user0 });
    let mortgageOperationAddress = await mortgageOperation.getAddress();
    await mortgageStone.setStoneBaseAddress(cornerBaseAddress);
    await mortgageStone.addOwnership(cornerStoneAddress, { from: user0 });
    await mortgageStone.setMortgageOperationAddress(mortgageOperationAddress);
    await cornerStone.setBaseStoneAddress(cornerBaseAddress);
    await cornerStone.setMortgageStoneAddress(mortgageStoneAddress);

    console.log("setting borker");
    let brokerManager = await BrokerManager.new({ from: user0 });
    brokerManager.addOwnership(cornerBaseAddress, { from: user0 });
    let brokerManagerAddress = await brokerManager.getAddress();
    await cornerStoneBase.setNewBrokerManager(brokerManagerAddress, {
      from: user0
    });

    console.log("setting fee");
    let feeManager = await FeeManager.new({ from: user0 });
    feeManager.addOwnership(cornerBaseAddress, { from: user0 });
    let feeManagerAddress = await feeManager.getAddress();
    await cornerStoneBase.setNewFeeManager(feeManagerAddress, { from: user0 });

    console.log("setting tradeHistory");
    let tradeHistory = await TradesHistory.new({ from: user0 });
    tradeHistory.addOwnership(cornerBaseAddress, { from: user0 });
    let tradeHistoryAddress = await tradeHistory.getAddress();
    await cornerStoneBase.setNewTraderHistory(tradeHistoryAddress, {
      from: user0
    });

    console.log("setting cornerTransaction");
    let cornerTransaction = await CornerTransaction.new({ from: user0 });
    cornerTransaction.addOwnership(cornerBaseAddress, { from: user0 });
    let cornerTransactionAddress = await cornerTransaction.getAddress();
    await cornerStoneBase.setNewCornerTransaction(cornerTransactionAddress, {
      from: user0
    });
    console.log("finish init");
  });

  it("should have initial supply of 2^64-1", async () => {
    let initialSupply = await cornerStone.getInitialSupply();
    assert.equal(
      initialSupply.valueOf(),
      18446744073709551615,
      `initialSupply should equal to 2^64-1`
    );
  });

  it("CornerStone owner should have all initial supply", async () => {
    let balance = await cornerStone.getOwnerBalance();
    assert.equal(
      balance.valueOf(),
      18446744073709551615,
      `CornerStone owner should have 2^64-1 balance`
    );
  });

  it("should deposit and reflect on user balance", async () => {
    await cornerStone.deposit(user1, 20000, { from: user0 });
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      20000,
      `The balance 20000 was not reflected.`
    );
    let ownerStartBalance = await cornerStone.getOwnerBalance();
    assert.equal(
      ownerStartBalance.valueOf(),
      18446744073709551615 - 20000,
      `owner balance should be 20000 less them max`
    );
  });

  it("should deposit and reflect on user balance Sync", async () => {
    await cornerStone.deposit(user1, 20000, { from: user0 });
    let user1balance = await cornerStone.balanceOf(user1);
    assert.equal(
      user1balance.valueOf(),
      40000,
      "The balance 20000 was not reflected."
    );
  });

  it("should withdraw and reflect on user and owner balances", async () => {
    let ownerStartBalance = await cornerStone.getOwnerBalance();
    assert.equal(
      ownerStartBalance.valueOf(),
      18446744073709551615 - 40000,
      `owner balance should be 20000 less them max`
    );
    await cornerStone.withdraw(user1, 20000, { from: user0 });
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      20000,
      `withdraw should reduce user balance to 20000.`
    );
    await cornerStone.withdrawApprove(user1, 20000, 0, { from: user0 });
    balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      20000,
      `withdraw should of leave user balance on 20000.`
    );
    balance = await cornerStone.getOwnerBalance();
    assert.equal(
      balance.valueOf(),
      parseInt(ownerStartBalance) + 20000,
      `owner balance should increase by 20000`
    );
  });
});
