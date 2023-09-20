pragma solidity ^0.4.0;

contract CornerTransactionInt {
    function addTransaction(
        address user,
        bool add,
        uint256 transaction,
        address stoneCoinAddress,
        string codeDescription
    ) public;

    function setTransactionManager(address user) public;

    function getTransactionsLength(address user) public view returns (uint256);

    function getTransactionsTime(address user, uint256 index)
        public
        view
        returns (uint256);
    function getTransaction(address user, uint256 index)
        public
        view
        returns (uint256);

    function getTransactionsStoneCoin(address user, uint256 index)
        public
        view
        returns (address);

    function isAddTransaction(address user, uint256 index)
        public
        view
        returns (bool);

}
