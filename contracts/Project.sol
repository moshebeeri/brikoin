pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Project {
    bytes32 public name = "project";

    constructor(bytes32 _name) public {
        name = _name;
    }

    function setName(bytes32 _name) public {
        name = _name;
    }

    function getName() public view returns (bytes32) {
        return name;
    }
}
