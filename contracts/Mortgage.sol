pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./structures/MortgageRequest.sol";
import "./structures/MortgageeCondition.sol";
import "./CornerStoneBase.sol";
import "./StoneCoin.sol";
import "./interfaces/MortgageInt.sol";

contract Mortgage is Ownables, MortgageInt {
    using SafeMath for uint64;
    using SafeMath for uint256;
    bool externalMortgage;
    address stoneCoinAddress;
    address mortgagee;
    address buyer;
    address mortgageRequest;
    address mortgageeCondition;
    address cornerStoneBase;
    address[] mortgageOwners;
    uint256 nextPayment;
    uint256 lastPayedIndex;
    uint256 lastValidClearance;
    bool shouldReFinance;
    bool mortgageCleared;
    bytes32 urlMortgageRegistrar;
    bytes32 urlMD5MortgageRegistrar;
    bool mortgageRegistered;
    uint256 totalClearances;
    uint256 refinanceSum;

    struct PaymentSchedule {
        bool valid;
        bool payed;
        bool defaulted;
        uint64 index;
        uint64 interestRate;
        uint64 scheduledMonthlyPayment;
        uint64 interest;
        uint256 principal;
        uint256 extra;
        uint256 propertyTax;
        uint256 paymentTotal;
        uint64 paymentTimestamp;
        uint256 remainingLoanBalance;
        uint64 loanMonth;
        uint256 principalTotal;
        uint64 loanYear;
    }

    struct MortgageTerms {
        bool valid;
        bool allPaymentAreSet;
        uint64 nextIndex;
        uint256 cleared;
        uint64 defaults;
        PaymentSchedule[] paymentSchedules;
    }

    MortgageTerms mortgageTerms;

    struct Clearance {
        bool shouldApply;
        bool applied;
        uint256 nextIndex;
        uint256 timeStamp;
        uint256 value;
    }

    Clearance[] clearances;

    event PendingClearances(uint256 total);
    event AllPaymentsAreSet(address mortgage);
    event PaymentSet(address mortgage);
    event Default(address mortgage, uint64 loanMonth, uint64 loanYear);
    event MortgageClearance(uint256 nextIndex, uint256 value);
    event ApplyClearances(uint256 value);

    constructor(
        address _stoneCoinAddress,
        address _mortgagee,
        address _buyer,
        address _mortgageRequest,
        address _mortgageeCondition,
        bool _isExternal
    ) public Ownables() {
        stoneCoinAddress = _stoneCoinAddress;
        mortgagee = _mortgagee;
        buyer = _buyer;
        mortgageRequest = _mortgageRequest;
        mortgageeCondition = _mortgageeCondition;
        mortgageTerms.valid = true;
        mortgageTerms.nextIndex = 0;
        mortgageTerms.cleared = 0;
        mortgageTerms.allPaymentAreSet = false;
        shouldReFinance = false;
        nextPayment = 0;
        lastValidClearance = 0;
        mortgageCleared = false;
        mortgageRegistered = false;
        externalMortgage = _isExternal;
        owner = msg.sender;
    }

    function addPaymentSchedule(
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
        MortgageeCondition condition = MortgageeCondition(mortgageeCondition);
        MortgageRequest request = MortgageRequest(mortgageRequest);
        require(_loanMonth <= condition.getMaxLoanTermMonths());
        require(totalClearances == 0);
        require(request.getLongTermMonth() >= _index);
        refinanceSum = 0;
        shouldReFinance = false;
        mortgageTerms.paymentSchedules.push(
            PaymentSchedule({
                valid: true,
                payed: false,
                index: 0,
                defaulted: false,
                interestRate: 0,
                scheduledMonthlyPayment: 0,
                interest: 0,
                principal: 0,
                extra: 0,
                propertyTax: 0,
                principalTotal: 0,
                paymentTotal: 0,
                paymentTimestamp: 0,
                remainingLoanBalance: 0,
                loanMonth: 0,
                loanYear: 0
            })
        );
        mortgageTerms.paymentSchedules[_index].valid = true;
        mortgageTerms.paymentSchedules[_index].index = _index;
        mortgageTerms.paymentSchedules[_index].interestRate = _interestRate;
        mortgageTerms.paymentSchedules[_index]
            .scheduledMonthlyPayment = _scheduledMonthlyPayment;
        mortgageTerms.paymentSchedules[_index].interest = _interest;
        mortgageTerms.paymentSchedules[_index].principal = _principal;
        mortgageTerms.paymentSchedules[_index].principalTotal = _principalTotal;
        mortgageTerms.paymentSchedules[_index].propertyTax = _propertyTax;
        mortgageTerms.paymentSchedules[_index].paymentTotal = _paymentTotal;
        mortgageTerms.paymentSchedules[_index]
            .paymentTimestamp = _paymentTimestamp;
        mortgageTerms.paymentSchedules[_index]
            .remainingLoanBalance = _remainingLoanBalance;
        mortgageTerms.paymentSchedules[_index].loanMonth = _loanMonth;
        mortgageTerms.paymentSchedules[_index].loanYear = _loanYear;

        if (request.getLongTermMonth() == _index + 1) {
            mortgageTerms.allPaymentAreSet = true;
            emit AllPaymentsAreSet(address(this));
        } else {
            emit PaymentSet(address(this));
        }
    }

    function payed() public onlyOwner {
        require(mortgageTerms.paymentSchedules[nextPayment].valid);
        mortgageTerms.paymentSchedules[nextPayment].payed = true;
        lastPayedIndex = nextPayment;
        nextPayment = nextPayment + 1;
        mortgageTerms.defaults = 0;
    }

    function cleared() public onlyOwner {
        mortgageCleared = true;
    }
    function setCornerStoneBase(address _cornerStoneBase) public onlyOwner {
        cornerStoneBase = _cornerStoneBase;
    }

    function defaulted() public onlyOwner {
        if (!externalMortgage) {
            require(
                mortgageTerms.paymentSchedules[mortgageTerms.nextIndex].valid
            );
            mortgageTerms.paymentSchedules[mortgageTerms.nextIndex]
                .defaulted = true;
            lastPayedIndex = nextPayment;
            nextPayment = nextPayment + 1;
        }
        mortgageTerms.defaults = mortgageTerms.defaults + 1;
    }

    function externalDefaulted() public onlyOwner {
        mortgageTerms.defaults = mortgageTerms.defaults + 1;
    }

    function externalCleared() public onlyOwner {
        mortgageCleared = true;
    }

    function getDefaultStatus() public view returns (uint64 defaults) {
        return mortgageTerms.defaults;
    }

    function clearance(uint256 _value) public onlyOwner {
        clearances.push(
            Clearance({
                shouldApply: true,
                applied: false,
                timeStamp: now,
                nextIndex: nextPayment,
                value: _value
            })
        );
        totalClearances = totalClearances.add(_value);
        emit MortgageClearance(nextPayment, _value);
    }

    function applyClearances()
        public
        onlyOwner
        returns (uint256 _totalToClear)
    {
        require(!shouldReFinance);
        PaymentSchedule memory paymentSchedule = mortgageTerms
            .paymentSchedules[nextPayment - 1];
        uint256 remainingLoanBalance = paymentSchedule.remainingLoanBalance;
        if (totalClearances < remainingLoanBalance) {
            shouldReFinance = true;
            refinanceSum = remainingLoanBalance.sub(totalClearances);
        }

        uint256 _value = 0;
        if (lastValidClearance >= 0 && clearances.length > lastValidClearance) {
            for (uint256 i = lastValidClearance; i > clearances.length; i++) {
                clearances[i].applied = true;
                _value = _value.add(clearances[i].value);
                _totalToClear = _totalToClear.add(clearances[i].value);
            }
            lastValidClearance = clearances.length;
            mortgageTerms.cleared = mortgageTerms.cleared.add(_value);
            for (
                i = nextPayment;
                i < mortgageTerms.paymentSchedules.length;
                i++
            ) {
                mortgageTerms.paymentSchedules[i].valid = false;
            }
            totalClearances = 0;
        }
        emit ApplyClearances(_value);
    }

    function getMortgagee() public view returns (address) {
        return mortgagee;
    }
    function getTotalClearances() public view returns (uint256) {
        return totalClearances;
    }

    function getRefinanceSum() public view returns (uint256) {
        return refinanceSum;
    }

    function shouldRefinance() public view returns (bool) {
        return shouldReFinance;
    }

    function isMortgageRegistered() public view returns (bool) {
        return mortgageRegistered;
    }
    function isExternalMortgage() public view returns (bool) {
        return externalMortgage;
    }

    function getLastPayedIndex() public view returns (uint256) {
        return lastPayedIndex;
    }

    function getStoneCoinAddress() public view returns (address) {
        return stoneCoinAddress;
    }

    function getNextPaymentIndex() public view returns (uint256) {
        return nextPayment;
    }

    function getBuyer() public view returns (address) {
        return buyer;
    }

    function getLoanValue() public view returns (uint256) {
        MortgageRequest newContract = MortgageRequest(mortgageRequest);
        return newContract.getTotalLoan();
    }

    function getMortgageMaxLoan() public view returns (uint256) {
        MortgageeCondition newContract = MortgageeCondition(mortgageeCondition);
        return newContract.getMaxLoanMicros();
    }

    function getDownPayment() public view returns (uint256) {
        MortgageRequest newContract = MortgageRequest(mortgageRequest);
        return newContract.getDownPayment();
    }

    function getNextPayment() public view returns (uint256) {
        require(!shouldReFinance);
        PaymentSchedule memory paymentSchedule = mortgageTerms
            .paymentSchedules[nextPayment];

        //require(now >= paymentSchedule.paymentTimestamp);
        uint256 remainingLoanBalance = paymentSchedule.remainingLoanBalance;
        if (totalClearances > remainingLoanBalance) {
            uint256 remainingTotalLoan = remainingLoanBalance.add(
                paymentSchedule.scheduledMonthlyPayment
            );
            return remainingTotalLoan.sub(totalClearances);
        }
        return paymentSchedule.scheduledMonthlyPayment;
    }

    function getRemainingLoanBalance() public view returns (uint256) {
        if (mortgageCleared) {
            return 0;
        }
        if (shouldReFinance) {
            return refinanceSum;
        }

        if (externalMortgage) {
            return getLoanValue();
        }
        PaymentSchedule memory paymentSchedule = mortgageTerms
            .paymentSchedules[nextPayment];
        uint256 result = paymentSchedule.remainingLoanBalance.add(
            paymentSchedule.paymentTotal
        );
        return result.sub(totalClearances);
    }

    function getScheduledMonthlyPayment() public view returns (uint256) {
        PaymentSchedule memory paymentSchedule = mortgageTerms
            .paymentSchedules[mortgageTerms.nextIndex];
        return paymentSchedule.scheduledMonthlyPayment;
    }

    function getDownPaymentPercentMill() public view returns (uint256) {
        MortgageRequest newContract = MortgageRequest(mortgageRequest);
        return newContract.getDownPaymentPercentMill();
    }

    function setMortgageRegistrar(bytes32 url, bytes32 urlMd5) public {
        require(mortgagee == msg.sender);
        urlMortgageRegistrar = url;
        urlMD5MortgageRegistrar = urlMd5;
        mortgageRegistered = true;
    }

}
