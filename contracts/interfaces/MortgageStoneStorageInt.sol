pragma solidity ^0.4.24;

contract MortgageStoneStorageInt {
    function createBid(
        uint256 limit,
        uint256 amount,
        uint256 valueHold,
        bool mortgaged,
        address mortgageRequest,
        address user,
        address stoneCoin
    ) public;

    function createAsk(
        uint256 limit,
        uint256 amount,
        bool mortgaged,
        address mortgageRequest,
        address user,
        address stoneCoin
    ) public;

    function askAmount(address user, address stoneCoin)
        public
        view
        returns (uint256);
    function askLimit(address user, address stoneCoin)
        public
        view
        returns (uint256);

    function askMortgaged(address user, address stoneCoin)
        public
        view
        returns (bool);
    function askMortgage(address user, address stoneCoin)
        public
        view
        returns (address);
    function bidAmount(address user, address stoneCoin)
        public
        view
        returns (uint256);
    function bidLimit(address user, address stoneCoin)
        public
        view
        returns (uint256);

    function bidMortgaged(address user, address stoneCoin)
        public
        view
        returns (bool);

    function bidMortgageRequest(address user, address stoneCoin)
        public
        view
        returns (address);

    function bidMortgageValueHold(address user, address stoneCoin)
        public
        view
        returns (uint256);

    function getMortgageeBalance(address mortgagee)
        public
        view
        returns (uint256);

    function setMortgageeBalance(address mortgagee, uint256 balance) public;

    function setBidAmount(
        address stoneCoinAddress,
        address user,
        uint256 amount
    ) public;

    function setBidMortgaged(
        address stoneCoinAddress,
        address user,
        bool mortgaged
    ) public;

    function setBidLimit(address stoneCoinAddress, address user, uint256 limit)
        public;

    function setAskAmount(
        address stoneCoinAddress,
        address user,
        uint256 amount
    ) public;
    function setAskMortgaged(
        address stoneCoinAddress,
        address user,
        bool mortgaged
    ) public;

    function setAskLimit(address stoneCoinAddress, address user, uint256 limit)
        public;

    function setBidValueHold(
        address stoneCoinAddress,
        address user,
        uint256 valueHold
    ) public;
    function createTradeMortgage(
        uint64 key,
        bool _valid,
        address _stoneCoinAddress,
        address _buyer,
        address _seller,
        address _buyerMortgage,
        address _sellerMortgage,
        uint256 _amount,
        uint256 _price,
        uint256 _valuePayed,
        uint256 _valueHold,
        bool _bidMortgaged,
        bool _askMortgaged
    ) public;

    function getTradeStoneCoin(uint64 key) public view returns (address);

    function getTradeBuyer(uint64 key) public view returns (address);

    function getTradeSeller(uint64 key) public view returns (address);

    function getTradeBuyerMortgage(uint64 key) public view returns (address);
    function getTradeSellerMortgage(uint64 key) public view returns (address);

    function getTradeSellerAmount(uint64 key) public view returns (uint256);

    function getTradeAmount(uint64 key) public view returns (uint256);

    function getTradePrice(uint64 key) public view returns (uint256);

    function getTradeValuePayed(uint64 key) public view returns (uint256);

    function getTradeValueHold(uint64 key) public view returns (uint256);

    function isTradeBidMortgage(uint64 key) public view returns (bool);

    function isTradeAskMortgage(uint64 key) public view returns (bool);
    function isTradeValid(uint64 key) public view returns (bool);
    function setTradeValid(uint64 key, bool valid) public;

    function setTradeValueHold(uint64 key, uint256 valueHold) public;

}
