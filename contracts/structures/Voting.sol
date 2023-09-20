pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../StoneCoin.sol";

contract Voting is Ownable {
    using SafeMath for uint256;
    event VoteOCreated(address stoneCoinAddress);
    event VoteOptionAdded(bytes32 _url, bytes32 _md5);

    struct Vote {
        bool voted;
        address user;
        uint256 listPointer;
        uint256 voteOption;
    }

    struct VoteOption {
        bytes32 url;
        bytes32 urlMD5;
        uint256 index;
        uint256 totalVotingUnits;
    }

    bytes32 public url;
    uint256 public dueDate;
    bytes32 public urlMD5;
    address public stoneCoinAddress;

    address[] public voters;
    uint256 public options;
    mapping(address => Vote) public votes;
    mapping(uint256 => VoteOption) public voteOptions;
    event Voted(address by, uint256 result, uint256 holdings);

    constructor(
        address _stoneCoinAddress,
        bytes32 _url,
        bytes32 _urlMD5,
        uint256 _dueDate
    ) public Ownable() {
        require(_url.length != 0);
        require(_urlMD5.length != 0);
        require(_dueDate > now);
        url = _url;
        urlMD5 = _urlMD5;
        dueDate = _dueDate;
        stoneCoinAddress = _stoneCoinAddress;
        emit VoteOCreated(_stoneCoinAddress);
    }

    function isVoted(address _user) public constant returns (bool isIndeed) {
        StoneCoin stoneCoinContract = StoneCoin(stoneCoinAddress);
        require(stoneCoinContract.isHolder(_user));
        if (voters.length == 0) return false;
        return (voters[votes[_user].listPointer] == _user);
    }

    function getVoteOption(uint256 optionIndex) public view returns (bytes32) {
        require(optionIndex < options);
        return voteOptions[optionIndex].url;
    }
    function getVoteOptionMd5(uint256 optionIndex)
        public
        view
        returns (bytes32)
    {
        require(optionIndex < options);
        return voteOptions[optionIndex].urlMD5;
    }

    function getVotesCount() public constant returns (uint256) {
        return voters.length;
    }

    function addVoteOptions(bytes32 _url, bytes32 _md5)
        public
        onlyOwner
        returns (bool success)
    {
        uint256 voteIndex = options;
        options = options.add(1);
        voteOptions[voteIndex].index = voteIndex;
        voteOptions[voteIndex].url = _url;
        voteOptions[voteIndex].urlMD5 = _md5;
        voteOptions[voteIndex].totalVotingUnits = 0;
        emit VoteOptionAdded(_url, _md5);
        return true;
    }

    function vote(address user, uint256 voteOption)
        public
        onlyOwner
        returns (bool success)
    {
        StoneCoin stoneCoinContract = StoneCoin(stoneCoinAddress);
        require(stoneCoinContract.isHolder(user));
        require(dueDate > now);
        require(voteOption < options);
        require(votes[user].voted == false);
        votes[user].listPointer = voters.push(user) - 1;
        votes[user].user = msg.sender;
        votes[user].voted = true;
        votes[user].voteOption = voteOption;
        uint256 holdings = stoneCoinContract.balanceOf(user);
        voteOptions[voteOption].totalVotingUnits = voteOptions[voteOption]
            .totalVotingUnits
            .add(holdings);
        emit Voted(user, voteOption, holdings);
        return true;
    }

    function voteResult() public view returns (uint256) {
        require(voters.length > 0);
        uint256 optionIndex = 0;
        uint256 optionVotes = 0;

        for (uint256 i = 0; i < voters.length; i++) {
            if (voteOptions[i].totalVotingUnits >= optionVotes) {
                optionIndex = i;
                optionVotes = voteOptions[i].totalVotingUnits;
            }

        }
        return optionIndex;
    }

    function getTotalVotingUnits(uint256 voteOption)
        public
        view
        returns (uint256 totalVotingUnits)
    {
        require(voteOption < options);
        return voteOptions[voteOption].totalVotingUnits;
    }

    function isEnded() public view returns (bool option) {
        return dueDate < now;
    }

    function getNow() public view returns (uint256) {
        return now;
    }

    function getDueDate() public view returns (uint256) {
        return dueDate;
    }
}
