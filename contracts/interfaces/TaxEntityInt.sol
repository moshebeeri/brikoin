pragma solidity ^0.4.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
contract TaxEntityInt {
    function setName(bytes32 _name) public;

    function getName() public view returns (bytes32);

    function setTax(address user, address stoneCoinAddress, uint256 tax) public;
    function getTax(address user, address stoneCoinAddress)
        public
        view
        returns (uint256);

}
