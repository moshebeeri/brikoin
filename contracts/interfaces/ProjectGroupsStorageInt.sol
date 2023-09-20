pragma solidity ^0.4.24;

contract ProjectGroupsStorageInt {
    function addMember(address member) public;

    function removeMember(address member) public;

    function addMemberOffer(address member, uint256 offer) public;

    function getMemberOffer(address member) public view returns (uint256);

    function setOfferStatus(address member, string status) public;

    function getOfferStatus(address member) public returns (string);

    function inviteMember(address member) public;

    function isInvited(address member) public view returns (bool);

    function isMember(address member) public view returns (bool);

    function getMembers() public view returns (address[]);

    function addMemberDebt(address user, uint256 debt) public;

    function getMemberDebt(address user) public returns (uint256);

    function subMemberDebt(address user, uint256 debt) public;
}
