pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Manager is Ownable {
    using SafeMath for uint256;

    bytes32 name;
    bytes32 country;
    bytes32 address1;
    bytes32 address2;
    bytes32 contactFirstName;
    bytes32 contactSecondName;
    bytes32 phoneNumber;
    bytes32 email;
    bytes32 url;
    bytes32 urlMD5;

    constructor(
        bytes32 _name,
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
        //        require(_name.length != 0);
        //        require(_country.length != 0);
        //        require(_address1.length != 0);
        //        require(_address2.length != 0);
        //        require(_contactFirstName.length != 0);
        //        require(_contactSecondName.length != 0);
        //        require(_phoneNumber.length != 0);
        //        require(_email.length != 0);
        //        require(_url.length != 0);
        //        require(_urlMD5.length != 0);

        name = _name;
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
}
