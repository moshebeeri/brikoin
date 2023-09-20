pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";

contract MortgageeCondition is Ownables {
    using SafeMath for uint256;
    using SafeMath for uint64;

    bool public active;
    bool public automaticApproval;
    address public mortgagee;
    address public stoneCoinAddress;
    uint256 public maxLoanMicros;
    uint64 public interestRateMilliPercent;
    uint64 public fixedInterestRateMilliPercent;
    uint64 public downPaymentMilliPercent;
    uint64 public maxLoanTermMonths;
    uint64 public adjustFixedRateMonths;
    uint64 public adjustInitialCap25;
    uint64 public adjustPeriodicCap25;
    uint64 public adjustLifetimeCa;

    constructor(
        address _mortgagee,
        bool _automaticApproval,
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
    ) public Ownables() {
        active = true;
        automaticApproval = _automaticApproval;
        mortgagee = _mortgagee;
        stoneCoinAddress = _stoneCoinAddress;
        maxLoanMicros = _maxLoanMicros;
        fixedInterestRateMilliPercent = _fixedInterestRateMilliPercent;
        interestRateMilliPercent = _interestRateMilliPercent;
        downPaymentMilliPercent = _downPaymentMilliPercent;
        maxLoanTermMonths = _loanTermMonths;
        adjustFixedRateMonths = _adjustFixedRateMonths;
        adjustInitialCap25 = _adjustInitialCap25;
        adjustPeriodicCap25 = _adjustPeriodicCap25;
        adjustLifetimeCa = _adjustLifetimeCap;
    }

    function disable() public onlyOwner {
        active = false;
    }

    function activate() public onlyOwner {
        active = true;
    }

    function getStoneCoinAddress() public view returns (address) {
        return stoneCoinAddress;
    }
    function getInterestRateMilliPercent() public view returns (address) {
        return interestRateMilliPercent;
    }

    function getGixedInterestRateMilliPercent() public view returns (address) {
        return fixedInterestRateMilliPercent;
    }

    function getMaxLoanMicros() public view returns (uint256) {
        return maxLoanMicros;
    }

    function getMaxLoanTermMonths() public view returns (uint256) {
        return maxLoanTermMonths;
    }

    function getMortgagee() public view returns (address) {
        return mortgagee;
    }
    function isAutomaticApproval() public view returns (bool) {
        return automaticApproval;
    }
    function isActive() public view returns (bool) {
        return active;
    }
}
