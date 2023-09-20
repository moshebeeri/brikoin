pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./MortgageeCondition.sol";
import "../interfaces/MortgageRequestInt.sol";

contract MortgageRequest is Ownable, MortgageRequestInt {
    using SafeMath for uint256;

    bool public valid;
    bool public approved;
    bool public isExternal;
    address public approvedByMortgage;
    address public mortgageCondition;
    address public requester;
    address public stoneCoin;
    address public mortgagee;
    uint256 public downPayment;
    uint256 public totalPayment;
    uint256 public longTermMonth;
    uint256 public downPaymentPercentMill;

    constructor(
        address _requester,
        address _stoneCoin,
        address _mortgageCondition,
        uint256 _totalPayment,
        uint256 _downPayment,
        uint256 _downPaymentPercentMill,
        uint256 _longTermMonth,
        address _mortgagee,
        bool _isExternal
    ) public Ownable() {
        valid = true;
        mortgageCondition = _mortgageCondition;
        requester = _requester;
        stoneCoin = _stoneCoin;
        mortgagee = _mortgagee;
        downPayment = _downPayment;
        totalPayment = _totalPayment;
        longTermMonth = _longTermMonth;
        downPaymentPercentMill = _downPaymentPercentMill;
        approved = false;
        isExternal = _isExternal;
    }

    function approveByAdmin() public onlyOwner {
        require(validateContract());
        MortgageeCondition mortgageConditionContract = MortgageeCondition(
            mortgageCondition
        );
        require(mortgageConditionContract.isAutomaticApproval());
        approved = true;
    }
    function approve() public {
        require(msg.sender == mortgagee);
        require(validateContract());
        require(isEnabled());
        approved = true;
    }

    function validateContract() public view returns (bool) {
        if (isExternal) {
            return true;
        }
        MortgageeCondition mortgageConditionContract = MortgageeCondition(
            mortgageCondition
        );
        return
            mortgageConditionContract.getStoneCoinAddress() == stoneCoin &&
            mortgageConditionContract.getMortgagee() == mortgagee;
    }

    function disable() public onlyOwner {
        valid = false;
    }

    function enable() public onlyOwner {
        valid = true;
    }

    function isEnabled() public view returns (bool) {
        return valid;
    }

    function isApproved() public view returns (bool) {
        return approved;
    }

    function getRequester() public view returns (address) {
        return requester;
    }
    function getMortgageCondition() public view returns (address) {
        return mortgageCondition;
    }

    function getMortgagee() public view returns (address) {
        return mortgagee;
    }

    function getTotalLoan() public view returns (uint256) {
        return totalPayment;
    }
    function getLongTermMonth() public view returns (uint256) {
        return longTermMonth;
    }

    function getDownPayment() public view returns (uint256) {
        return downPayment;
    }
    function getDownPaymentPercentMill() public view returns (uint256) {
        return downPaymentPercentMill;
    }

    function getMortgageApprove() public view returns (address) {
        return approvedByMortgage;
    }

}
