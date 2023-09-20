pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../StoneCoin.sol";
import "../CornerStoneBase.sol";

contract TokenApproveContract is Ownable {
    using SafeMath for uint256;
    address public fromUser;
    address public toUser;
    address public stoneCoinAddress;
    address baseCornerContractAddress;
    bool public isApproved;
    uint256 public units;

    constructor(
        address _baseCornerContractAddress,
        address _stoneCoinAddress,
        address _fromUser,
        address _toUser,
        uint256 _units
    ) public Ownable() {
        baseCornerContractAddress = _baseCornerContractAddress;
        stoneCoinAddress = _stoneCoinAddress;
        fromUser = _fromUser;
        toUser = _toUser;
        units = _units;
    }

    function approveContract() public {
        CornerStoneBase cornerStone = CornerStoneBase(
            baseCornerContractAddress
        );
        require(cornerStone.isTokenApproveRole(msg.sender));
        isApproved = true;
    }

}
