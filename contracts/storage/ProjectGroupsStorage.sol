pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/ProjectGroupsStorageInt.sol";

contract ProjectGroupsStorage is Ownables, ProjectGroupsStorageInt {
    using SafeMath for uint256;
    mapping(address => bool) members;
    mapping(address => uint256) membersIndex;
    mapping(address => uint256) membersDebt;
    mapping(address => bool) invitedMembers;
    address[] membersArray;
    mapping(string => mapping(address => bool)) memberVoted;
    mapping(address => uint256) membersOffer;
    mapping(address => string) offerStatus;
    constructor() public Ownables() {}

    function addMember(address member) public onlyOwner {
        members[member] = true;
        membersIndex[member] = membersArray.length;
        membersArray.push(member);
    }

    function isMember(address member) public view onlyOwner returns (bool) {
        return members[member];
    }

    function inviteMember(address member) public onlyOwner {
        invitedMembers[member] = true;
    }

    function isInvited(address member) public view onlyOwner returns (bool) {
        return invitedMembers[member];
    }

    function removeMember(address member) public onlyOwner {
        members[member] = false;
        membersArray = remove(membersArray, membersIndex[member]);
    }

    function addMemberOffer(address member, uint256 offer) public onlyOwner {
        require(members[member]);
        membersOffer[member] = offer;
    }

    function getMemberOffer(address member)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return membersOffer[member];
    }

    function getMembers() public view returns (address[]) {
        return membersArray;
    }

    function setOfferStatus(address member, string status) public onlyOwner {
        require(members[member]);
        offerStatus[member] = status;
    }

    function getOfferStatus(address member) public onlyOwner returns (string) {
        return offerStatus[member];
    }

    function addMemberDebt(address user, uint256 debt) public onlyOwner {
        membersDebt[user] = membersDebt[user] + debt;
    }

    function getMemberDebt(address user) public onlyOwner returns (uint256) {
        return membersDebt[user];
    }

    function subMemberDebt(address user, uint256 debt) public onlyOwner {
        if (membersDebt[user] < debt) {
            membersDebt[user] = 0;
        } else {
            membersDebt[user] = membersDebt[user] - debt;
        }
    }

    function remove(address[] array, uint256 index)
        internal
        pure
        returns (address[] value)
    {
        if (index >= array.length) return;

        address[] memory arrayNew = new address[](array.length - 1);
        for (uint256 i = 0; i < arrayNew.length; i++) {
            if (i != index && i < index) {
                arrayNew[i] = array[i];
            } else {
                arrayNew[i] = array[i + 1];
            }
        }
        delete array;
        return arrayNew;
    }

}
