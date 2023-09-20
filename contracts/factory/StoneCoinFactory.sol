pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../StoneCoin.sol";

contract StoneCoinFactory is Ownable {
    mapping(address => bytes32) public stoneCoinContracts;
    mapping(address => bool) public stoneCoinContractsRoles;
    event StoneCoinRoleCreated(address stoneCoin);
    event StoneCoinCreated(address stoneCoin);
    address public _stoneCoin;
    bytes32 version;

    modifier onlyStoneCoinRole() {
        require(
            stoneCoinContractsRoles[msg.sender] == true || owner == msg.sender
        );
        _;
    }

    function addStoneCoinRole(address _stoneCoinAddress) public onlyOwner {
        require(stoneCoinContractsRoles[_stoneCoinAddress] != true);
        stoneCoinContractsRoles[_stoneCoinAddress] = true;
        emit StoneCoinRoleCreated(_stoneCoinAddress);
    }
}
