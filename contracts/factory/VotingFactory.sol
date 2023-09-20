pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Voting.sol";

contract VotingFactory is Ownable {
    event VotingCreated(address Voting);

    function createVoting(
        address _stoneCoinAddress,
        bytes32 _url,
        bytes32 _urlMD5,
        uint256 _dueDate
    ) public returns (address) {
        Voting newContract = new Voting(
            _stoneCoinAddress,
            _urlMD5,
            _url,
            _dueDate
        );
        emit VotingCreated(address(newContract));
        return address(newContract);
    }

    function addVoteOptions(address voting, bytes32 _url, bytes32 _md5)
        public
        onlyOwner
        returns (bool)
    {
        Voting votingContract = Voting(voting);
        return votingContract.addVoteOptions(_url, _md5);
    }

    function isVoted(address voting) public constant returns (bool success) {
        Voting votingContract = Voting(voting);
        return votingContract.isVoted(msg.sender);
    }
    function vote(address voting, uint256 voteOption)
        public
        returns (bool success)
    {
        Voting votingContract = Voting(voting);
        return votingContract.vote(msg.sender, voteOption);
    }

    function voteResult(address voting) public view returns (uint256) {
        Voting votingContract = Voting(voting);
        return votingContract.voteResult();
    }

    function getTotalVotingUnits(address voting, uint256 optionIndex)
        public
        view
        returns (uint256)
    {
        Voting votingContract = Voting(voting);
        return votingContract.getTotalVotingUnits(optionIndex);
    }

    function isEnded(address voting) public view returns (bool) {
        Voting votingContract = Voting(voting);
        return votingContract.isEnded();
    }

    function getVoteOption(address voting, uint256 optionIndex)
        public
        view
        returns (bytes32)
    {
        Voting votingContract = Voting(voting);
        return votingContract.getVoteOption(optionIndex);
    }
    function getVoteOptionMd5(address voting, uint256 optionIndex)
        public
        view
        returns (bytes32)
    {
        Voting votingContract = Voting(voting);
        return votingContract.getVoteOptionMd5(optionIndex);
    }

    function getDueDate(address voting) public view returns (uint256) {
        Voting votingContract = Voting(voting);
        return votingContract.getDueDate();
    }
    function getNow(address voting) public view returns (uint256) {
        Voting votingContract = Voting(voting);
        return votingContract.getNow();
    }

}
