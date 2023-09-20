pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoinInt {
    function setStoneCoinMortgageAddress(address _stoneCoinMortgageAddress)
        public;

    function setStoneCoinStorageAddress(address _stoneCoinStorageAddress)
        public;
    function init() public;
    function getOwnerTokens() public view returns (uint256);
    function STONES() public view returns (uint256);

    function isHolder(address holder) public view returns (bool);
    function setTransferFree() public;

    function setTransferFreeWithContract() public;

    function getHolderByIndex(uint256 i) public view returns (address);
    function getHoldersCount() public view returns (uint256);
    function isInitialOffering() public view returns (bool);
    function isSignDocument() public view returns (bool);
    function getOrganization() public view returns (address);
    function newHolder(address holder, uint256 units) public returns (bool);

    function updateHoldings(address holder, uint256 units)
        public
        returns (bool);
    function deleteHolder(address holder) public returns (bool);

    function transferTokenFrom(
        address _from,
        address _to,
        uint256 _units,
        address contractAddress
    ) public returns (bool);

    function buy(address buyer, uint256 units) public;

    function sell(address seller, uint256 units) public;

    function clearMortgage(address user, address _mortgageAddress) public;

    function partlyForfeitureMortgage(
        address user,
        address mortgagee,
        address _mortgageAddress,
        uint256 _marketPriceMills,
        bool maxDefaulted
    ) public;

    function buyMortgaged(address mortgageAddress, address buyer, uint256 units)
        public;

    function getBalance(address user) public view returns (uint256);

    function sellMortgaged(
        address mortgageAddress,
        address seller,
        uint256 amount
    ) public;
    function getOwnerBalance() public view returns (uint256 balance);
    function balanceOf(address _user) public view returns (uint256);

    function getMinBulkSize() external view returns (uint256);
    function getMaxBulkSize() external view returns (uint256);
    function dilutionStoneCoin(uint256 dilutionUnits) public;

    function setMinBulkSize(uint256 bulkSize) public;
    function setOrganization(address _organization) public;

    function addDocument(bytes32 _url, bytes32 _urlMD5) public;

    function getDocumentsLength() external view returns (uint256);
    function getReservedPrice() public view returns (uint256);
    function forecloseTokens(
        address _user,
        address mortgageAddress,
        address _to,
        bool sale
    ) public;

}
