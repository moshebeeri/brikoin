pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";

contract CornerStoneBaseStorageInt {
    using SafeMath for uint256;
    bytes32 name = "MicroUSDollar"; //10^(−6) Dollar
    bytes32 symbol = "MicroUSD";
    uint256 INITIAL_SUPPLY = 18446744073709551615;
    mapping(address => uint256) balances;
    mapping(address => bool) public mortgageOperatorRoles;
    mapping(address => bool) public feeManagerRoles;
    mapping(address => bool) public tokenApproveRoles;
    mapping(address => bool) public mortgageFinanceRoles;
    mapping(address => uint256) pendingWithdrawals;

    function setUserReservedBalance(
        address user,
        address stoneCoinAddress,
        uint256 balance
    ) public;
    function getUserReservedBalance(address user, address stoneCoinAddress)
        public
        view
        returns (uint256);
    function getName() public view returns (bytes32);
    function getSymbol() public view returns (bytes32);
    function getInitialSupply() public view returns (uint256);

    function setUserBalance(address user, uint256 balance) public;
    function getUserBalance(address user) public view returns (uint256);
    function setUserPendingBalance(address user, uint256 balance) public;
    function getUserPendingBalance(address user) public view returns (uint256);
    function setMortgageOperatorRoles(address user, bool approveRole) public;
    function getMortgageOperatorRoles(address user) public view returns (bool);

    function setFeeManagerRoles(address user, bool approveRole) public;
    function getFeeManagerRoles(address user) public view returns (bool);
    function setTokenApproveRoles(address user, bool approveRole) public;
    function getTokenApproveRoles(address user) public view returns (bool);

    function setMortgageFinanceRoles(address user, bool approveRole) public;
    function getMortgageFinanceRoles(address user) public view returns (bool);

}
