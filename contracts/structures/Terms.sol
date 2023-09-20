pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Terms is Ownable {
    using SafeMath for uint256;

    bytes32 name;
    bytes32 holdingYears;
    bytes32 sellPercentage;
    bytes32 rental;
    bytes32 url;
    bytes32 urlMD5;

    constructor(
        bytes32 _name,
        bytes32 _holdingYears,
        bytes32 _sellPercentage,
        bytes32 _rental,
        bytes32 _url,
        bytes32 _urlMD5
    ) public Ownable() {
        //        require(_name.length != 0);
        //        require(_holdingYears.length != 0);
        //        require(_sellPercentage.length != 0);
        //        require(_rental.length != 0);
        //        require(_address2.length != 0);
        //        require(_contactFirstName.length != 0);
        //        require(_contactSecondName.length != 0);
        //        require(_phoneNumber.length != 0);
        //        require(_email.length != 0);
        //        require(_url.length != 0);
        //        require(_urlMD5.length != 0);

        name = _name;
        holdingYears = _holdingYears;
        sellPercentage = _sellPercentage;
        rental = _rental;
        url = _url;
        urlMD5 = _urlMD5;
    }
}
