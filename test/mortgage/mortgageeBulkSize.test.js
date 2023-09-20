const CornerStone = artifacts.require("./CornerStone.sol");
const StoneCoin = artifacts.require("./StoneCoin.sol");
const MortgageFactory = artifacts.require("./factory/MortgageFactory.sol");
const MortgageRequestFactory = artifacts.require(
  "./factory/MortgageRequestFactory.sol"
);
const MortgageRequest = artifacts.require("./structures/MortgageRequest.sol");
const Mortgage = artifacts.require("./Mortgage.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const FeeManager = artifacts.require("./structures/FeeManager.sol");
const CornerStoneBase = artifacts.require("./CornerStoneBase.sol");
const MortgageStone = artifacts.require("./MortgageStone.sol");
const MortgageOperations = artifacts.require("./MortgageOperations.sol");
const StoneCoinMortgage = artifacts.require("./StoneCoinMortgage.sol");
const CornerTransaction = artifacts.require("./CornerTransaction.sol");
const BrokerManager = artifacts.require("./structures/BrokerManager.sol");
const TradesHistory = artifacts.require("./structures/TradesHistory.sol");
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
const Disposition = artifacts.require("./structures/Disposition.sol");

let TestUtils = require("../testUtils");

// see https://ethereum.stackexchange.com/questions/17402/unlock-contract-deploy-address-in-truffle-testing-using-testrpc?rq=1
contract("Mortgagee Bulk size", function(accounts) {
  let cornerStone;
  let mortgageFactory;
  let testStoneCoinAddress;
  const MILLION = 1000000;
  const MILL = 1000;
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
  let mortgageeAddress;
  let mortgageeCondition;
  let mortgageRequestFactory;
  let mortgageeRequest;
  let mortgageeRequestCon;
  let mortgageeConditionAddress;
  let mortgageeRequestAddress;
  let mortgageAddress;
  let owner;
  let mortgageTradeKey = new Date().getTime();
  //
  // var cornerCoin = await CornerStone.deployed();
  // var estimation = await Estimation.deployed();
  // var manager = await Manager.deployed();
  // var trustee = await Trustee.deployed();
  // var registrar = await Registrar.deployed();

  before(async () => {
    mortgageFactory = await MortgageFactory.new();
    mortgageRequestFactory = await MortgageRequestFactory.new();

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
    await cornerStone.addMortgageOperatorRole(owner, { from: owner });
    await cornerStone.addMortgageOperatorRole(user0, { from: user0 });

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

    await cornerStone.initialAsk(testStoneCoinAddress, 20000, { from: user0 });
    await cornerStone.deposit(user1, 20000 * MILLION);
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      20000 * MILLION,
      `The balance 20000 was not reflected.`
    );

    await cornerStone.deposit(user2, 20000 * MILLION);
    balance = await cornerStone.balanceOf(user2);
    assert.equal(
      balance.valueOf(),
      20000 * MILLION,
      `The balance 20000 was not reflected.`
    );
  });
  it("set bulk size", async () => {
    let stoneCoin = StoneCoin.at(testStoneCoinAddress);
    await stoneCoin.setMinBulkSize(5000, { from: user0 });
  });

  it("should deposit funds for mortgagee", async () => {
    let mortgageeResult = await mortgageFactory.createMortgagee(
      user1,
      10000 * MILLION,
      "user1",
      "bank",
      "israel",
      "tel-aviv",
      "pinkas 13",
      "342123212",
      { from: user1 }
    );
    let mortgageeCreated = mortgageeResult.logs.filter(
      log => log.event && log.event === "MortgageeCreated"
    );
    mortgageeAddress = mortgageeCreated[0].args["mortgageeAddress"];
    await cornerStone.addMortgegee(
      10000 * MILLION,
      10000 * MILLION,
      mortgageeAddress,
      { from: user1 }
    );
    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      10000 * MILLION,
      `The balance 20000 was not reflected.`
    );
  });
  it("withdrawFunds form mortgagee account", async () => {
    let balanceMortgageeUser1 = await cornerStone.mortgageeBalanceOf(user1);
    console.log("before balanceMortgageeUser1: " + balanceMortgageeUser1);
    await cornerStone.withdrawMortgageBalance(5000 * MILLION, { from: user1 });
    balanceMortgageeUser1 = await cornerStone.mortgageeBalanceOf(user1);
    console.log(
      "after withdraw balanceMortgageeUser1: " + balanceMortgageeUser1
    );

    await cornerStone.addMortgegee(
      5000 * MILLION,
      5000 * MILLION,
      mortgageeAddress,
      { from: user1 }
    );
    balanceMortgageeUser1 = await cornerStone.mortgageeBalanceOf(user1);
    console.log("after adding balanceMortgageeUser1: " + balanceMortgageeUser1);

    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      10000 * MILLION,
      `The balance 20000 was not reflected.`
    );
  });

  it("withdrawFunds max form mortgagee account", async () => {
    let balanceMortgageeUser1 = await cornerStone.mortgageeBalanceOf(user1);
    console.log("before balanceMortgageeUser1: " + balanceMortgageeUser1);
    await cornerStone.withdrawMortgageBalance(15000 * MILLION, { from: user1 });
    balanceMortgageeUser1 = await cornerStone.mortgageeBalanceOf(user1);
    console.log(
      "after withdraw balanceMortgageeUser1: " + balanceMortgageeUser1
    );
    assert.equal(
      balanceMortgageeUser1.valueOf(),
      0,
      `The balance 0 was not reflected.`
    );
    await cornerStone.addMortgegee(
      10000 * MILLION,
      10000 * MILLION,
      mortgageeAddress,
      { from: user1 }
    );
    balanceMortgageeUser1 = await cornerStone.mortgageeBalanceOf(user1);
    console.log("after adding balanceMortgageeUser1: " + balanceMortgageeUser1);

    let balance = await cornerStone.balanceOf(user1);
    assert.equal(
      balance.valueOf(),
      10000 * MILLION,
      `The balance 20000 was not reflected.`
    );
  });

  it("create mortgage condition", async () => {
    mortgageeCondition = await mortgageRequestFactory.createMortgageeCondition(
      false,
      testStoneCoinAddress,
      10000 * MILLION,
      4200,
      5000,
      20000,
      64,
      64,
      25,
      25,
      0,
      { from: user1 }
    );
    let mortgageeConditionCreated = mortgageeCondition.logs.filter(
      log => log.event && log.event === "MortgageeConditionCreated"
    );
    mortgageeConditionAddress =
      mortgageeConditionCreated[0].args["mortgageeCondition"];
    assert.equal(
      TestUtils.validateReceipt(
        mortgageeCondition,
        "MortgageeConditionCreated",
        { mortgageeCondition: null }
      ),
      true,
      "MortgageeCondition failed to create"
    );
  });

  it("create mortgage request", async () => {
    let downPaymentPercentMill =
      ((5000 * MILLION) / (5000 * MILLION + 5000 * MILLION)) * 100 * 1000;
    console.log(`downPaymentPercentMill=${downPaymentPercentMill}`);

    mortgageeRequest = await mortgageRequestFactory.createMortgageRequest(
      user2,
      testStoneCoinAddress,
      mortgageeConditionAddress,
      5000 * MILLION,
      5000 * MILLION,
      48,
      downPaymentPercentMill,
      user1,
      { from: user2 }
    );

    let mortgageRequestCreated = mortgageeRequest.logs.filter(
      log => log.event && log.event === "MortgageRequestCreated"
    );
    mortgageeRequestAddress = mortgageRequestCreated[0].args["mortgageRequest"];
    mortgageeRequestCon = MortgageRequest.at(mortgageeRequestAddress);
    await mortgageeRequestCon.approve({ from: user1 });
    assert.equal(
      TestUtils.validateReceipt(mortgageeRequest, "MortgageRequestCreated", {
        mortgageRequest: null
      }),
      true,
      "MortgageRequest creation failed to create"
    );
  });

  it("create mortgage ", async () => {
    let createdMortgage = await mortgageFactory.createMortgage(
      user1,
      testStoneCoinAddress,
      mortgageeRequestAddress,
      mortgageeConditionAddress,
      { from: user2 }
    );
    // console.log(JSON.stringify(mortgage))
    let mortgageCreated = createdMortgage.logs.filter(
      log => log.event && log.event === "MortgageCreated"
    );
    mortgageAddress = mortgageCreated[0].args["mortgage"];
    assert.equal(
      TestUtils.validateReceipt(createdMortgage, "MortgageCreated", {
        mortgage: null
      }),
      true,
      "mortgagee creation failed to create"
    );
  });

  it("create bid mortgage ", async () => {
    // address mortgageRequestAddress, address stoneCoinAddress, uint64 downPaymentMicros, uint256 amount, uint256 limit_micros
    let bidCreation = await cornerStone.bidMortgaged(
      mortgageeRequestAddress,
      testStoneCoinAddress,
      5000 * MILLION,
      10000,
      MILLION,
      0,
      { from: user2 }
    );
    // console.log(JSON.stringify(mortgage))
    assert.equal(
      TestUtils.validateReceipt(bidCreation, "BidMortgageCreated", {
        user: null
      }),
      true,
      "bid  creation failed to create"
    );
  });

  it("set mortgage registrar ", async () => {
    let mortgage = Mortgage.at(mortgageAddress);
    await mortgage.setMortgageRegistrar("w4343", "dffdf", { from: user1 });
    assert.equal(true, true);
  });
  it("create trade mortgage ", async () => {
    let user0Holdings = await cornerStone.getUserHoldings(
      testStoneCoinAddress,
      user0
    );
    let user2Holdings = await cornerStone.getUserHoldings(
      testStoneCoinAddress,
      user2
    );
    console.log(
      "user0Holdings " + user0Holdings + " user2Holdings " + user2Holdings
    );

    let tradeMortgage = await cornerStone.createTradeMortgage(
      mortgageTradeKey,
      testStoneCoinAddress,
      user2,
      user0,
      mortgageAddress,
      0,
      10000,
      MILLION,
      0,
      { from: user0 }
    );
    // console.log(JSON.stringify(mortgage))
    assert.equal(
      TestUtils.validateReceipt(tradeMortgage, "TradeMortgageCreated", {
        key: null
      }),
      true,
      "tradeMortgage  creation failed to create"
    );
    let balanceUser2 = await cornerStone.balanceOf(user2);
    assert.equal(
      balanceUser2.valueOf(),
      15000 * MILLION,
      `The balance 15000$ was not reflected.`
    );
    let balanceMortgageeUser1 = await cornerStone.mortgageeBalanceOf(user1);
    assert.equal(
      balanceMortgageeUser1.valueOf(),
      5000 * MILLION,
      `The balance 5000 was not reflected.`
    );
    console.log(
      `balanceUser2=${balanceUser2} balanceMortgageeUser1=${balanceMortgageeUser1}`
    );
    let unitsInit = await cornerStone.getUserHoldings(
      testStoneCoinAddress,
      owner
    );
    console.log("owner units " + unitsInit);
    assert.equal(
      unitsInit.valueOf(),
      10000,
      `The units count 5000 was not reflected.`
    );
    let unitsUser2 = await cornerStone.getUserHoldings(
      testStoneCoinAddress,
      user2
    );
    assert.equal(
      unitsUser2.valueOf(),
      10000,
      `The units count 5000 was not reflected.`
    );
  });
});
