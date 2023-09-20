pragma solidity ^0.4.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
contract TransactionTaxesInt {
    function addBuyerTaxes(address taxEntity) public;
    function getBuyerTaxEntitiesLength() public view returns (uint256);
    function getBuyerTaxEntity(uint256 index) public view returns (address);
    function addSelleTaxes(address taxEntity) public;
    function getSellerTaxEntitiesLength() public view returns (uint256);
    function getSellerTaxEntity(uint256 index) public view returns (address);
    function getStoneCoinAddress() public view returns (address);

}
