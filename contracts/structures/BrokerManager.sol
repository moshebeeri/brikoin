pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/BrokerManagerInt.sol";
import "../interfaces/Ownables.sol";
import "../StoneCoin.sol";
contract BrokerManager is Ownables, BrokerManagerInt {
    using SafeMath for uint256;
    struct BrokerHistory {
        uint256 time;
        uint256 amount;
        uint256 fee;
        uint256 buyingPrice;
        address stoneCoinAddress;
    }
    struct BrokerFee {
        uint256 firstDealFee;
        uint256 otherDealFee;
        uint256 secondaryFee;
        bool oneTime;
        uint256 upToo;
    }
    mapping(address => mapping(address => address[])) public brokerToUsers;
    mapping(address => mapping(address => address)) public userToBroker;
    mapping(address => mapping(address => bool)) public isBroker;
    mapping(address => mapping(address => mapping(address => uint256))) public brokerToPayment;
    mapping(address => mapping(address => BrokerFee)) public brokerFeesPolicy;
    mapping(address => mapping(address => uint256)) public userAssignmentDate;
    mapping(address => mapping(address => mapping(address => BrokerHistory[]))) public brokerUserFeesHistory;

    constructor() public Ownables() {}

    function addBroker(address user, address organization) public onlyOwner {
        isBroker[organization][user] = true;
        brokerFeesPolicy[organization][user].firstDealFee = 20;
        brokerFeesPolicy[organization][user].otherDealFee = 10;
        brokerFeesPolicy[organization][user].secondaryFee = 0;
        brokerFeesPolicy[organization][user].oneTime = false;
    }

    function setBrokerFees(
        address user,
        uint256 firstDealRatio,
        uint256 otherDealRatio,
        uint256 secondaryFee,
        address organization
    ) public onlyOwner {
        require(isBroker[organization][user]);
        brokerFeesPolicy[organization][user].firstDealFee = firstDealRatio;
        brokerFeesPolicy[organization][user].otherDealFee = otherDealRatio;
        brokerFeesPolicy[organization][user].secondaryFee = secondaryFee;
    }

    function addUserToBroker(address user, address broker, address organization)
        public
        onlyOwner
    {
        require(isBroker[organization][broker]);
        require(userToBroker[organization][user] == address(0));
        userToBroker[organization][user] = broker;
        brokerToUsers[organization][broker].push(user);
        userAssignmentDate[organization][user] = now;
    }

    function getUserAssignmentDate(address user, address organization)
        public
        view
        returns (uint256)
    {
        return userAssignmentDate[organization][user];
    }

    function getBrokerUsers(address broker, address organization)
        public
        view
        returns (address[])
    {
        return brokerToUsers[organization][broker];
    }

    function payBroker(
        address broker,
        uint256 payment,
        address organization,
        address stoneCoinAddress
    ) public onlyOwner {
        require(isBroker[organization][broker]);
        brokerToPayment[organization][broker][stoneCoinAddress] = brokerToPayment[organization][broker][stoneCoinAddress]
            .add(payment);
    }

    function getBrokerPayments(
        address broker,
        address organization,
        address stoneCoinAddress
    ) public view returns (uint256) {
        require(isBroker[organization][broker]);
        return brokerToPayment[organization][broker][stoneCoinAddress];
    }
    function getBrokerFirstDealRatio(address broker, address organization)
        public
        view
        returns (uint256)
    {
        require(isBroker[organization][broker]);
        return brokerFeesPolicy[organization][broker].firstDealFee;
    }

    function getBrokerOtherDealRatio(address broker, address organization)
        public
        view
        returns (uint256)
    {
        require(isBroker[organization][broker]);
        return brokerFeesPolicy[organization][broker].otherDealFee;
    }

    function getBrokerHistoryLength(
        address broker,
        address user,
        address organization
    ) public view returns (uint256) {
        return brokerUserFeesHistory[organization][broker][user].length;
    }

    function getBrokerHistoryFee(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256) {
        require(
            brokerUserFeesHistory[organization][broker][user].length > index
        );
        return brokerUserFeesHistory[organization][broker][user][index].fee;
    }

    function getBrokerHistoryTime(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256) {
        require(
            brokerUserFeesHistory[organization][broker][user].length > index
        );
        return brokerUserFeesHistory[organization][broker][user][index].time;
    }

    function getBrokerHistoryAmount(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256) {
        require(
            brokerUserFeesHistory[organization][broker][user].length > index
        );
        return brokerUserFeesHistory[organization][broker][user][index].amount;
    }

    function getBrokerHistoryBuyingPrice(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (uint256) {
        require(
            brokerUserFeesHistory[organization][broker][user].length > index
        );
        return
            brokerUserFeesHistory[organization][broker][user][index]
                .buyingPrice;
    }

    function getBrokerHistoryProject(
        address broker,
        address user,
        uint256 index,
        address organization
    ) public view returns (address) {
        require(
            brokerUserFeesHistory[organization][broker][user].length > index
        );
        return
            brokerUserFeesHistory[organization][broker][user][index]
                .stoneCoinAddress;
    }

    function checkBroker(address user, address stoneCoinAddress)
        public
        view
        returns (address)
    {
        StoneCoin stoneCoinContract = StoneCoin(stoneCoinAddress);
        return userToBroker[stoneCoinContract.getOrganization()][user];
    }

    function getBrokerFee(address user, address stoneCoinAddress)
        public
        view
        returns (uint256)
    {
        StoneCoin stoneCoinContract = StoneCoin(stoneCoinAddress);
        address broker = userToBroker[stoneCoinContract
            .getOrganization()][user];
        if (address(0) == broker) {
            return 0;
        }

        if (!stoneCoinContract.isInitialOffering()) {
            return
                brokerFeesPolicy[stoneCoinContract.getOrganization()][broker]
                    .secondaryFee;
        }
        if (
            brokerUserFeesHistory[stoneCoinContract
                .getOrganization()][broker][user]
                .length ==
            0
        ) {
            return
                brokerFeesPolicy[stoneCoinContract.getOrganization()][broker]
                    .firstDealFee;
        }
        return
            brokerFeesPolicy[stoneCoinContract.getOrganization()][broker]
                .otherDealFee;

    }

    function addBrokerHistory(
        address stoneCoinAddress,
        address broker,
        address user,
        uint256 amount,
        uint256 buyingPrice,
        uint256 feeRatio
    ) public onlyOwner {
        StoneCoin stoneCoinContract = StoneCoin(stoneCoinAddress);
        BrokerHistory memory history;
        history.time = now;
        history.amount = amount;
        history.fee = amount.mul(buyingPrice).mul(feeRatio).div(1000);
        history.buyingPrice = buyingPrice;
        history.stoneCoinAddress = stoneCoinAddress;
        brokerUserFeesHistory[stoneCoinContract.getOrganization()][broker][user]
            .push(history);
    }

}
