pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../AggregatedStoneCoin.sol";

contract AggregateStoneCoinFactory is Ownable {
    using SafeMath for uint256;
    event AggregatedStoneCoinsCreated(address Aggregator);
    mapping(uint256 => address) keyToContractAddress;
    function createAggregateStoneCoins(
        bytes32 _name,
        bytes32 _symbol,
        uint256 _startTimestamp,
        uint256 _durationSeconds,
        address _assetManager,
        address _organization,
        uint256 key
    ) public onlyOwner returns (address) {
        AggregatedStoneCoins newContract = new AggregatedStoneCoins(
            _name,
            _symbol,
            _startTimestamp,
            _durationSeconds,
            _assetManager,
            _organization,
            msg.sender
        );
        emit AggregatedStoneCoinsCreated(address(newContract));
        keyToContractAddress[key] = address(newContract);
        return address(newContract);
    }

    function getContractAddress(uint256 key) public view returns (address) {
        return keyToContractAddress[key];
    }

}
