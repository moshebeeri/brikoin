pragma solidity ^0.4.0;

contract BrokerManagerInt {
    function addBroker(address user, address organization) public;

    function setBrokerFees(
        address user,
        uint256 firstDealRatio,
        uint256 otherDealRatio,
        uint256 secondaryFee,
        address organization
    ) public;
    function addUserToBroker(address user, address broker, address organization)
        public;

    function getUserAssignmentDate(address user, address organization)
        public
        view
        returns (uint256);

    function getBrokerUsers(address broker, address organization)
        public
        view
        returns (address[]);
    function payBroker(
        address broker,
        uint256 payment,
        address organization,
        address stoneCoinAddress
    ) public;
    function getBrokerPayments(
        address broker,
        address organization,
        address stoneCoinAddress
    ) public view returns (uint256);
    function getBrokerFirstDealRatio(address broker, address organization)
        public
        view
        returns (uint256);

    function getBrokerOtherDealRatio(address broker, address organization)
        public
        view
        returns (uint256);
    function getBrokerHistoryLength(
        address broker,
        address user,
        address organization
    ) public view returns (uint256);

    function getBrokerHistoryFee(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256);
    function getBrokerHistoryTime(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256);
    function getBrokerHistoryAmount(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256);

    function getBrokerHistoryBuyingPrice(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256);

    function getBrokerHistoryProject(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (address);

    function checkBroker(address user, address stoneCoinAddress)
        public
        view
        returns (address);
    function getBrokerFee(address user, address stoneCoinAddress)
        public
        view
        returns (uint256);
    function addBrokerHistory(
        address stoneCoinAddress,
        address broker,
        address user,
        uint256 amount,
        uint256 buyingPrice,
        uint256 feeRatio
    ) public;

}
