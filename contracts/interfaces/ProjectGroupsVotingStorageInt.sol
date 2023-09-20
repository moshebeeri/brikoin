pragma solidity ^0.4.24;

contract ProjectGroupsVotingStorageInt {
    function addGroupRepresentation(address member) public;

    function isGroupRepresentative(address member) public view returns (bool);

    function isVotingMember(address member) public view returns (bool);

    function setVotingMember(address member, bool status) public;

    function vote(string documentMd5, address member, bool status) public;

    function setVotingType(string documentMd5, string votingType) public;

    function getVotingType(string documentMd5) public view returns (string);

    function isVoted(string documentMd5, address member)
        public
        view
        returns (bool);

    function getVotingResult(string subject) public view returns (uint256);

    function getVotingPositiveResult(string subject)
        public
        view
        returns (uint256);

    function getNumberOfVoters(string subject) public view returns (uint256);

    function getGroupRepresentation() public view returns (address[]);

    function setProjectGroupStorageAddress(address _projectGroupsStorageAddress)
        public;

}
