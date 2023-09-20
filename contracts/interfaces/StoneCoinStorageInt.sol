pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoinStorageInt {
    function addHolder(address holder) public returns (uint256);

    function getHolder(uint256 index) public view returns (address);

    function getHoldingsUnits(address _user) public view returns (uint256);

    function setHoldingsUnits(address _user, uint256 units) public;
    function getHoldersIndex(address _user) public view returns (uint256);
    function getHoldersLength() public view returns (uint256);
    function setHoldersIndex(address _user, uint256 listPointer) public;

    function isValid(address _user) public view returns (bool);

    function setValid(address _user, bool valid) public;
    function getStones() public view returns (uint256);
    function addStones(uint256 stones) public;
    function removeStones(uint256 stones) public;
    function deleteHolder(address holder) public returns (bool success);

}
