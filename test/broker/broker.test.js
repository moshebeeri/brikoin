const CornerStone = artifacts.require("./CornerStone.sol");
const BrokerManager = artifacts.require(".structures/BrokerManager.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const CornerStoneBase = artifacts.require("./CornerStoneBase.sol");
const MortgageStone = artifacts.require("./MortgageStone.sol");
const MortgageOperations = artifacts.require("./MortgageOperations.sol");
const CornerTransaction = artifacts.require("./CornerTransaction.sol");
const FeeManager = artifacts.require("./structures/FeeManager.sol");
const Disposition = artifacts.require("./structures/Disposition.sol");
const TradesHistory = artifacts.require("./structures/TradesHistory.sol");
const MortgageStoneStorage = artifacts.require(
  "./storage/MortgageStoneStorage.sol"
);
const CornerStoneBaseStorage = artifacts.require(
  "./storage/CornerStoneBaseStorage.sol"
);
const StoneCoinStorage = artifacts.require("./storage/StoneCoinStorage.sol");
const StoneCoinMortgageStorage = artifacts.require(
  "./storage/StoneCoinMortgageStorage.sol"
);
const StoneCoinMortgage = artifacts.require("./StoneCoinMortgage.sol");
const StoneCoin = artifacts.require("./StoneCoin.sol");

let TestUtils = require("../testUtils");

// see https:ethereum.stackexchange.com/questions/17402/unlock-contract-deploy-address-in-truffle-testing-using-testrpc?rq=1
contract("Broker", function(accounts) {
  let cornerStone;
  let brokerManager;
  let owner;
  let testStoneCoinAddress;
  let cornerStoneBase;
  let cornerBaseAddress;
  const user0 = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const user4 = accounts[4];
  const user5 = accounts[5];
  let ownerBalance;
  before(async () => {
    // INIT ALL CONTRACTS
    cornerStone = await CornerStone.new({ from: user0 });
    let cornerStoneAddress = await cornerStone.getAddress();
    let disposition = await Disposition.new({ from: user0 });
    await disposition.addOwnership(cornerStoneAddress, { from: user0 });
    let dispositionAddress = await disposition.getAddress();
    await cornerStone.setDispositionAddress(dispositionAddress, {
      from: user0
    });
    owner = await cornerStone.owner();
    let cornerStoneBaseStorage = await CornerStoneBaseStorage.new({
      from: user0
    });
    cornerStoneBase = await CornerStoneBase.new({ from: user0 });
    let cornerStoneBaseStorageAddress = await cornerStoneBaseStorage.getAddress();
    await cornerStoneBase.setCornerStoneBaseStorage(
      cornerStoneBaseStorageAddress,
      { from: user0 }
    );
    cornerBaseAddress = await cornerStoneBase.getAddress();
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
    brokerManager = await BrokerManager.new({ from: user0 });
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
    ownerBalance = await cornerStone.getOwnerBalance();
  });

  it("should deposit funds", async () => {
    await cornerStone.deposit(user1, 200000 * 1000000);
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      200000 * 1000000,
      `The balance 20000 was not reflected.`
    );

    await cornerStone.deposit(user2, 200000 * 1000000);
    balance = await cornerStone.balanceOf(user2);
    assert.equal(
      balance.valueOf(),
      200000 * 1000000,
      `The balance 20000 was not reflected.`
    );
    await cornerStone.addBroker(user3);
    await cornerStone.addBroker(user4);
    await cornerStone.deposit(user5, 200000 * 1000000);
  });

  it("should create StoneCoin contract", async () => {
    let stoneCoinMortgage = await StoneCoinMortgage.new({ from: user0 });
    let stoneCoinMortgageStorage = await StoneCoinMortgageStorage.new({
      from: user0
    });
    let stoneCoinMortgageStorageAddress = await stoneCoinMortgageStorage.getAddress();
    await stoneCoinMortgage.setStoneCoinMortgageStorage(
      stoneCoinMortgageStorageAddress,
      { from: user0 }
    );
    let stoneCoinMortgageAddress = await stoneCoinMortgage.getAddress();
    stoneCoinMortgageStorage.addOwnership(stoneCoinMortgageAddress, {
      from: user0
    });

    let stoneCoinContract = await StoneCoin.new(
      "TestCoin",
      "TECO",
      40000,
      Date.now() / 1000,
      10000,
      AssetManager.address,
      "url",
      "urlmd5",
      false,
      1,
      { from: user0 }
    );
    testStoneCoinAddress = await stoneCoinContract.getAddress();
    let stoneCoinStorage = await StoneCoinStorage.new({ from: user0 });
    let stoneCoinStorageAddress = await stoneCoinStorage.getAddress();
    await stoneCoinContract.setStoneCoinStorageAddress(stoneCoinStorageAddress);
    await stoneCoinContract.addOwnership(cornerBaseAddress, { from: user0 });
    await stoneCoinStorage.addOwnership(testStoneCoinAddress, { from: user0 });
    await stoneCoinMortgage.addOwnership(testStoneCoinAddress, { from: user0 });
    await stoneCoinContract.setStoneCoinMortgageAddress(
      stoneCoinMortgageAddress,
      { from: user0 }
    );
    await stoneCoinContract.init();
    let result = await cornerStone.initialAsk(testStoneCoinAddress, 40000, {
      from: owner
    });
    assert.equal(
      TestUtils.validateReceipt(result, "InitialAskCreated", { amount: 40000 }),
      true,
      "StoneCoin failed to create"
    );
  });

  it("user 1 trade", async () => {
    // bid
    await cornerStone.addUserToBroker(user1, user3, 0);
    let balanceBefore = await cornerStone.balanceOf(user3);
    console.log("balanceBefore " + balanceBefore);
    await cornerStone.bid(testStoneCoinAddress, 10000, 1000000, 0, {
      from: user1
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user1,
      owner,
      10000,
      1000000,
      0,
      { from: owner }
    );
    let balance = await cornerStone.balanceOf(user3);
    console.log("balanceAfter " + balance);
    let brokerContractFee = await brokerManager.getBrokerHistoryFee(
      user3,
      user1,
      0,
      0
    );
    console.log("brokerContractFee " + brokerContractFee);
    let brokerFee = 10000 * 1000000 * (2 / 100);
    assert.equal(parseInt(brokerContractFee), brokerFee);
  });

  it("user 2 trade", async () => {
    await cornerStone.addUserToBroker(user2, user3, 0);
    let balanceBefore = await cornerStone.balanceOf(user3);
    console.log("balanceBefore " + balanceBefore);
    await cornerStone.bid(testStoneCoinAddress, 30000, 1000000, 0, {
      from: user2
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user2,
      owner,
      30000,
      1000000,
      0,
      { from: owner }
    );
    let balance = await cornerStone.balanceOf(user3);
    let brokerContractFee = await brokerManager.getBrokerHistoryFee(
      user3,
      user2,
      0,
      0
    );
    console.log("balanceAfter " + balance);
    let brokerFee = 30000 * 1000000 * (2 / 100);
    assert.equal(parseInt(brokerContractFee), brokerFee);
  });

  it("should not a assign user to Broker", async () => {
    try {
      await cornerStone.addUserToBroker(user2, user4, 0);
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("should create StoneCoin contract2", async () => {
    let stoneCoinMortgage = await StoneCoinMortgage.new({ from: user0 });
    let stoneCoinMortgageStorage = await StoneCoinMortgageStorage.new({
      from: user0
    });
    let stoneCoinMortgageStorageAddress = await stoneCoinMortgageStorage.getAddress();
    await stoneCoinMortgage.setStoneCoinMortgageStorage(
      stoneCoinMortgageStorageAddress,
      { from: user0 }
    );
    let stoneCoinMortgageAddress = await stoneCoinMortgage.getAddress();
    stoneCoinMortgageStorage.addOwnership(stoneCoinMortgageAddress, {
      from: user0
    });

    let stoneCoinContract = await StoneCoin.new(
      "TestCoin",
      "TECO2",
      40000,
      Date.now() / 1000,
      10000,
      AssetManager.address,
      "url",
      "urlmd5",
      false,
      1,
      { from: user0 }
    );
    testStoneCoinAddress = await stoneCoinContract.getAddress();
    let stoneCoinStorage = await StoneCoinStorage.new({ from: user0 });
    let stoneCoinStorageAddress = await stoneCoinStorage.getAddress();
    await stoneCoinContract.setStoneCoinStorageAddress(stoneCoinStorageAddress);
    await stoneCoinContract.addOwnership(cornerBaseAddress, { from: user0 });
    await stoneCoinStorage.addOwnership(testStoneCoinAddress, { from: user0 });
    await stoneCoinMortgage.addOwnership(testStoneCoinAddress, { from: user0 });
    await stoneCoinContract.setStoneCoinMortgageAddress(
      stoneCoinMortgageAddress,
      { from: user0 }
    );
    await stoneCoinContract.init();
    let result = await cornerStone.initialAsk(testStoneCoinAddress, 40000, {
      from: owner
    });
    assert.equal(
      TestUtils.validateReceipt(result, "InitialAskCreated", { amount: 40000 }),
      true,
      "StoneCoin failed to create"
    );
  });

  it("user 1 trade initial project 2", async () => {
    let balanceBefore = await cornerStone.balanceOf(user3);
    console.log("balanceBefore " + balanceBefore);
    await cornerStone.bid(testStoneCoinAddress, 10000, 1000000, 0, {
      from: user1
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user1,
      owner,
      10000,
      1000000,
      0,
      { from: owner }
    );
    let balance = await cornerStone.balanceOf(user3);
    let brokerContractFee = await brokerManager.getBrokerHistoryFee(
      user3,
      user1,
      1,
      0
    );
    console.log("balanceAfter " + balance);
    let brokerFee = (10000 * 1000000) / 100;
    assert.equal(parseInt(brokerContractFee), brokerFee);
  });

  it("user 2 trade initial project 2", async () => {
    let balanceBefore = await cornerStone.balanceOf(user3);
    console.log("balanceBefore " + balanceBefore);
    await cornerStone.bid(testStoneCoinAddress, 30000, 1000000, 0, {
      from: user2
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user2,
      owner,
      30000,
      1000000,
      0,
      { from: owner }
    );
    let balance = await cornerStone.balanceOf(user3);
    let brokerContractFee = await brokerManager.getBrokerHistoryFee(
      user3,
      user2,
      1,
      0
    );

    console.log("balanceAfter " + balance);
    let brokerFee = (30000 * 1000000) / 100;
    assert.equal(parseInt(brokerContractFee), brokerFee);
  });

  it("user 2 trade with user 1 ", async () => {
    let balanceBefore = await cornerStone.balanceOf(user3);
    console.log("balanceBefore " + balanceBefore);
    await cornerStone.ask(testStoneCoinAddress, 10000, 1100000, 0, {
      from: user1
    });
    await cornerStone.bid(testStoneCoinAddress, 10000, 1100000, 0, {
      from: user2
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user2,
      user1,
      10000,
      1100000,
      0,
      { from: owner }
    );
    let historyIndex = await brokerManager.getBrokerHistoryLength(
      user3,
      user2,
      0
    );

    assert.equal(parseInt(historyIndex), parseInt(2));
  });

  it("should create StoneCoin contract2", async () => {
    let stoneCoinMortgage = await StoneCoinMortgage.new({ from: user0 });
    let stoneCoinMortgageStorage = await StoneCoinMortgageStorage.new({
      from: user0
    });
    let stoneCoinMortgageStorageAddress = await stoneCoinMortgageStorage.getAddress();
    await stoneCoinMortgage.setStoneCoinMortgageStorage(
      stoneCoinMortgageStorageAddress,
      { from: user0 }
    );
    let stoneCoinMortgageAddress = await stoneCoinMortgage.getAddress();
    stoneCoinMortgageStorage.addOwnership(stoneCoinMortgageAddress, {
      from: user0
    });

    let stoneCoinContract = await StoneCoin.new(
      "TestCoin",
      "TECO3",
      40000,
      Date.now() / 1000,
      10000,
      AssetManager.address,
      "url",
      "urlmd5",
      false,
      1,
      { from: user0 }
    );
    testStoneCoinAddress = await stoneCoinContract.getAddress();
    let stoneCoinStorage = await StoneCoinStorage.new({ from: user0 });
    let stoneCoinStorageAddress = await stoneCoinStorage.getAddress();
    await stoneCoinContract.setStoneCoinStorageAddress(stoneCoinStorageAddress);
    await stoneCoinContract.addOwnership(cornerBaseAddress, { from: user0 });
    await stoneCoinStorage.addOwnership(testStoneCoinAddress, { from: user0 });
    await stoneCoinMortgage.addOwnership(testStoneCoinAddress, { from: user0 });
    await stoneCoinContract.setStoneCoinMortgageAddress(
      stoneCoinMortgageAddress,
      { from: user0 }
    );
    await stoneCoinContract.init();
    let result = await cornerStone.initialAsk(testStoneCoinAddress, 40000, {
      from: owner
    });
    assert.equal(
      TestUtils.validateReceipt(result, "InitialAskCreated", { amount: 40000 }),
      true,
      "StoneCoin failed to create"
    );
  });

  it("user 1 trade initial project 3 change fee ratio", async () => {
    let balanceBefore = await cornerStone.balanceOf(user3);
    await cornerStone.setBrokerFees(user3, 30, 20, 0, 0);
    console.log("balanceBefore " + balanceBefore);
    await cornerStone.bid(testStoneCoinAddress, 10000, 1000000, 0, {
      from: user1
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user1,
      owner,
      10000,
      1000000,
      0,
      { from: owner }
    );
    let balance = await cornerStone.balanceOf(user3);
    console.log("balanceAfter " + balance);
    let brokerContractFee = await brokerManager.getBrokerHistoryFee(
      user3,
      user1,
      2,
      0
    );

    let brokerFee = (10000 * 1000000 * 20) / 1000;
    assert.equal(parseInt(brokerContractFee), brokerFee);
  });

  it("user 5 trade initial project 3 change fee ratio", async () => {
    let balanceBefore = await cornerStone.balanceOf(user3);
    await cornerStone.addUserToBroker(user5, user3, 0);
    console.log("balanceBefore " + balanceBefore);
    await cornerStone.bid(testStoneCoinAddress, 10000, 1000000, 0, {
      from: user5
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user5,
      owner,
      10000,
      1000000,
      0,
      { from: owner }
    );
    let balance = await cornerStone.balanceOf(user3);
    let brokerContractFee = await brokerManager.getBrokerHistoryFee(
      user3,
      user5,
      0,
      0
    );

    console.log("balanceAfter " + balance);
    let brokerFee = (10000 * 1000000 * 30) / 1000;
    assert.equal(parseInt(brokerContractFee), brokerFee);
  });

  it("pay broker", async () => {
    let balanceBefore = await cornerStone.balanceOf(user3);
    console.log("balanceBefore " + balanceBefore);
    let payment = (10000 * 1000000 * 30) / 1000;
    await cornerStone.payBroker(user3, payment, 0, testStoneCoinAddress, {
      from: owner
    });
    let payments = await brokerManager.getBrokerPayments(
      user3,
      0,
      testStoneCoinAddress
    );
    assert.equal(parseInt(payments), payment);
  });
});
