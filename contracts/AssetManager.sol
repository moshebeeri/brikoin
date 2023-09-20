pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./structures/Estimation.sol";
import "./structures/Registrar.sol";
import "./structures/Terms.sol";
import "./structures/Manager.sol";
import "./structures/Property.sol";
import "./structures/Trustee.sol";
import "./interfaces/Ownables.sol";

contract AssetManager is Ownables {
    using SafeMath for uint256;

    address public aggregatedStoneCoins;

    mapping(string => address) projectOfficials;
    mapping(address => string) projectOfficialsRole;
    mapping(string => string) projectDocumentsMd5;

    // This is the constructor whose code is
    // run only when the contract is created.
    constructor() public Ownables() {}

    function getOwner() public view returns (address) {
        return owner;
    }

    function setAggregatedStoneCoins(address _aggregatedStoneCoins)
        public
        onlyOwner
    {
        aggregatedStoneCoins = _aggregatedStoneCoins;
    }

    function addProjectOfficial(string role, address user) public onlyOwner {
        projectOfficials[role] = user;
        projectOfficialsRole[user] = role;
    }

    function addProjectDocument(string role, string md5) public onlyOwner {
        projectDocumentsMd5[role] = md5;
    }

    function getProjectDocument(string role) public view returns (string) {
        return projectDocumentsMd5[role];
    }

    function removeProjectOfficial(string role) public onlyOwner {
        projectOfficials[role] = 0;
    }

    function getOfficial(string role) public view returns (address) {
        return projectOfficials[role];
    }

    function getOfficialRole(address official) public view returns (string) {
        return projectOfficialsRole[official];
    }

}
