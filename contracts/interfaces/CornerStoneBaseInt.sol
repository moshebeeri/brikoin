pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract CornerStoneBaseInt {
    function getBrokerManager() public view returns (address);
    function getTransactionManager() public view returns (address);
    function setBrokerFees(
        address user,
        uint256 firstDealRatio,
        uint256 otherDealRatio,
        uint256 secondaryFee,
        address organization
    ) public;
    function transferFromOwner(
        address stoneCoinAddress,
        address to,
        uint256 amount
    ) public returns (bool);
    function addBroker(address user, address organization) public;

    function setTransactionManager(address user) public;

    function addUserToBroker(address user, address broker, address organization)
        public;
    function getTradesHistory() public view returns (address);

    function getFeeManager() public view returns (address);

    function addFeeManagerRole(address user) public;

    function isMortgageOperator(address _user) public view returns (bool);

    function isMortgageFinance(address _user) public view returns (bool);

    function isTokenApproveRole(address _user) public view returns (bool);

    function addMortgageOperatorRole(address _user) public;

    function addMortgageFinanceRole(address _user) public;

    function addTokenApproveRole(address _user) public;

    function subBalance(
        address _user,
        uint256 _value,
        address stoneCoin,
        string operation
    ) public returns (uint256);

    function addBalance(
        address _user,
        uint256 _value,
        address stoneCoin,
        string operation
    ) public returns (uint256);

    function addOwnerBalance(uint256 _value) public returns (uint256);
    function subOwnerBalance(uint256 _value) public returns (uint256);

    function getInitialSupply() public view returns (uint256);

    function symbol() external view returns (bytes32);

    function transfer(address _to, uint256 _value, string operation)
        public
        returns (bool);
    function balanceOf(address _user) public view returns (uint256);
    function getOwnerBalance() public view returns (uint256);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value,
        address stoneCoin,
        string operation
    ) public returns (bool);

    function sell(
        address stoneCoinAddress,
        address seller,
        uint256 amount,
        uint256 price
    ) public;
    function buy(
        address stoneCoinAddress,
        address buyer,
        uint256 amount,
        uint256 price
    ) public;

    function clearMortgage(
        address stoneCoinAddress,
        address user,
        address mortgageAddress
    ) public;
    function partlyForfeitureMortgage(
        address stoneCoinAddress,
        address user,
        address mortgagee,
        address mortgageAddress,
        uint256 marketPriceMills,
        bool maxDefaulted
    ) public;
    function buyMortgaged(
        address stoneCoinAddress,
        address mortgageAddress,
        address buyer,
        uint256 amount,
        uint256 price
    ) public;
    function calculateTax(address taxes, address buyer, address seller) public;
    function sellMortgaged(
        address stoneCoinAddress,
        address mortgageAddress,
        address seller,
        uint256 amount,
        uint256 price
    ) public;
    function isInitialOffering(address stoneCoinAddress)
        public
        view
        returns (bool);

    function deposit(address payee, uint256 amount, address stoneCoin)
        public
        returns (bool);
    function withdrawApprove(
        address user,
        uint256 amount,
        address stoneCoinAddress
    ) public returns (bool);
    function withdraw(address user, uint256 amount) public returns (bool);

    //pay income
    function payIncome(address stoneCoinAddress, uint256 micros)
        public
        returns (uint256 remaining);
    function getTotalAllocated(address stoneCoinAddress)
        public
        view
        returns (uint256);

    function getUserHoldings(address stoneCoinAddress, address user)
        public
        view
        returns (uint256);

    //StoneCoin project sold
    function closeStoneCoin(address stoneCoinAddress, uint256 micros) public;

    function checkSignature(address signDocument, address stoneCoinAddress)
        public
        returns (bool);

    function transferAll(
        address _buyer,
        address _seller,
        uint256 _value,
        address stoneCoinAddress,
        string operation
    ) public;

    function payBroker(
        address broker,
        uint256 payment,
        address organization,
        address stoneCoinAddress
    ) public;
    function reserveBid(address _user, address _stoneCoinAddress) public;
    function cancelReserveBid(address _user, address _stoneCoinAddress) public;
    function getReserveBid(address _user, address _stoneCoinAddress)
        public
        view
        returns (uint256);
    function reservedBidLost(address _user, address _stoneCoinAddress) public;

}
