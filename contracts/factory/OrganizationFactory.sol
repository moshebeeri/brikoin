pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Organization.sol";

contract OrganizationFactory is Ownable {
    using SafeMath for uint256;
    event OrganizationContractCreated(address Asset);
    mapping(uint256 => address) keyToContractAddress;
    function createOrganization(
        bytes32 _name,
        bytes32 _phoneNumber,
        bytes32 _email,
        uint256 key
    ) public onlyOwner returns (address) {
        Organization newContract = new Organization(
            _name,
            _phoneNumber,
            _email
        );
        emit OrganizationContractCreated(address(newContract));
        keyToContractAddress[key] = address(newContract);
        return address(newContract);
    }

    function getContractAddress(uint256 key) public view returns (address) {
        return keyToContractAddress[key];
    }

}
