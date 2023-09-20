pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/MortgageRequest.sol";
import "../structures/MortgageeCondition.sol";
import "../Mortgagee.sol";
import "../interfaces/Ownables.sol";

contract MortgageRequestFactory is Ownables {
    using SafeMath for uint256;
    mapping(address => bool) mortgageRequests;
    mapping(address => address) mortgagees;
    mapping(address => address) lastMortgageRequestsAddress;
    mapping(address => mapping(address => address)) lastMortgageeConditionsAddress;
    mapping(address => address) lastMortgageAddress;

    mapping(address => bool) mortgageeConditions;

    address lastMortgageConditionTest;
    event MortgageRequestCreated(address mortgageRequest);

    event MortgageeConditionCreated(address mortgageeCondition);

    event MortgageeCreated(address mortgageeAddress);
    event MortgagePaymentCreated(address mortgageAddress);

    event MortgageeAdded(
        address newMortgagee,
        uint256 microUSDs,
        uint256 maxMortgage
    );
    event MortgageeAddFunds(
        address newMortgagee,
        uint256 microUSDs,
        uint256 maxMortgage
    );
    event MortgageCreated(
        address mortgage,
        address stoneCoin,
        address mortgagee,
        address requester,
        address mortgageRequest,
        address mortgageeCondition
    );

    constructor() public Ownables() {}
    function mortgageeAddress(address _user) public view returns (address) {
        return mortgagees[_user];
    }

    function getLastMortgageConditionTest() public view returns (address) {
        return lastMortgageConditionTest;
    }

    function lastMortgageCondition(address _user, address _stoneCoin)
        public
        view
        returns (address)
    {
        return lastMortgageeConditionsAddress[_user][_stoneCoin];
    }

    function lastMortgageRequest(address _user) public view returns (address) {
        return lastMortgageRequestsAddress[_user];
    }

    function lastMortgage(address _user) public view returns (address) {
        return lastMortgageAddress[_user];
    }

    function createMortgageeCondition(
        bool automaticApproval,
        address _stoneCoinAddress,
        uint256 _maxLoanMicros,
        uint64 _interestRateMilliPercent,
        uint64 _fixedInterestRateMilliPercent,
        uint64 _downPaymentMilliPercent,
        uint64 _loanTermMonths,
        uint64 _adjustFixedRateMonths,
        uint64 _adjustInitialCap25,
        uint64 _adjustPeriodicCap25,
        uint64 _adjustLifetimeCap
    ) public returns (address) {
        MortgageeCondition newContract = new MortgageeCondition(
            msg.sender,
            automaticApproval,
            _stoneCoinAddress,
            _maxLoanMicros,
            _interestRateMilliPercent,
            _fixedInterestRateMilliPercent,
            _downPaymentMilliPercent,
            _loanTermMonths,
            _adjustFixedRateMonths,
            _adjustInitialCap25,
            _adjustPeriodicCap25,
            _adjustLifetimeCap
        );
        newContract.addOwnership(msg.sender);
        emit MortgageeConditionCreated(address(newContract));
        lastMortgageConditionTest = address(newContract);
        return address(newContract);
    }

    function createMortgageRequest(
        address user,
        address _stoneCoin,
        address _mortgageCondition,
        uint256 _totalPayment,
        uint256 _downPayment,
        uint256 _longTermMonth,
        uint256 _downPaymentPercentMill,
        address _mortgagee
    ) public returns (address) {
        MortgageRequest newContract = new MortgageRequest(
            user,
            _stoneCoin,
            _mortgageCondition,
            _totalPayment,
            _downPayment,
            _downPaymentPercentMill,
            _longTermMonth,
            _mortgagee,
            false
        );
        lastMortgageRequestsAddress[user] = address(newContract);
        emit MortgageRequestCreated(address(newContract));
        return address(newContract);
    }

    function createExternalMortgageRequest(
        address user,
        address _stoneCoin,
        uint256 _totalPayment,
        uint256 _downPayment,
        uint256 _longTermMonth,
        uint256 _downPaymentPercentMill,
        address _mortgagee
    ) public returns (address) {
        MortgageRequest newContract = new MortgageRequest(
            user,
            _stoneCoin,
            0,
            _totalPayment,
            _downPayment,
            _downPaymentPercentMill,
            _longTermMonth,
            _mortgagee,
            true
        );
        lastMortgageRequestsAddress[user] = address(newContract);
        emit MortgageRequestCreated(address(newContract));
        return address(newContract);
    }

    function approveByAdmin(address _mortgageRequestAddress)
        public
        onlyOwner
        returns (bool)
    {
        MortgageRequest mortgageRequest = MortgageRequest(
            _mortgageRequestAddress
        );
        mortgageRequest.approveByAdmin();
    }

    function cancelMortgageCondition(address _mortgageCondition)
        public
        returns (bool)
    {
        MortgageeCondition mortgageCondition = MortgageeCondition(
            _mortgageCondition
        );
        require(mortgageCondition.getMortgagee() == msg.sender);
        mortgageCondition.disable();
        return mortgageCondition.isActive();
    }

}
