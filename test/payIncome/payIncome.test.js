const CornerStone = artifacts.require("./CornerStone.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const StoneCoin = artifacts.require("./StoneCoin.sol");
const StoneCoinMortgage = artifacts.require("./StoneCoinMortgage.sol");
const FeeManager = artifacts.require("./structures/FeeManager.sol");
const CornerStoneBase = artifacts.require("./CornerStoneBase.sol");
const MortgageStone = artifacts.require("./MortgageStone.sol");
const MortgageOperations = artifacts.require("./MortgageOperations.sol");
const CornerTransaction = artifacts.require("./CornerTransaction.sol");
const BrokerManager = artifacts.require("./structures/BrokerManager.sol");
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
const Disposition = artifacts.require("./structures/Disposition.sol");

const TradesHistory = artifacts.require("./structures/TradesHistory.sol");
let TestUtils = require("../testUtils");

// see https://ethereum.stackexchange.com/questions/17402/unlock-contract-deploy-address-in-truffle-testing-using-testrpc?rq=1
contract("Pay income", function(accounts) {
  let cornerStone;
  let owner;
  let testStoneCoinAddress;
  let cornerBaseAddress;
  // var cornerCoin;
  // var estimation;
  // var sendAmt = 10;
  // var cornerCoinOwner = accounts[0];
  // var estimatorOwner = accounts[1];
  // var managerOwner  = accounts[2];
  // var trusteeOwner  = accounts[3];
  const user0 = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  //
  // var cornerCoin = await CornerStone.deployed();
  // var estimation = await Estimation.deployed();
  // var manager = await Manager.deployed();
  // var trustee = await Trustee.deployed();
  // var registrar = await Registrar.deployed();

  before(async () => {
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
    let cornerStoneBase = await CornerStoneBase.new({ from: user0 });
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

  it("should deposit funds", async () => {
    await cornerStone.deposit(user1, 20000 * 1000000);
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      20000 * 1000000,
      `The balance 20000 was not reflected.`
    );

    await cornerStone.deposit(user2, 20000 * 1000000);
    balance = await cornerStone.balanceOf(user2);
    assert.equal(
      balance.valueOf(),
      20000 * 1000000,
      `The balance 20000 was not reflected.`
    );
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
      20000,
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
    // testStoneCoinAddress = BigNumber(testStoneCoinAddress)
    // console.log(testStoneCoinAddress)
    // console.log(typeof testStoneCoinAddress)
    let result = await cornerStone.initialAsk(testStoneCoinAddress, 20000, {
      from: user0
    });
    assert.equal(
      TestUtils.validateReceipt(result, "InitialAskCreated", { amount: 20000 }),
      true,
      "StoneCoin failed to create"
    );
  });

  it("get total allocated", async () => {
    let result = await cornerStone.getTotalAllocated(testStoneCoinAddress, {
      from: user0
    });
    assert.equal(result, 20000, "wrong allocation");
  });

  it("should bid", async () => {
    // bid
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(balance, 20000 * 1000000, `Wrong balance`);
    let result = await cornerStone.bid(
      testStoneCoinAddress,
      15000,
      1000000,
      0,
      { from: user1 }
    );
    assert.equal(
      TestUtils.validateReceipt(result, "BidCreated", {
        available: 5000000000
      }),
      true,
      "Bid not created as expected"
    );
    result = await cornerStone.bid(testStoneCoinAddress, 5000, 1000000, 0, {
      from: user2
    });
    assert.equal(
      TestUtils.validateReceipt(result, "BidCreated", {
        available: 15000000000
      }),
      true,
      "Bid not created as expected"
    );
  });

  it("should bid ask trade", async () => {
    let result;
    result = await cornerStone.trade(
      testStoneCoinAddress,
      user1,
      user0,
      15000,
      1000000,
      0,
      { from: user0 }
    );
    assert.equal(
      TestUtils.validateReceipt(result, "Trade", {
        amount: "15000",
        price: "1000000"
      }),
      true,
      "failed to trade"
    );
    result = await cornerStone.trade(
      testStoneCoinAddress,
      user2,
      user0,
      5000,
      1000000,
      0,
      { from: user0 }
    );
    assert.equal(
      TestUtils.validateReceipt(result, "Trade", {
        amount: "5000",
        price: "1000000"
      }),
      true,
      "failed to trade"
    );
  });

  it("pay income", async () => {
    let result = await cornerStone.getTotalAllocated(testStoneCoinAddress, {
      from: user0
    });
    assert.equal(result, 20000, "wrong allocation");
    await cornerStone.payIncome(testStoneCoinAddress, 2000000, { from: user0 });
    let user1Balance = await cornerStone.balanceOf(user1);
    assert.equal(user1Balance, 5000000000 + 1500000, `Wrong balance`);
    let user1Balance2 = await cornerStone.balanceOf(user2);
    assert.equal(user1Balance2, 15000000000 + 500000, `Wrong balance`);
  });
});
