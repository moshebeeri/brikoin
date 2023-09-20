pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./interfaces/Ownables.sol";
import "./interfaces/CornerTransactionInt.sol";

contract CornerTransaction is Ownables, CornerTransactionInt {
    using SafeMath for uint256;
    struct Transaction {
        uint256 time;
        bool add;
        uint256 transaction;
        address stoneCoinAddress;
        string codeDescription;
    }

    mapping(address => Transaction[]) public userToTransactions;
    mapping(address => bool) public transactionsManager;
    mapping(address => mapping(address => bool)) public notFirstTransaction;
    constructor() public Ownables() {}
    function addTransaction(
        address user,
        bool add,
        uint256 transaction,
        address stoneCoinAddress,
        string codeDescription
    ) public onlyOwner {
        if (stoneCoinAddress != 0) {
            Transaction memory userTransaction;
            if (!notFirstTransaction[user][stoneCoinAddress] && !add) {
                userTransaction.time = now;
                userTransaction.add = true;
                userTransaction.codeDescription = codeDescription;
                userTransaction.stoneCoinAddress = stoneCoinAddress;
                userTransaction.transaction = transaction;
                userToTransactions[user].push(userTransaction);

            }
            userTransaction.time = now;
            userTransaction.add = add;
            userTransaction.stoneCoinAddress = stoneCoinAddress;
            userTransaction.codeDescription = codeDescription;
            userTransaction.transaction = transaction;
            userToTransactions[user].push(userTransaction);
            notFirstTransaction[user][stoneCoinAddress] = true;
        }

    }

    function setTransactionManager(address user) public onlyOwner {
        transactionsManager[user] = true;
    }

    function getTransactionsLength(address user) public view returns (uint256) {
        require(transactionsManager[msg.sender]);
        return userToTransactions[user].length;
    }

    function getTransactionsTime(address user, uint256 index)
        public
        view
        returns (uint256)
    {
        require(transactionsManager[msg.sender]);
        return userToTransactions[user][index].time;

    }

    function getTransaction(address user, uint256 index)
        public
        view
        returns (uint256)
    {
        require(transactionsManager[msg.sender]);
        return userToTransactions[user][index].transaction;

    }

    function getTransactionDescription(address user, uint256 index)
        public
        view
        returns (string)
    {
        require(transactionsManager[msg.sender]);
        return userToTransactions[user][index].codeDescription;

    }

    function getTransactionsStoneCoin(address user, uint256 index)
        public
        view
        returns (address)
    {
        require(transactionsManager[msg.sender]);
        return userToTransactions[user][index].stoneCoinAddress;

    }

    function isAddTransaction(address user, uint256 index)
        public
        view
        returns (bool)
    {
        require(transactionsManager[msg.sender]);
        return userToTransactions[user][index].add;

    }

}
