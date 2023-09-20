pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Registrar.sol";

contract RegistrarFactory is Ownable {
    using SafeMath for uint256;
    mapping(address => bool) registrars;
    event RegistrarRoleCreated(address registrar);
    event RegistrarCreated(address registrar);
    address public _registrar;

    modifier onlyRegistrar() {
        require(registrars[msg.sender] == true || owner == msg.sender);
        _;
    }

    function createRegistrar(
        bytes32 _name,
        bytes32 _licenseNumber,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _address2,
        bytes32 _phoneNumber,
        bytes32 _faxNumber,
        bytes32 _email,
        bytes32 _url
    ) public onlyRegistrar returns (address) {
        Registrar newContract = new Registrar(
            _name,
            _licenseNumber,
            _country,
            _address1,
            _address2,
            _phoneNumber,
            _faxNumber,
            _email,
            _url
        );
        emit RegistrarCreated(address(newContract));
        return address(newContract);
    }

    function addRegistrar(address newRegistrar) public onlyOwner {
        require(registrars[newRegistrar] != true);
        registrars[newRegistrar] = true;
        emit RegistrarRoleCreated(newRegistrar);
    }
}
