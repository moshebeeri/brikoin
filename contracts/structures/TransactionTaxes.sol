pragma solidity ^0.4.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/TransactionTaxesInt.sol";
contract TransactionTaxes is Ownables, TransactionTaxesInt {
    using SafeMath for uint256;
    address[] sellerTaxes;
    address[] buyerTaxes;
    address stoneCoinAddress;

    constructor(address _stoneCoinAddress) public Ownables() {
        stoneCoinAddress = _stoneCoinAddress;
    }

    function addBuyerTaxes(address taxEntity) public onlyOwner {
        buyerTaxes.push(taxEntity);
    }

    function getBuyerTaxEntitiesLength() public view returns (uint256) {
        return buyerTaxes.length;
    }
    function getBuyerTaxEntity(uint256 index) public view returns (address) {
        return buyerTaxes[index];
    }

    function addSelleTaxes(address taxEntity) public onlyOwner {
        sellerTaxes.push(taxEntity);
    }

    function getSellerTaxEntitiesLength() public view returns (uint256) {
        return sellerTaxes.length;
    }
    function getStoneCoinAddress() public view returns (address) {
        return stoneCoinAddress;
    }
    function getSellerTaxEntity(uint256 index) public view returns (address) {
        return sellerTaxes[index];
    }

}
