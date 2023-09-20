pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract MortgageInt {
    function payed() public;
    function cleared() public;
    function setCornerStoneBase(address _cornerStoneBase) public;
    function defaulted() public;
    function externalDefaulted() public;

    function externalCleared() public;

    function getDefaultStatus() public view returns (uint64 defaults);
    function clearance(uint256 _value) public;

    function applyClearances() public returns (uint256 _totalToClear);

    function getMortgagee() public view returns (address);
    function getTotalClearances() public view returns (uint256);

    function getRefinanceSum() public view returns (uint256);
    function shouldRefinance() public view returns (bool);

    function isMortgageRegistered() public view returns (bool);
    function isExternalMortgage() public view returns (bool);

    function getLastPayedIndex() public view returns (uint256);

    function getStoneCoinAddress() public view returns (address);
    function getNextPaymentIndex() public view returns (uint256);

    function getBuyer() public view returns (address);

    function getLoanValue() public view returns (uint256);

    function getMortgageMaxLoan() public view returns (uint256);

    function getDownPayment() public view returns (uint256);

    function getNextPayment() public view returns (uint256);
    function getRemainingLoanBalance() public view returns (uint256);
    function getScheduledMonthlyPayment() public view returns (uint256);

    function getDownPaymentPercentMill() public view returns (uint256);

    function setMortgageRegistrar(bytes32 url, bytes32 urlMd5) public;

}
