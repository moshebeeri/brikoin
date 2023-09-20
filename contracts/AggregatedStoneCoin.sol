pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./StoneCoin.sol";

//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract AggregatedStoneCoins is Ownable {
    using SafeMath for uint256;

    address[] public stoneCoins;

    bytes32[] public url;
    bytes32[] public urlMD5;

    bytes32 public name = "StoneCoinAGR";
    bytes32 public symbol = "STC";
    address public assetManager;
    uint256 public startTimestamp; // timestamp after which ICO will start
    uint256 public durationSeconds = 16 * 7 * 24 * 60 * 60; // 16 weeks
    address public organization = 0;
    address public contractOwner;

    // This is the constructor whose code is
    // run only when the contract is created.
    constructor(
        bytes32 _name,
        bytes32 _symbol,
        uint256 _startTimestamp,
        uint256 _durationSeconds,
        address _assetManager,
        address _organization,
        address _contractOwner
    ) public Ownable() {
        name = _name;
        symbol = _symbol;
        startTimestamp = _startTimestamp;
        durationSeconds = _durationSeconds;
        assetManager = _assetManager;
        owner = msg.sender;
        organization = _organization;
        contractOwner = _contractOwner;
    }

    function addDocument(bytes32 _url, bytes32 _urlMD5) public {
        require(msg.sender == contractOwner);
        url.push(_url);
        urlMD5.push(_urlMD5);
    }

    function addStoneCoin(address stoneCoin) public {
        require(msg.sender == contractOwner);
        stoneCoins.push(stoneCoin);
    }

    function getDocumentsLength() external view returns (uint256) {
        return urlMD5.length;
    }

    function getStoneCoinsProjects() external view returns (uint256) {
        return stoneCoins.length;
    }

}
