pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/MortgageRequest.sol";
import "../structures/MortgageeCondition.sol";
import "../Mortgagee.sol";
import "../interfaces/Ownables.sol";

contract MortgageFactory is Ownables {
    using SafeMath for uint256;
    mapping(address => bool) mortgageRequests;
    mapping(address => address) mortgagees;
    mapping(address => address) lastMortgageRequestsAddress;
    mapping(address => mapping(address => address)) lastMortgageeConditionsAddress;
    mapping(address => address) lastMortgageAddress;

    mapping(address => bool) mortgageeConditions;

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
    function createMortgagee(
        address user,
        uint256 _maxMortgage,
        bytes32 name,
        bytes32 mortgageeType,
        bytes32 _city,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _businessIdentifier
    ) public returns (address) {
        Mortgagee newContract = new Mortgagee(
            user,
            _maxMortgage,
            name,
            mortgageeType,
            _city,
            _country,
            _address1,
            _businessIdentifier
        );
        mortgagees[user] = address(newContract);
        emit MortgageeCreated(address(newContract));
        return address(newContract);
    }

    function mortgageeAddress(address _user) public view returns (address) {
        return mortgagees[_user];
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

    function createMortgage(
        address _mortgageeAddress,
        address _stoneCoinAddress,
        address _mortgageRequestAddress,
        address _mortgageeConditionAddress
    ) public returns (address) {
        MortgageRequest mortgageRequest = MortgageRequest(
            _mortgageRequestAddress
        );
        require(
            mortgageRequest.getMortgageCondition() == _mortgageeConditionAddress
        );
        MortgageeCondition mortgageCondition = MortgageeCondition(
            _mortgageeConditionAddress
        );
        require(mortgageCondition.isActive());
        require(mortgageRequests[_mortgageRequestAddress] == false);
        Mortgage mortgage = new Mortgage(
            _stoneCoinAddress,
            _mortgageeAddress,
            mortgageRequest.getRequester(),
            _mortgageRequestAddress,
            _mortgageeConditionAddress,
            false
        );
        mortgageRequests[_mortgageRequestAddress] = true;
        lastMortgageAddress[msg.sender] = address(mortgage);
        emit MortgageCreated(
            mortgage,
            _stoneCoinAddress,
            _mortgageeAddress,
            mortgageRequest.getRequester(),
            _mortgageRequestAddress,
            _mortgageeConditionAddress
        );
        return address(mortgage);
    }

    function addPaymentSchedule(
        address _mortgageAddress,
        uint64 _index,
        uint64 _interestRate,
        uint64 _scheduledMonthlyPayment,
        uint64 _interest,
        uint256 _principal,
        uint256 _principalTotal,
        uint256 _propertyTax,
        uint256 _paymentTotal,
        uint64 _paymentTimestamp,
        uint256 _remainingLoanBalance,
        uint64 _loanMonth,
        uint64 _loanYear
    ) public onlyOwner {
        Mortgage mortgage = Mortgage(_mortgageAddress);
        mortgage.addPaymentSchedule(
            _index,
            _interestRate,
            _scheduledMonthlyPayment,
            _interest,
            _principal,
            _principalTotal,
            _propertyTax,
            _paymentTotal,
            _paymentTimestamp,
            _remainingLoanBalance,
            _loanMonth,
            _loanYear
        );
        emit MortgagePaymentCreated(_mortgageAddress);
    }
}
