pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/types.sol";

contract Trustee is Ownable {
    using SafeMath for uint256;

    bytes32 name;
    Types.TrusteeType trusteeType;
    bytes32 licenseNumber;
    bytes32 country;
    bytes32 address1;
    bytes32 address2;
    bytes32 contactFirstName;
    bytes32 contactSecondName;
    bytes32 phoneNumber;
    bytes32 email;
    bytes32 url;
    mapping(address => bool) public valid;
    bytes32 urlMD5;

    constructor(
        bytes32 _name,
        Types.TrusteeType _trusteeType,
        bytes32 _licenseNumber,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _address2,
        bytes32 _contactFirstName,
        bytes32 _contactSecondName,
        bytes32 _phoneNumber,
        bytes32 _email,
        bytes32 _url,
        bytes32 _urlMD5
    ) public Ownable() {
        name = _name;
        trusteeType = _trusteeType;
        licenseNumber = _licenseNumber;
        country = _country;
        address1 = _address1;
        address2 = _address2;
        contactFirstName = _contactFirstName;
        contactSecondName = _contactSecondName;
        phoneNumber = _phoneNumber;
        email = _email;
        url = _url;
        urlMD5 = _urlMD5;
    }

    function remove(address _stoneCoinAddress) public onlyOwner {
        valid[_stoneCoinAddress] = false;
    }

}
