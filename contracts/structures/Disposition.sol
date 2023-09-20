pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/DispositionInt.sol";
import "../interfaces/Ownables.sol";

contract Disposition is Ownables, DispositionInt {
    using SafeMath for uint256;

    mapping(address => bool) public users;
    mapping(address => bool) public projects;

    constructor() public Ownables() {}

    function checkUserDisposition(address _user)
        public
        constant
        returns (bool isIndeed)
    {
        if (users[_user]) {
            return false;
        }
        return true;
    }

    function checkProjectDisposition(address _stoneCoin)
        public
        constant
        returns (bool isIndeed)
    {
        if (projects[_stoneCoin]) {
            return false;
        }
        return true;
    }

    function setUserDisposition(address _user, bool state)
        public
        onlyOwner
        returns (bool success)
    {
        users[_user] = state;
        return true;
    }

    function setProjectDisposition(address _project, bool state)
        public
        onlyOwner
        returns (bool success)
    {
        projects[_project] = state;
        return true;
    }
}
