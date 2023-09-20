pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Property.sol";

contract PropertyFactory is Ownable {
    using SafeMath for uint256;
    mapping(address => bool) property;
    event PropertyRoleCreated(address property);
    event PropertyCreated(address property);
    address public _property;

    modifier onlyProperty() {
        require(property[msg.sender] == true || owner == msg.sender);
        _;
    }

    function createProperty(
        bytes32 _name,
        address _manager,
        address _trustee,
        address _registrar,
        address _estimation,
        bytes32 _country,
        bytes32 _state,
        bytes32 _address1,
        bytes32 _address2,
        bytes32 _lat,
        bytes32 _lon
    ) public onlyProperty returns (address) {
        Property newContract = new Property(
            _name,
            _manager,
            _trustee,
            _registrar,
            _estimation,
            _country,
            _state,
            _address1,
            _address2,
            _lat,
            _lon
        );
        emit PropertyCreated(address(newContract));
        return address(newContract);
    }

    function addProperty(address newProperty) public onlyOwner {
        require(property[newProperty] != true);
        property[newProperty] = true;
        emit PropertyRoleCreated(newProperty);
    }
}
