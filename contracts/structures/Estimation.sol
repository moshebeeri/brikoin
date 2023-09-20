pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Estimation is Ownable {
    using SafeMath for uint256;

    uint256 public price;
    bytes32 public currency;
    uint256 public timestamp;
    bytes32 public rental;
    uint256 public expectedYield; //in tenth of percent units
    bytes32 public estimatorName;
    bytes32 public estimatorFirstName;
    bytes32 public estimatorSecondName;
    bytes32 public phoneNumber;
    bytes32 public email;
    bytes32 public url; //pdf
    bytes32 public urlMD5;

    constructor(
        uint256 _price,
        bytes32 _currency,
        uint256 _timestamp,
        bytes32 _rental,
        uint256 _expectedYield,
        bytes32 _estimatorName,
        bytes32 _estimatorFirstName,
        bytes32 _estimatorSecondName,
        bytes32 _phoneNumber,
        bytes32 _email,
        bytes32 _url,
        bytes32 _urlMD5
    ) public Ownable() {
        require(_price > 0);
        require(_currency.length != 0);
        require(_timestamp > 0);
        require(_rental.length != 0);
        require(_expectedYield > 0);
        require(_estimatorName.length != 0);
        require(_estimatorFirstName.length != 0);
        require(_estimatorSecondName.length != 0);
        require(_phoneNumber.length != 0);
        require(_email.length != 0);
        require(_url.length != 0);
        require(_urlMD5.length != 0);

        price = _price;
        currency = _currency;
        timestamp = _timestamp;
        rental = _rental;
        expectedYield = _expectedYield;
        estimatorName = _estimatorName;
        estimatorFirstName = _estimatorFirstName;
        estimatorSecondName = _estimatorSecondName;
        phoneNumber = _phoneNumber;
        email = _email;
        url = _url;
        urlMD5 = _urlMD5;
    }
}
