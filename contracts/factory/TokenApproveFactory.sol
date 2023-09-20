pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/TokenApproveContract.sol";

contract TokenApproveFactory is Ownable {
    using SafeMath for uint256;
    event TokenApproveContractCreated(address Asset);
    mapping(uint256 => address) keyToContractAddress;
    function createTokenApprove(
        address _baseCornerContractAddress,
        address _stoneCoinAddress,
        address _fromUser,
        address _toUser,
        uint256 _units,
        uint256 key
    ) public onlyOwner returns (address) {
        TokenApproveContract newContract = new TokenApproveContract(
            _baseCornerContractAddress,
            _stoneCoinAddress,
            _fromUser,
            _toUser,
            _units
        );
        emit TokenApproveContractCreated(address(newContract));
        keyToContractAddress[key] = address(newContract);
        return address(newContract);
    }

    function getContractAddress(uint256 key) public view returns (address) {
        return keyToContractAddress[key];
    }

}
