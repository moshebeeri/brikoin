pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./StoneCoin.sol";
import "./AssetManager.sol";
import "./interfaces/ProjectGroupsStorageInt.sol";
import "./interfaces/ProjectGroupsVotingStorageInt.sol";
import "./interfaces/Ownables.sol";

contract ProjectGroups is Ownables {
    using SafeMath for uint256;
    bool isOpen;
    address creator;
    address stoneCoinAddress;
    address projectGroupsStorageAddress;
    address projectGroupsVotingStorageAddress;

    constructor(address _stoneCoinAddress, address _creator, bool _isOpen)
        public
        Ownables()
    {
        stoneCoinAddress = _stoneCoinAddress;
        creator = _creator;
        isOpen = _isOpen;

    }

    function init() public onlyOwner {
        ProjectGroupsStorageInt(projectGroupsStorageAddress).addMember(creator);
        ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
            .setVotingMember(creator, true);

    }

    function setProjectGroupsStorage(address _projectGroupsStorageAddress)
        public
        onlyOwner
    {
        projectGroupsStorageAddress = _projectGroupsStorageAddress;
    }

    function setProjectGroupsVotingStorage(
        address _projectGroupsVotingStorageAddress
    ) public onlyOwner {
        projectGroupsVotingStorageAddress = _projectGroupsVotingStorageAddress;
    }

    function joinGroup() public {
        require(
            ProjectGroupsStorageInt(projectGroupsStorageAddress).isInvited(
                msg.sender
            ) ||
                isOpen
        );
        ProjectGroupsStorageInt(projectGroupsStorageAddress).addMember(
            msg.sender
        );
    }

    function getMembers() public view returns (address[]) {
        return
            ProjectGroupsStorageInt(projectGroupsStorageAddress).getMembers();
    }

    function leaveGroup() public {
        ProjectGroupsStorageInt(projectGroupsStorageAddress).removeMember(
            msg.sender
        );
    }

    function inviteMember(address member) public {
        require(msg.sender == creator);
        ProjectGroupsStorageInt(projectGroupsStorageAddress).inviteMember(
            member
        );
    }

    function setOffer(uint256 amount) public {
        require(
            ProjectGroupsStorageInt(projectGroupsStorageAddress).isMember(
                msg.sender
            )
        );
        ProjectGroupsStorageInt(projectGroupsStorageAddress).addMemberOffer(
            msg.sender,
            amount
        );
    }

    function getOffer() public view returns (uint256) {
        require(
            ProjectGroupsStorageInt(projectGroupsStorageAddress).isMember(
                msg.sender
            )
        );
        return
            ProjectGroupsStorageInt(projectGroupsStorageAddress).getMemberOffer(
                msg.sender
            );
    }

    function vote(string documentMd5, bool status) public {
        require(
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .isVotingMember(msg.sender)
        );
        ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress).vote(
            documentMd5,
            msg.sender,
            status
        );
    }

    function isVotingMember() public view returns (bool) {
        return
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .isVotingMember(msg.sender);
    }

    function getVotingResult(string documentMd5) public view returns (uint256) {
        return
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .getVotingResult(documentMd5);
    }

    function getNumberOfVoters(string documentMd5)
        public
        view
        returns (uint256)
    {
        return
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .getNumberOfVoters(documentMd5);
    }

    function getVotingPositiveResult(string documentMd5)
        public
        view
        returns (uint256)
    {
        return
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .getVotingPositiveResult(documentMd5);
    }

    function getCreator() public view returns (address) {
        return creator;
    }

    function getProjectAddress() public view returns (address) {
        return stoneCoinAddress;
    }

    function isGroupOpen() public view returns (bool) {
        return isOpen;
    }

    function addGroupRepresentation(address member) public {
        require(isTrustee(msg.sender));
        ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
            .addGroupRepresentation(member);
    }

    function paymentStatus(address user, uint256 amount, bool add) public {
        require(isTrustee(msg.sender));
        if (add) {
            ProjectGroupsStorageInt(projectGroupsStorageAddress).addMemberDebt(
                user,
                amount
            );
        } else {
            ProjectGroupsStorageInt(projectGroupsStorageAddress).subMemberDebt(
                user,
                amount
            );
        }

        uint256 debt = ProjectGroupsStorageInt(projectGroupsStorageAddress)
            .getMemberDebt(user);
        if (debt > 0) {
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .setVotingMember(user, false);
        } else {
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .setVotingMember(user, true);
        }
    }

    function isTrustee(address user) private view returns (bool) {
        address assetManager = StoneCoin(stoneCoinAddress).assetManager();
        address trustee = AssetManager(assetManager).getOfficial("TRUSTEE");
        return trustee == user;
    }

    function setVotingType(string documentMd5, string votingType)
        public
        onlyOwner
    {
        ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
            .setVotingType(documentMd5, votingType);
    }

    function getVotingType(string documentMd5) public view returns (string) {
        return
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .getVotingType(documentMd5);
    }

    function getGroupRepresentation() public view returns (address[]) {
        return
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .getGroupRepresentation();
    }

    function isGroupRepresentative(address member) public view returns (bool) {
        return
            ProjectGroupsVotingStorageInt(projectGroupsVotingStorageAddress)
                .isGroupRepresentative(member);
    }

}
