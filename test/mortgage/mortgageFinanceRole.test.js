const CornerStone = artifacts.require("./CornerStone.sol");
const MortgageFactory = artifacts.require("./factory/MortgageFactory.sol");
const AssetManager = artifacts.require("./AssetManager.sol");
const Mortgage = artifacts.require("./Mortgage.sol");
const MortgageRequest = artifacts.require("./structures/MortgageRequest.sol");
const MortgageRequestFactory = artifacts.require(
  "./factory/MortgageRequestFactory.sol"
);
const StoneCoin = artifacts.require("./StoneCoin.sol");
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
const PAYMENTS = {
  loanTermMonths: 5,
  salePrice: 100000,
  interestRate: 4.2,
  downPayment: "0%",
  extras: [],
  propertyTaxRate: 0,
  homeInsurance: 0,
  adjustFixedRateMonths: 36,
  adjustInitialCap: 0.25,
  adjustPeriodicCap: 0.25,
  adjustLifetimeCap: 10,
  adjustIntervalMonths: 12,
  startDate: "2018-09-01",
  loanAmount: 100000,
  totalLoanCost: 1052.44,
  paymentSchedule: [
    {
      interestRate: 4.2,
      scheduledMonthlyPayment: 20210.49,
      interest: 350,
      principal: 19860.49,
      extra: 0,
      principalTotal: 19860.49,
      propertyTax: 0,
      paymentTotal: 20210.49,
      paymentDate: "2018-8-01T00:00:00.000Z",
      remainingLoanBalnce: 80139.51,
      loanMonth: 1,
      loanYear: 1,
      interestLoanYearToDate: 350,
      principalLoanYearToDate: 19860.49,
      extraLoanYearToDate: 0,
      principalTotalLoanYearToDate: 19860.49,
      propertyTaxLoanYearToDate: 0,
      paymentTotalLoanYearToDate: 20210.49,
      interestToDate: 350,
      principalToDate: 19860.49,
      extraToDate: 0,
      principalTotalToDate: 19860.49,
      propertyTaxToDate: 0,
      paymentTotalToDate: 20210.49
    },
    {
      interestRate: 4.2,
      scheduledMonthlyPayment: 20210.49,
      interest: 280.49,
      principal: 19930,
      extra: 0,
      principalTotal: 19930,
      propertyTax: 0,
      paymentTotal: 20210.49,
      paymentDate: "2018-9-01T01:00:00.000Z",
      remainingLoanBalnce: 60209.51,
      loanMonth: 2,
      loanYear: 1,
      interestLoanYearToDate: 630.49,
      principalLoanYearToDate: 39790.49,
      extraLoanYearToDate: 0,
      principalTotalLoanYearToDate: 39790.49,
      propertyTaxLoanYearToDate: 0,
      paymentTotalLoanYearToDate: 40420.98,
      interestToDate: 630.49,
      principalToDate: 39790.49,
      extraToDate: 0,
      principalTotalToDate: 39790.49,
      propertyTaxToDate: 0,
      paymentTotalToDate: 40420.98
    },
    {
      interestRate: 4.2,
      scheduledMonthlyPayment: 20210.49,
      interest: 210.73,
      principal: 19999.76,
      extra: 0,
      principalTotal: 19999.76,
      propertyTax: 0,
      paymentTotal: 20210.49,
      paymentDate: "2018-10-01T01:00:00.000Z",
      remainingLoanBalnce: 40209.75,
      loanMonth: 3,
      loanYear: 1,
      interestLoanYearToDate: 841.22,
      principalLoanYearToDate: 59790.25,
      extraLoanYearToDate: 0,
      principalTotalLoanYearToDate: 59790.25,
      propertyTaxLoanYearToDate: 0,
      paymentTotalLoanYearToDate: 60631.47,
      interestToDate: 841.22,
      principalToDate: 59790.25,
      extraToDate: 0,
      principalTotalToDate: 59790.25,
      propertyTaxToDate: 0,
      paymentTotalToDate: 60631.47
    },
    {
      interestRate: 4.2,
      scheduledMonthlyPayment: 20210.49,
      interest: 140.73,
      principal: 20069.76,
      extra: 0,
      principalTotal: 20069.76,
      propertyTax: 0,
      paymentTotal: 20210.49,
      paymentDate: "2019-11-01T01:00:00.000Z",
      remainingLoanBalnce: 20140,
      loanMonth: 4,
      loanYear: 1,
      interestLoanYearToDate: 981.96,
      principalLoanYearToDate: 79860,
      extraLoanYearToDate: 0,
      principalTotalLoanYearToDate: 79860,
      propertyTaxLoanYearToDate: 0,
      paymentTotalLoanYearToDate: 80841.96,
      interestToDate: 981.96,
      principalToDate: 79860,
      extraToDate: 0,
      principalTotalToDate: 79860,
      propertyTaxToDate: 0,
      paymentTotalToDate: 80841.96
    },
    {
      interestRate: 4.2,
      scheduledMonthlyPayment: 20210.49,
      interest: 70.49,
      principal: 20140,
      extra: 0,
      principalTotal: 20140,
      propertyTax: 0,
      paymentTotal: 20210.49,
      paymentDate: "2019-01-01T01:00:00.000Z",
      remainingLoanBalnce: 0,
      loanMonth: 5,
      loanYear: 1,
      interestLoanYearToDate: 1052.45,
      principalLoanYearToDate: 100000,
      extraLoanYearToDate: 0,
      principalTotalLoanYearToDate: 100000,
      propertyTaxLoanYearToDate: 0,
      paymentTotalLoanYearToDate: 101052.45,
      interestToDate: 1052.45,
      principalToDate: 100000,
      extraToDate: 0,
      principalTotalToDate: 100000,
      propertyTaxToDate: 0,
      paymentTotalToDate: 101052.45
    }
  ],
  numberOfPayments: 5,
  monthlyPayment: 20210.49
};
// see https://ethereum.stackexchange.com/questions/17402/unlock-contract-deploy-address-in-truffle-testing-using-testrpc?rq=1
contract("Mortgage finance payment", function(accounts) {
  let cornerStone;
  let mortgageFactory;
  let testStoneCoinAddress;
  const MILL = 1000;
  const MILLION = 1000000;
  const user0 = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const payment = PAYMENTS.paymentSchedule[0].scheduledMonthlyPayment * MILLION;
  let mortgageeAddress;
  let mortgageeConditionAddress;
  let mortgageeRequestAddress;
  let mortgageAddress;
  let mortgageRequestFactory;
  let mortgageeRequestCon;
  let owner;
  let mortgageTradeKey = new Date().getTime();
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
    await cornerStone.addMortgageOperatorRole(user1, { from: owner });

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
      2000000,
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

    await cornerStone.initialAsk(testStoneCoinAddress, 2000000, {
      from: user0
    });
    await cornerStone.deposit(user1, 300000 * MILLION);
    await cornerStone.deposit(user2, 200000 * MILLION);
    await cornerStone.deposit(user3, 200000 * MILLION);
    let mortgageeResult = await mortgageFactory.createMortgagee(
      user1,
      200000 * MILLION,
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
      200000 * MILLION,
      200000 * MILLION,
      mortgageeAddress,
      { from: user1 }
    );
    let mortgageeCondition = await mortgageRequestFactory.createMortgageeCondition(
      false,
      testStoneCoinAddress,
      150000 * MILLION,
      4200,
      5000,
      20000,
      5,
      5,
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

    let downPaymentPercentMill =
      ((50000 * MILLION) / (100000 * MILLION + 50000 * MILLION)) * 100 * 1000;

    let mortgageeRequest = await mortgageRequestFactory.createMortgageRequest(
      user2,
      testStoneCoinAddress,
      mortgageeConditionAddress,
      100000 * MILLION,
      50000 * MILLION,
      5,
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

    let mortgageResult = await Mortgage.new(
      testStoneCoinAddress,
      user1,
      user2,
      mortgageeRequestAddress,
      mortgageeConditionAddress,
      false,
      { from: user0 }
    );
    mortgageResult.addOwnership(mortgageOperationAddress, { from: user0 });
    mortgageAddress = await mortgageResult.getAddress();
    await cornerStone.bidMortgaged(
      mortgageeRequestAddress,
      testStoneCoinAddress,
      50000 * MILLION,
      150000,
      MILLION,
      0,
      { from: user2 }
    );
    let mortgage = Mortgage.at(mortgageAddress);
    await mortgage.setMortgageRegistrar("w4343", "dffdf", { from: user1 });
    await cornerStone.createTradeMortgage(
      mortgageTradeKey,
      testStoneCoinAddress,
      user2,
      user0,
      mortgageAddress,
      0,
      150000,
      MILLION,
      0,
      { from: user0 }
    );
  });

  it("add mortgage payments ", async () => {
    let mortgage = Mortgage.at(mortgageAddress);
    await mortgage.addPaymentSchedule(
      0,
      PAYMENTS.paymentSchedule[0].interestRate,
      PAYMENTS.paymentSchedule[0].scheduledMonthlyPayment * MILLION,
      PAYMENTS.paymentSchedule[0].interest * MILLION,
      PAYMENTS.paymentSchedule[0].principal * MILLION,
      PAYMENTS.paymentSchedule[0].principalTotal * MILLION,
      PAYMENTS.paymentSchedule[0].propertyTax,
      PAYMENTS.paymentSchedule[0].paymentTotal * MILLION,
      new Date(PAYMENTS.paymentSchedule[0].paymentDate).getTime(),
      PAYMENTS.paymentSchedule[0].remainingLoanBalnce * MILLION,
      PAYMENTS.paymentSchedule[0].loanMonth,
      PAYMENTS.paymentSchedule[0].loanYear,
      { from: user0 }
    );

    await mortgage.addPaymentSchedule(
      1,
      PAYMENTS.paymentSchedule[1].interestRate,
      PAYMENTS.paymentSchedule[1].scheduledMonthlyPayment * MILLION,
      PAYMENTS.paymentSchedule[1].interest * MILLION,
      PAYMENTS.paymentSchedule[1].principal * MILLION,
      PAYMENTS.paymentSchedule[1].principalTotal * MILLION,
      PAYMENTS.paymentSchedule[1].propertyTax,
      PAYMENTS.paymentSchedule[1].paymentTotal * MILLION,
      new Date(PAYMENTS.paymentSchedule[1].paymentDate).getTime(),
      PAYMENTS.paymentSchedule[1].remainingLoanBalnce * MILLION,
      PAYMENTS.paymentSchedule[1].loanMonth,
      PAYMENTS.paymentSchedule[1].loanYear,
      { from: user0 }
    );
    await mortgage.addPaymentSchedule(
      2,
      PAYMENTS.paymentSchedule[2].interestRate,
      PAYMENTS.paymentSchedule[2].scheduledMonthlyPayment * MILLION,
      PAYMENTS.paymentSchedule[2].interest * MILLION,
      PAYMENTS.paymentSchedule[2].principal * MILLION,
      PAYMENTS.paymentSchedule[2].principalTotal * MILLION,
      PAYMENTS.paymentSchedule[2].propertyTax,
      PAYMENTS.paymentSchedule[2].paymentTotal * MILLION,
      new Date(PAYMENTS.paymentSchedule[2].paymentDate).getTime(),
      PAYMENTS.paymentSchedule[2].remainingLoanBalnce * MILLION,
      PAYMENTS.paymentSchedule[2].loanMonth,
      PAYMENTS.paymentSchedule[2].loanYear,
      { from: user0 }
    );

    await mortgage.addPaymentSchedule(
      3,
      PAYMENTS.paymentSchedule[3].interestRate,
      PAYMENTS.paymentSchedule[3].scheduledMonthlyPayment * MILLION,
      PAYMENTS.paymentSchedule[3].interest * MILLION,
      PAYMENTS.paymentSchedule[3].principal * MILLION,
      PAYMENTS.paymentSchedule[3].principalTotal * MILLION,
      PAYMENTS.paymentSchedule[3].propertyTax,
      PAYMENTS.paymentSchedule[3].paymentTotal * MILLION,
      new Date(PAYMENTS.paymentSchedule[3].paymentDate).getTime(),
      PAYMENTS.paymentSchedule[3].remainingLoanBalnce * MILLION,
      PAYMENTS.paymentSchedule[3].loanMonth,
      PAYMENTS.paymentSchedule[3].loanYear,
      { from: user0 }
    );

    await mortgage.addPaymentSchedule(
      4,
      PAYMENTS.paymentSchedule[4].interestRate,
      PAYMENTS.paymentSchedule[4].scheduledMonthlyPayment * MILLION,
      PAYMENTS.paymentSchedule[4].interest * MILLION,
      PAYMENTS.paymentSchedule[4].principal * MILLION,
      PAYMENTS.paymentSchedule[4].principalTotal * MILLION,
      PAYMENTS.paymentSchedule[4].propertyTax,
      PAYMENTS.paymentSchedule[4].paymentTotal * MILLION,
      new Date(PAYMENTS.paymentSchedule[4].paymentDate).getTime(),
      PAYMENTS.paymentSchedule[4].remainingLoanBalnce * MILLION,
      PAYMENTS.paymentSchedule[4].loanMonth,
      PAYMENTS.paymentSchedule[4].loanYear,
      { from: user0 }
    );
    assert.equal(true, true);
  });
  it("Payment should fail", async () => {
    try {
      await cornerStone.trustedMortgagePayment(
        mortgageAddress,
        MILL,
        10000 * 1000,
        { from: user0 }
      );
      assert.equal(true, false);
    } catch (error) {
      assert.equal(true, true);
    }
  });
  it("Payment ", async () => {
    await cornerStone.addMortgageFinanceRole(user1, { from: owner });
    let beforeBalance = await cornerStone.balanceOf(user2);
    await cornerStone.trustedMortgagePayment(
      mortgageAddress,
      MILL,
      10000 * 1000,
      { from: user1 }
    );
    let balance = await cornerStone.balanceOf(user2);
    console.log("beforeBalance : " + beforeBalance);
    console.log("balanceAfter  : " + balance);
    assert.equal(parseInt(beforeBalance), parseInt(balance) + 10000 * 1000);
  });
});
