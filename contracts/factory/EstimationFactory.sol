pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Estimation.sol";

contract EstimationFactory is Ownable {
    using SafeMath for uint256;
    mapping(address => bool) estimators;
    event EstimatorCreated(address estimator);
    event EstimationCreated(address estimation);
    address public _estimator;

    modifier onlyEstimator() {
        require(estimators[msg.sender] == true || owner == msg.sender);
        _;
    }

    function createEstimation(
        uint256 _price,
        bytes32 _currency,
        uint256 _timestamp,
        bytes32 _rental,
        uint256 _expectedYield,
        bytes32 _estimatorName,
        bytes32 _estimatorFirstName,
        bytes32 _estimatorSecondName,
        bytes32 _phoneNumber,
        bytes32 _email,
        bytes32 _url,
        bytes32 _urlMD5
    ) public onlyEstimator returns (address) {
        Estimation newContract = new Estimation(
            _price,
            _currency,
            _timestamp,
            _rental,
            _expectedYield,
            _estimatorName,
            _estimatorFirstName,
            _estimatorSecondName,
            _phoneNumber,
            _email,
            _url,
            _urlMD5
        );
        emit EstimationCreated(address(newContract));
        return address(newContract);
    }

    function addEstimator(address newEstimator) public onlyOwner {
        require(estimators[newEstimator] != true);
        estimators[newEstimator] = true;
        emit EstimatorCreated(newEstimator);
    }
}
