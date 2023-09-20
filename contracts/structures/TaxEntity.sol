pragma solidity ^0.4.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/TaxEntityInt.sol";

contract TaxEntity is Ownables, TaxEntityInt {
    using SafeMath for uint256;
    mapping(address => mapping(address => uint256)) taxes;
    bytes32 name;

    constructor() public Ownables() {}

    function setName(bytes32 _name) public onlyOwner {
        name = _name;
    }

    function getName() public view returns (bytes32) {
        return name;
    }

    function setTax(address user, address stoneCoinAddress, uint256 tax)
        public
        onlyOwner
    {
        taxes[user][stoneCoinAddress] = tax;
    }

    function getTax(address user, address stoneCoinAddress)
        public
        view
        returns (uint256)
    {
        return taxes[user][stoneCoinAddress];
    }

}
