pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/StoneCoinStorageInt.sol";
//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoinStorage is Ownables, StoneCoinStorageInt {
    using SafeMath for uint256;
    struct Holding {
        bool valid;
        uint256 units;
        uint256 listPointer;
    }
    uint256 STONES = 0;
    mapping(address => Holding) holdings;
    address[] holders;

    function addHolder(address holder) public onlyOwner returns (uint256) {
        return holders.push(holder);
    }

    function deleteHolder(address holder) public onlyOwner returns (bool) {
        uint256 rowToDelete = holdings[holder].listPointer;
        address keyToMove = holders[holders.length - 1];
        holders[rowToDelete] = keyToMove;
        holdings[keyToMove].listPointer = rowToDelete;
        holders.length--;
        return true;
    }
    function getHolder(uint256 index) public view returns (address) {
        return holders[index];
    }
    function getHoldersLength() public view returns (uint256) {
        return holders.length;
    }

    function getStones() public view returns (uint256) {
        return STONES;
    }
    function addStones(uint256 stones) public onlyOwner {
        STONES = STONES.add(stones);
    }

    function removeStones(uint256 stones) public onlyOwner {
        STONES = STONES.sub(stones);
    }

    function getHoldingsUnits(address _user) public view returns (uint256) {
        return holdings[_user].units;
    }

    function setHoldingsUnits(address _user, uint256 units) public onlyOwner {
        holdings[_user].units = units;
    }
    function getHoldersIndex(address _user) public view returns (uint256) {
        return holdings[_user].listPointer;
    }

    function setHoldersIndex(address _user, uint256 listPointer)
        public
        onlyOwner
    {
        holdings[_user].listPointer = listPointer;
    }

    function isValid(address _user) public view returns (bool) {
        return holdings[_user].valid;
    }

    function setValid(address _user, bool valid) public onlyOwner {
        holdings[_user].valid = valid;
    }
}
