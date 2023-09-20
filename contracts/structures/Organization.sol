pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Organization is Ownable {
    using SafeMath for uint256;

    bytes32 public name;
    bytes32 public phoneNumber;
    bytes32 public email;

    constructor(bytes32 _Name, bytes32 _phoneNumber, bytes32 _email)
        public
        Ownable()
    {
        name = _Name;
        phoneNumber = _phoneNumber;
        email = _email;
    }
}
