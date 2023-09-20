pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract MortgageRequestInt {
    function approveByAdmin() public;
    function approve() public;

    function validateContract() public view returns (bool);

    function disable() public;

    function enable() public;

    function isEnabled() public view returns (bool);

    function isApproved() public view returns (bool);
    function getRequester() public view returns (address);
    function getMortgageCondition() public view returns (address);

    function getMortgagee() public view returns (address);

    function getTotalLoan() public view returns (uint256);
    function getLongTermMonth() public view returns (uint256);
    function getDownPayment() public view returns (uint256);
    function getDownPaymentPercentMill() public view returns (uint256);

    function getMortgageApprove() public view returns (address);

}
