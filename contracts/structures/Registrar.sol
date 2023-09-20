pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Registrar is Ownable {
    using SafeMath for uint256;

    bytes32 name;
    bytes32 licenseNumber;
    bytes32 country;
    bytes32 address1;
    bytes32 address2;
    bytes32 phoneNumber;
    bytes32 faxNumber;
    bytes32 email;
    bytes32 url;

    constructor(
        bytes32 _name,
        bytes32 _licenseNumber,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _address2,
        bytes32 _phoneNumber,
        bytes32 _faxNumber,
        bytes32 _email,
        bytes32 _url
    ) public Ownable() {
        //        require(_name.length != 0);
        //        require(_licenseNumber.length != 0);
        //        require(_country.length != 0);
        //        require(_address1.length != 0);
        //        require(_address2.length != 0);
        //        require(_url.length != 0);

        name = _name;
        licenseNumber = _licenseNumber;
        country = _country;
        address1 = _address1;
        address2 = _address2;
        phoneNumber = _phoneNumber;
        faxNumber = _faxNumber;
        email = _email;
        url = _url;
    }
}
