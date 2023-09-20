pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/CornerStoneBaseStorageInt.sol";

contract CornerStoneBaseStorage is Ownables, CornerStoneBaseStorageInt {
    using SafeMath for uint256;
    bytes32 name = "MicroUSDollar"; //10^(−6) Dollar
    bytes32 symbol = "MicroUSD";
    uint256 INITIAL_SUPPLY = 18446744073709551615;
    mapping(address => uint256) balances;
    mapping(address => bool) public mortgageOperatorRoles;
    mapping(address => bool) public feeManagerRoles;
    mapping(address => bool) public tokenApproveRoles;
    mapping(address => bool) public mortgageFinanceRoles;
    mapping(address => mapping(address => uint256)) reservedBalances;
    mapping(address => uint256) pendingWithdrawals;

    function getName() public view returns (bytes32) {
        return name;
    }
    function getSymbol() public view returns (bytes32) {
        return symbol;
    }

    function getInitialSupply() public view returns (uint256) {
        return INITIAL_SUPPLY;
    }

    function setUserBalance(address user, uint256 balance) public onlyOwner {
        balances[user] = balance;
    }
    function getUserBalance(address user)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return balances[user];
    }
    function setUserReservedBalance(
        address user,
        address stoneCoinAddress,
        uint256 balance
    ) public onlyOwner {
        reservedBalances[user][stoneCoinAddress] = balance;
    }
    function getUserReservedBalance(address user, address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return reservedBalances[user][stoneCoinAddress];
    }
    function setUserPendingBalance(address user, uint256 balance)
        public
        onlyOwner
    {
        pendingWithdrawals[user] = balance;
    }
    function getUserPendingBalance(address user)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return pendingWithdrawals[user];
    }

    function setMortgageOperatorRoles(address user, bool approveRole)
        public
        onlyOwner
    {
        mortgageOperatorRoles[user] = approveRole;
    }
    function getMortgageOperatorRoles(address user)
        public
        view
        onlyOwner
        returns (bool)
    {
        return mortgageOperatorRoles[user];
    }

    function setFeeManagerRoles(address user, bool approveRole)
        public
        onlyOwner
    {
        feeManagerRoles[user] = approveRole;
    }
    function getFeeManagerRoles(address user)
        public
        view
        onlyOwner
        returns (bool)
    {
        return feeManagerRoles[user];
    }
    function setTokenApproveRoles(address user, bool approveRole)
        public
        onlyOwner
    {
        tokenApproveRoles[user] = approveRole;
    }
    function getTokenApproveRoles(address user)
        public
        view
        onlyOwner
        returns (bool)
    {
        return tokenApproveRoles[user];
    }

    function setMortgageFinanceRoles(address user, bool approveRole)
        public
        onlyOwner
    {
        mortgageFinanceRoles[user] = approveRole;
    }

    function getMortgageFinanceRoles(address user)
        public
        view
        onlyOwner
        returns (bool)
    {
        return mortgageFinanceRoles[user];
    }

}
