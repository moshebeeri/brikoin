pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Manager.sol";

contract ManagerFactory is Ownable {
    using SafeMath for uint256;
    mapping(address => bool) managers;
    event ManagerRoleCreated(address manager);
    event ManagerCreated(address manager);
    address public _manager;

    modifier onlyManager() {
        require(managers[msg.sender] == true || owner == msg.sender);
        _;
    }

    function createManager(
        bytes32 _name,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _address2,
        bytes32 _contactFirstName,
        bytes32 _contactSecondName,
        bytes32 _phoneNumber,
        bytes32 _email,
        bytes32 _url,
        bytes32 _urlMD5
    ) public onlyManager returns (address) {
        Manager newContract = new Manager(
            _name,
            _country,
            _address1,
            _address2,
            _contactFirstName,
            _contactSecondName,
            _phoneNumber,
            _email,
            _url,
            _urlMD5
        );
        emit ManagerCreated(address(newContract));
        return address(newContract);
    }

    function addManager(address newManager) public onlyOwner {
        require(managers[newManager] != true);
        managers[newManager] = true;
        emit ManagerRoleCreated(newManager);
    }
}
