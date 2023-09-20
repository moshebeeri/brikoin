pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/ProjectGroupsVotingStorageInt.sol";
import "../interfaces/ProjectGroupsStorageInt.sol";

contract ProjectGroupsVotingStorage is Ownables, ProjectGroupsVotingStorageInt {
    using SafeMath for uint256;
    address projectGroupsStorageAddress;
    mapping(address => bool) groupRepresented;
    address[] groupRepresentedArray;
    mapping(address => bool) votingMembers;
    mapping(string => mapping(address => bool)) memberVoted;
    mapping(string => uint256) votingMembersCount;
    mapping(string => uint256) positiveVotingMembers;
    mapping(string => uint256) memberVotingResult;
    mapping(string => string) votingType;
    constructor() public Ownables() {}

    function setVotingType(string documentMd5, string _votingType)
        public
        onlyOwner
    {
        votingType[documentMd5] = _votingType;
    }

    function getVotingType(string documentMd5) public view returns (string) {
        return votingType[documentMd5];
    }

    function addGroupRepresentation(address member) public onlyOwner {
        groupRepresentedArray.push(member);
        groupRepresented[member] = true;

    }

    function isGroupRepresentative(address member)
        public
        view
        onlyOwner
        returns (bool)
    {
        return groupRepresented[member];
    }

    function setProjectGroupStorageAddress(address _projectGroupsStorageAddress)
        public
        onlyOwner
    {
        projectGroupsStorageAddress = _projectGroupsStorageAddress;
    }

    function isVotingMember(address member)
        public
        view
        onlyOwner
        returns (bool)
    {
        return votingMembers[member];
    }

    function setVotingMember(address member, bool status) public onlyOwner {
        votingMembers[member] = status;
    }

    function getVotingPositiveResult(string documentMd5)
        public
        view
        returns (uint256)
    {
        return positiveVotingMembers[documentMd5];
    }

    function getNumberOfVoters(string documentMd5)
        public
        view
        returns (uint256)
    {
        return votingMembersCount[documentMd5];
    }

    function vote(string documentMd5, address member, bool status)
        public
        onlyOwner
    {
        require(!memberVoted[documentMd5][member]);
        votingMembersCount[documentMd5] = votingMembersCount[documentMd5] + 1;

        if (status) {
            positiveVotingMembers[documentMd5] =
                positiveVotingMembers[documentMd5] +
                1;
            memberVotingResult[documentMd5] =
                memberVotingResult[documentMd5] +
                ProjectGroupsStorageInt(projectGroupsStorageAddress)
                    .getMemberOffer(member);
        }
        memberVoted[documentMd5][member] = true;
    }

    function isVoted(string documentMd5, address member)
        public
        view
        onlyOwner
        returns (bool)
    {
        return memberVoted[documentMd5][member];
    }

    function getVotingResult(string subject)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return memberVotingResult[subject];
    }

    function getGroupRepresentation()
        public
        view
        onlyOwner
        returns (address[])
    {
        return groupRepresentedArray;
    }

}
