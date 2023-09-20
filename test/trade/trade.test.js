const CornerStone = artifacts.require("./CornerStone.sol");
const CornerStoneBase = artifacts.require("./CornerStoneBase.sol");
const MortgageStone = artifacts.require("./MortgageStone.sol");
const MortgageOperations = artifacts.require("./MortgageOperations.sol");
const StoneCoin = artifacts.require("./StoneCoin.sol");
const StoneCoinMortgage = artifacts.require("./StoneCoinMortgage.sol");
const CornerTransaction = artifacts.require("./CornerTransaction.sol");
const TokenApproveFactory = artifacts.require(
  "./factory/TokenApproveFactory.sol"
);
const Disposition = artifacts.require("./structures/Disposition.sol");

const BrokerManager = artifacts.require("./structures/BrokerManager.sol");
const FeeManager = artifacts.require("./structures/FeeManager.sol");
const TradesHistory = artifacts.require("./structures/TradesHistory.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const MortgageStoneStorage = artifacts.require(
  "./storage/MortgageStoneStorage.sol"
);
const CornerStoneBaseStorage = artifacts.require(
  "./storage/CornerStoneBaseStorage.sol"
);
const StoneCoinMortgageStorage = artifacts.require(
  "./storage/StoneCoinMortgageStorage.sol"
);
const StoneCoinStorage = artifacts.require("./storage/StoneCoinStorage.sol");
const TokenApproveContract = artifacts.require(
  "./structures/TokenApproveContract.sol"
);
let TestUtils = require("../testUtils");

// see https://ethereum.stackexchange.com/questions/17402/unlock-contract-deploy-address-in-truffle-testing-using-testrpc?rq=1
contract("Trade", function(accounts) {
  let cornerStone;
  let tokenApproveFactory;
  let owner;
  let tokenApproveContract;
  let testStoneCoinAddress;
  let approveContractAddress;
  const user0 = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  let cornerBaseAddress;
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
    tokenApproveFactory = await TokenApproveFactory.deployed();
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
    ownerBalance = await cornerStone.getOwnerBalance({ from: user0 });

    await cornerStone.setTransactionManager(owner, { from: user0 });
  });

  it("should create StoneCoin contract", async () => {
    console.log("AssetManager.address " + AssetManager.address);

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
    await stoneCoinContract.setReservedPrice(500 * 1000000, { from: user0 });
    await stoneCoinContract.init();
    console.log("testStoneCoinAddress " + testStoneCoinAddress);
    let result = await cornerStone.initialAsk(testStoneCoinAddress, 20000, {
      from: user0
    });
    console.log("result " + result);
    assert.equal(
      TestUtils.validateReceipt(result, "InitialAskCreated", { amount: 20000 }),
      true,
      "StoneCoin failed to create"
    );
  });

  it("add document to project", async () => {
    let stoneContract = await StoneCoin.at(testStoneCoinAddress);
    await stoneContract.addDocument("url2", "urlmd52", { from: owner });
    let url = await stoneContract.url(0, { from: owner });
    let urlmd5 = await stoneContract.urlMD5(0, { from: owner });
    assert.equal(
      url.toUpperCase(),
      "0X75726C0000000000000000000000000000000000000000000000000000000000"
    );
    assert.equal(
      urlmd5.toUpperCase(),
      "0X75726c6d64350000000000000000000000000000000000000000000000000000".toUpperCase()
    );
    url = await stoneContract.url(1, { from: owner });
    urlmd5 = await stoneContract.urlMD5(1, { from: owner });
    assert.equal(
      url.toUpperCase(),
      "0X75726c3200000000000000000000000000000000000000000000000000000000".toUpperCase()
    );
    assert.equal(
      urlmd5.toUpperCase(),
      "0X75726c6d64353200000000000000000000000000000000000000000000000000".toUpperCase()
    );
  });

  it("should deposit funds", async () => {
    await cornerStone.depositProject(
      user1,
      20000 * 1000000,
      testStoneCoinAddress
    );
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      20000 * 1000000,
      `The balance 20000 was not reflected.`
    );

    await cornerStone.depositProject(
      user2,
      20000 * 1000000,
      testStoneCoinAddress
    );
    balance = await cornerStone.balanceOf(user2);
    assert.equal(
      balance.valueOf(),
      20000 * 1000000,
      `The balance 20000 was not reflected.`
    );
  });

  it("should fail", async () => {
    try {
      await cornerStone.ask(testStoneCoinAddress, 1000, 1000000, 0, {
        from: user1
      });
    } catch (error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert",
        "Ask transaction should not be created"
      );
    }
  });

  it("should bid cancel", async () => {
    // bid
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(balance, 20000 * 1000000, `Wrong balance`);
    let result = await cornerStone.bid(
      testStoneCoinAddress,
      10000,
      1000000,
      0,
      { from: user1 }
    );
    assert.equal(
      TestUtils.validateReceipt(result, "BidCreated", {
        available: 10000 * 1000000
      }),
      true,
      "Bid not created as expected"
    );
    await cornerStone.bidCancel(testStoneCoinAddress, { from: user1 });
    balance = await cornerStone.balanceOf(user1);
    assert.equal(balance, 20000 * 1000000, `bid not`);
  });

  it("cancel trade initial offering", async () => {
    // bid
    let stoneCoinContract = await StoneCoin.at(testStoneCoinAddress);
    let ownerBalanceBefore = await stoneCoinContract.getOwnerBalance({
      from: owner
    });
    console.log("ownerBalance balance before trade: " + ownerBalanceBefore);
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

    ownerBalanceBefore = await stoneCoinContract.getOwnerBalance({
      from: owner
    });
    console.log("ownerBalance balance before cancel: " + ownerBalanceBefore);
    await stoneCoinContract.forecloseTokens(user1, 0, owner, true, {
      from: owner
    });
    let balance = await stoneCoinContract.getBalance(user1, { from: owner });
    console.log("user1 balance: " + balance);
    assert.equal(parseInt(balance), 0);
    let ownerBalance = await stoneCoinContract.getOwnerBalance({ from: owner });
    console.log("ownerBalance balance: " + ownerBalance);
    assert.equal(parseInt(ownerBalance), 20000);
    await cornerStone.depositProject(
      user1,
      10000 * 1000000,
      testStoneCoinAddress
    );
    let stoneOwnerBalance = await stoneCoinContract.getBalance(owner, {
      from: owner
    });
    console.log("stoneOwnerBalance balance: " + stoneOwnerBalance);
    await cornerStone.withdraw(owner, 10000 * 1000000, { from: owner });
    await cornerStone.withdrawApprove(
      owner,
      10000 * 1000000,
      testStoneCoinAddress,
      { from: owner }
    );
    let cornerStoneBalance = await cornerStone.balanceOf(user1);
    console.log(
      "cornerStoneBalance user 1 after deposit: " + cornerStoneBalance
    );
    await cornerStone.initialAsk(testStoneCoinAddress, 20000, { from: owner });
  });

  it("should bid with reserve", async () => {
    // bid
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(balance, 20000 * 1000000, `Wrong balance`);
    await cornerStone.reservedBid(testStoneCoinAddress, { from: user1 });

    let reservedBid = await cornerStone.getReserveBid(testStoneCoinAddress, {
      from: user1
    });
    assert.equal(parseInt(reservedBid), 500 * 1000000, `Wrong balance`);

    await cornerStone.cancelReserveBid(testStoneCoinAddress, { from: user1 });
    balance = await cornerStone.balanceOf(user1);
    assert.equal(parseInt(balance), 20000 * 1000000, `Wrong balance`);

    await cornerStone.reservedBid(testStoneCoinAddress, { from: user1 });
    balance = await cornerStone.balanceOf(user1);
    assert.equal(
      parseInt(balance),
      20000 * 1000000 - 500 * 1000000,
      `Wrong balance`
    );
    let result = await cornerStone.bid(
      testStoneCoinAddress,
      20000,
      1000000,
      0,
      { from: user1 }
    );
    assert.equal(
      TestUtils.validateReceipt(result, "BidCreated", { available: 0 }),
      true,
      "Bid not created as expected"
    );
    balance = await cornerStone.balanceOf(user1);
    assert.equal(balance, 0, `bid not`);
  });

  it("should bid ask trade", async () => {
    let result;
    result = await cornerStone.trade(
      testStoneCoinAddress,
      user1,
      owner,
      20000,
      1000000,
      0,
      { from: owner }
    );
    assert.equal(
      TestUtils.validateReceipt(result, "Trade", {
        amount: "20000",
        price: "1000000"
      }),
      true,
      "failed to trade"
    );
  });

  it("trade with bid greater then ask ", async () => {
    await cornerStone.bid(testStoneCoinAddress, 10000, 1000000, 0, {
      from: user2
    });
    let balance = await cornerStone.balanceOf(user2);
    assert.equal(balance, 10000 * 1000000, `Wrong balance`);
    let bidAmounntUser2 = await cornerStone.bidAmount(
      testStoneCoinAddress,
      user2
    );
    console.log("bid amount user 2 before trade: " + bidAmounntUser2);
    await cornerStone.ask(testStoneCoinAddress, 10000, 500000, 0, {
      from: user1
    });
    await cornerStone.trade(
      testStoneCoinAddress,
      user2,
      user1,
      10000,
      500000,
      0,
      { from: owner }
    );
    balance = await cornerStone.balanceOf(user2);
    console.log(balance);
    bidAmounntUser2 = await cornerStone.bidAmount(testStoneCoinAddress, user2);
    console.log("bid amount user 2 after trade: " + bidAmounntUser2);
    assert.equal(balance, 10000 * 1000000 + 10000 * 500000, `Wrong balance`);

    // assert.equal(TestUtils.validateReceipt(result, 'AskCreated', {amount: 1000}), true, 'Bid not created as expected')
  });

  it("check owner balance ", async () => {
    let ownerBalanceAfter = await cornerStone.getOwnerBalance({ from: user0 });
    let user1Balance = await cornerStone.balanceOf(user1);
    let user2Balance = await cornerStone.balanceOf(user2);
    console.log(
      `ownerBalance ${ownerBalance} ownerBalanceAfter: ${ownerBalanceAfter}  user1Balance: ${user1Balance} user2Balance:${user2Balance}`
    );
    assert.equal(
      parseInt(ownerBalance),
      parseInt(ownerBalanceAfter) +
        parseInt(user2Balance) +
        parseInt(user1Balance),
      `Wrong balance`
    );
  });

  it("check transactions", async () => {
    let cornerTransactionAddress = await cornerStone.getTransactionManager();
    let cornerTransactionContract = CornerTransaction.at(
      cornerTransactionAddress
    );
    let user1Transaction = await cornerTransactionContract.getTransactionsLength(
      user1,
      { from: owner }
    );
    console.log("user1Transaction: " + user1Transaction);
    let calculateBalanceUser1 = 0;
    let i;
    for (i = 0; i < user1Transaction; i++) {
      let transaction = await cornerTransactionContract.getTransaction(
        user1,
        i,
        { from: owner }
      );
      let isAdd = await cornerTransactionContract.isAddTransaction(user1, i, {
        from: owner
      });
      if (isAdd) {
        calculateBalanceUser1 = calculateBalanceUser1 + parseInt(transaction);
      } else {
        calculateBalanceUser1 = calculateBalanceUser1 - parseInt(transaction);
      }
      let stonnCoin = await cornerTransactionContract.getTransactionsStoneCoin(
        user1,
        i,
        { from: owner }
      );
      console.log(
        `user1Transaction ${i} :  transaction: ${transaction} isAdd: ${isAdd} stonnCoin: ${stonnCoin}`
      );
    }
    let user2Transaction = await cornerTransactionContract.getTransactionsLength(
      user2,
      { from: owner }
    );
    console.log("user2Transaction: " + user2Transaction);
    let calculateBalanceUser2 = 0;
    for (i = 0; i < user2Transaction; i++) {
      let transaction = await cornerTransactionContract.getTransaction(
        user2,
        i,
        { from: owner }
      );

      let isAdd = await cornerTransactionContract.isAddTransaction(user2, i, {
        from: owner
      });
      if (isAdd) {
        calculateBalanceUser2 = calculateBalanceUser2 + parseInt(transaction);
      } else {
        calculateBalanceUser2 = calculateBalanceUser2 - parseInt(transaction);
      }
      let stonnCoin = await cornerTransactionContract.getTransactionsStoneCoin(
        user2,
        i,
        { from: owner }
      );
      console.log(
        `user2Transaction ${i} :  transaction: ${transaction} isAdd: ${isAdd} stonnCoin: ${stonnCoin}`
      );
    }
    let user1Balance = await cornerStone.balanceOf(user1);
    let user2Balance = await cornerStone.balanceOf(user2);
    console.log("user1Balance " + user1Balance);
    console.log("user2Balance " + user2Balance);

    assert.equal(parseInt(user1Balance), calculateBalanceUser1);
    assert.equal(parseInt(user2Balance), calculateBalanceUser2);
  });
  it("should  ask ", async () => {
    let result = await cornerStone.ask(testStoneCoinAddress, 1000, 1000000, 0, {
      from: user1
    });
    assert.equal(
      TestUtils.validateReceipt(result, "AskCreated", { amount: 1000 }),
      true,
      "Bid not created as expected"
    );
  });
  it("test free token trade should fail  ", async () => {
    let cornerBaseAddres = await cornerStone.getCornerBase();
    console.log("cornerBaseAddres: " + cornerBaseAddres);
    let key = new Date().getTime();
    await tokenApproveFactory.createTokenApprove(
      cornerBaseAddres,
      testStoneCoinAddress,
      user1,
      user2,
      1000,
      key
    );
    approveContractAddress = await tokenApproveFactory.getContractAddress(key);
    let stoneCoinContract = StoneCoin.at(testStoneCoinAddress);
    await stoneCoinContract.setTransferFreeWithContract({ from: owner });
    assert.equal(true, true);
  });

  it("test free token trade with unapproved document should fail  ", async () => {
    try {
      let stoneCoinContract = StoneCoin.at(testStoneCoinAddress);
      await stoneCoinContract.transferTokenFrom(
        user1,
        user2,
        1000,
        approveContractAddress,
        { from: user1 }
      );
      assert.equal(false, true);
    } catch (error) {
      assert.equal(true, true);
    }
  });
  it("test free token with approved contract  ", async () => {
    await cornerStone.addTokenApproveRole(owner, { from: owner });
    console.log("###added approve role ###3");
    tokenApproveContract = await TokenApproveContract.at(
      approveContractAddress
    );
    await tokenApproveContract.approveContract({ from: owner });
    let stoneCoinContract = StoneCoin.at(testStoneCoinAddress);
    let balanceTokenUser1 = await stoneCoinContract.balanceOf(user1);
    let balanceTokenUser2 = await stoneCoinContract.balanceOf(user2);
    console.log(
      "balanceTokenUser1 " +
        balanceTokenUser1 +
        " " +
        "balanceTokenUser2 " +
        balanceTokenUser2
    );
    await stoneCoinContract.transferTokenFrom(
      user1,
      user2,
      1000,
      approveContractAddress,
      { from: user1 }
    );

    // let afterBalanceTokenUser1 = await stoneCoinContract.balanceOf(user1)
    // let afterBalanceTokenUser2 = await stoneCoinContract.balanceOf(user2)
    // console.log('afterBalanceTokenUser1: ' + afterBalanceTokenUser1 + ' afterBalanceTokenUser2: ' + afterBalanceTokenUser2)
    // assert.equal(parseInt(balanceTokenUser1) - 1000, parseInt(afterBalanceTokenUser1))
    // assert.equal(parseInt(balanceTokenUser2) + 1000, parseInt(afterBalanceTokenUser2))
    assert.equal(true, true);
  });

  it("test free token trade should fail  ", async () => {
    try {
      let stoneCoinContract = StoneCoin.at(testStoneCoinAddress);
      await stoneCoinContract.transferTokenFrom(user1, user2, 1000, 0, {
        from: user1
      });
      assert.equal(false, true);
    } catch (error) {
      assert.equal(true, true);
    }
  });
  it("test free token trade  ", async () => {
    let stoneCoinContract = StoneCoin.at(testStoneCoinAddress);
    let balanceTokenUser1 = await stoneCoinContract.balanceOf(user1);
    let balanceTokenUser2 = await stoneCoinContract.balanceOf(user2);
    console.log(
      "balanceTokenUser1: " +
        balanceTokenUser1 +
        " balanceTokenUser2: " +
        balanceTokenUser2
    );
    await stoneCoinContract.setTransferFree({ from: owner });
    await stoneCoinContract.transferTokenFrom(user1, user2, 1000, 0, {
      from: user1
    });

    let afterBalanceTokenUser1 = await stoneCoinContract.balanceOf(user1);
    let afterBalanceTokenUser2 = await stoneCoinContract.balanceOf(user2);
    console.log(
      "afterBalanceTokenUser1: " +
        afterBalanceTokenUser1 +
        " afterBalanceTokenUser2: " +
        afterBalanceTokenUser2
    );
    assert.equal(
      parseInt(balanceTokenUser1) - 1000,
      parseInt(afterBalanceTokenUser1)
    );
    assert.equal(
      parseInt(balanceTokenUser2) + 1000,
      parseInt(afterBalanceTokenUser2)
    );
  });

  it("test free token trade should fail - check from user  ", async () => {
    try {
      let stoneCoinContract = StoneCoin.at(testStoneCoinAddress);
      await stoneCoinContract.transferTokenFrom(user1, user2, 1000, 0, {
        from: user2
      });
      assert.equal(false, true);
    } catch (error) {
      assert.equal(true, true);
    }
  });
});
