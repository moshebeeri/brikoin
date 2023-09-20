pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/MortgageStoneStorageInt.sol";

contract MortgageStoneStorage is Ownables, MortgageStoneStorageInt {
    using SafeMath for uint256;

    struct TradeMortgage {
        bool valid;
        address stoneCoinAddress;
        address buyer;
        address seller;
        address buyerMortgage;
        address sellerMortgage;
        uint256 amount;
        uint256 price;
        uint256 valuePayed;
        uint256 valueHold;
        bool bidMortgaged;
        bool askMortgaged;
    }

    struct Bid {
        uint256 limit;
        uint256 amount;
        uint256 valueHold;
        bool mortgaged;
        address mortgageRequest;
    }

    struct Ask {
        uint256 limit;
        uint256 amount;
        bool mortgaged;
        address mortgage;
    }
    mapping(address => mapping(address => Bid)) userProjectBids;
    mapping(address => mapping(address => Ask)) userProjectAsks;
    mapping(address => uint256) mortgageeBalances;
    mapping(uint64 => TradeMortgage) tradeMortgages;
    constructor() public Ownables() {}

    function createBid(
        uint256 limit,
        uint256 amount,
        uint256 valueHold,
        bool mortgaged,
        address mortgageRequest,
        address user,
        address stoneCoinAddress
    ) public onlyOwner {
        userProjectBids[user][stoneCoinAddress].limit = limit;
        userProjectBids[user][stoneCoinAddress].amount = amount;
        userProjectBids[user][stoneCoinAddress].mortgaged = mortgaged;
        userProjectBids[user][stoneCoinAddress]
            .mortgageRequest = mortgageRequest;
        userProjectBids[user][stoneCoinAddress].valueHold = valueHold;
    }
    function createAsk(
        uint256 limit,
        uint256 amount,
        bool mortgaged,
        address mortgageAddress,
        address user,
        address stoneCoinAddress
    ) public onlyOwner {
        userProjectAsks[user][stoneCoinAddress].limit = limit;
        userProjectAsks[user][stoneCoinAddress].amount = amount;
        userProjectAsks[user][stoneCoinAddress].mortgaged = mortgaged;
        userProjectAsks[user][stoneCoinAddress].mortgage = mortgageAddress;
    }

    function askAmount(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return userProjectAsks[user][stoneCoinAddress].amount;
    }
    function askLimit(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return userProjectAsks[user][stoneCoinAddress].limit;
    }

    function askMortgaged(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (bool)
    {
        return userProjectAsks[user][stoneCoinAddress].mortgaged;
    }

    function askMortgage(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (address)
    {
        return userProjectAsks[user][stoneCoinAddress].mortgage;
    }

    function bidAmount(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return userProjectBids[user][stoneCoinAddress].amount;
    }
    function bidLimit(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return userProjectBids[user][stoneCoinAddress].limit;
    }

    function bidMortgaged(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (bool)
    {
        return userProjectBids[user][stoneCoinAddress].mortgaged;
    }

    function bidMortgageRequest(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (address)
    {
        return userProjectBids[user][stoneCoinAddress].mortgageRequest;
    }

    function bidMortgageValueHold(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return userProjectBids[user][stoneCoinAddress].valueHold;
    }

    function getMortgageeBalance(address mortgagee)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return mortgageeBalances[mortgagee];
    }

    function setMortgageeBalance(address mortgagee, uint256 balance) public {
        mortgageeBalances[mortgagee] = balance;
    }

    function setBidAmount(
        address _stoneCoinAddress,
        address user,
        uint256 amount
    ) public onlyOwner {
        userProjectBids[user][_stoneCoinAddress].amount = amount;
    }

    function setBidMortgaged(
        address stoneCoinAddress,
        address user,
        bool mortgaged
    ) public onlyOwner {
        userProjectBids[user][stoneCoinAddress].mortgaged = mortgaged;
    }

    function setBidLimit(address stoneCoinAddress, address user, uint256 limit)
        public
        onlyOwner
    {
        userProjectBids[user][stoneCoinAddress].limit = limit;
    }

    function setAskAmount(
        address stoneCoinAddress,
        address user,
        uint256 amount
    ) public onlyOwner {
        userProjectAsks[user][stoneCoinAddress].amount = amount;
    }
    function setAskMortgaged(
        address stoneCoinAddress,
        address user,
        bool mortgaged
    ) public onlyOwner {
        userProjectAsks[user][stoneCoinAddress].mortgaged = mortgaged;
    }

    function setAskLimit(address stoneCoinAddress, address user, uint256 limit)
        public
        onlyOwner
    {
        userProjectAsks[user][stoneCoinAddress].limit = limit;
    }

    function setBidValueHold(
        address stoneCoinAddress,
        address user,
        uint256 valueHold
    ) public onlyOwner {
        userProjectBids[user][stoneCoinAddress].valueHold = valueHold;
    }

    function createTradeMortgage(
        uint64 key,
        bool valid,
        address stoneCoinAddress,
        address buyer,
        address seller,
        address buyerMortgage,
        address sellerMortgage,
        uint256 amount,
        uint256 price,
        uint256 valuePayed,
        uint256 valueHold,
        bool _bidMortgaged,
        bool _askMortgaged
    ) public onlyOwner {
        tradeMortgages[key].stoneCoinAddress = stoneCoinAddress;
        tradeMortgages[key].buyer = buyer;
        tradeMortgages[key].seller = seller;
        tradeMortgages[key].buyerMortgage = buyerMortgage;
        tradeMortgages[key].sellerMortgage = sellerMortgage;
        tradeMortgages[key].amount = amount;
        tradeMortgages[key].price = price;
        tradeMortgages[key].valuePayed = valuePayed;
        tradeMortgages[key].valueHold = valueHold;
        tradeMortgages[key].bidMortgaged = _bidMortgaged;
        tradeMortgages[key].askMortgaged = _askMortgaged;
        tradeMortgages[key].valid = valid;
    }

    function getTradeStoneCoin(uint64 key)
        public
        view
        onlyOwner
        returns (address)
    {
        return tradeMortgages[key].stoneCoinAddress;
    }

    function getTradeBuyer(uint64 key) public view onlyOwner returns (address) {
        return tradeMortgages[key].buyer;
    }

    function getTradeSeller(uint64 key)
        public
        view
        onlyOwner
        returns (address)
    {
        return tradeMortgages[key].seller;
    }

    function getTradeBuyerMortgage(uint64 key)
        public
        view
        onlyOwner
        returns (address)
    {
        return tradeMortgages[key].buyerMortgage;
    }

    function getTradeSellerMortgage(uint64 key)
        public
        view
        onlyOwner
        returns (address)
    {
        return tradeMortgages[key].sellerMortgage;
    }

    function getTradeSellerAmount(uint64 key)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return tradeMortgages[key].amount;
    }

    function getTradeAmount(uint64 key)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return tradeMortgages[key].amount;
    }

    function getTradePrice(uint64 key) public view onlyOwner returns (uint256) {
        return tradeMortgages[key].price;
    }

    function getTradeValuePayed(uint64 key)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return tradeMortgages[key].valuePayed;
    }

    function getTradeValueHold(uint64 key)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return tradeMortgages[key].valueHold;
    }

    function isTradeBidMortgage(uint64 key)
        public
        view
        onlyOwner
        returns (bool)
    {
        return tradeMortgages[key].bidMortgaged;
    }

    function isTradeAskMortgage(uint64 key)
        public
        view
        onlyOwner
        returns (bool)
    {
        return tradeMortgages[key].askMortgaged;
    }
    function isTradeValid(uint64 key) public view onlyOwner returns (bool) {
        return tradeMortgages[key].valid;
    }

    function setTradeValid(uint64 key, bool valid) public onlyOwner {
        tradeMortgages[key].valid = valid;
    }

    function setTradeValueHold(uint64 key, uint256 valueHold) public onlyOwner {
        tradeMortgages[key].valueHold = valueHold;
    }

}
