pragma solidity ^0.4.24;

contract MortgageStoneInt {
    function setStoneBaseAddress(address _cornerStoneBaseAddress) public;
    function setStorageAddress(address _storageAddress) public;
    function setMortgageOperationAddress(address _mortgageOperationsAddress)
        public;

    function addMortgageBalance(address _user, uint256 microUSDs) public;

    function bidAmount(address stoneCoinAddress, address user)
        public
        view
        returns (uint256);

    function bidValueHold(address stoneCoinAddress, address user)
        public
        view
        returns (uint256);

    function isBidMortgaged(address stoneCoinAddress, address user)
        public
        view
        returns (bool);
    function setBidAmount(
        address stoneCoinAddress,
        address user,
        uint256 amount
    ) public returns (uint256);

    function setBidLimit(address stoneCoinAddress, address user, uint256 limit)
        public
        returns (uint256);

    function setAskAmount(
        address stoneCoinAddress,
        address user,
        uint256 amount
    ) public returns (uint256);

    function setAskLimit(address stoneCoinAddress, address user, uint256 limit)
        public
        returns (uint256);
    function setBidValueHold(
        address stoneCoinAddress,
        address user,
        uint256 valueHold
    ) public returns (uint256);

    function askAmount(address stoneCoinAddress, address user)
        public
        view
        returns (uint256);

    function withdrawMortgageBalance(address _user, uint256 microUSDs) public;

    function mortgageeBalanceOf(address _user) public view returns (uint256);

    function addMortgegee(
        address user,
        uint256 microUSDs,
        uint256 maxMortgage,
        address newMortgagee
    ) public returns (address);
    function mortgagePayment(
        address user,
        address mortgageAddress,
        uint256 marketPriceMills,
        uint256 paymentInMills
    ) public returns (uint256);
    function clearAllMortgage(address user, address mortgageAddress)
        public
        returns (uint256);

    function bidMortgaged(
        address _user,
        address mortgageRequestAddress,
        address stoneCoinAddress,
        uint64 downPaymentMicros,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool successeded, uint256 available);

    function askMortgaged(
        address user,
        address mortgageAddress,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool);
    function createTradeMortgage(
        uint64 key,
        address _stoneCoinAddress,
        address _buyer,
        address _seller,
        address _buyerMortgage,
        address _sellerMortgage,
        uint256 _amount,
        uint256 _price
    ) public;
    function applyMortgageClearance(address mortgageAddress) public;

    function tradeMortgaged(uint64 key) public;

    function transferMortgageBalance(
        address _buyer,
        uint256 _value,
        address mortgageAddress,
        address stoneCoinAddress
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
}
