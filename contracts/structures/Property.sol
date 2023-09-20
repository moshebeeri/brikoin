pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Property is Ownable {
    using SafeMath for uint256;

    bytes32 public name;
    address public manager;
    address[] public trustees;
    address public registrar;
    address[] public estimations;
    bytes32 public country;
    bytes32 public address1;
    bytes32 public address2;
    bytes32 public state;
    bytes32 public lat;
    bytes32 public lon;

    constructor(
        bytes32 _name,
        address _manager,
        address _trustee,
        address _registrar,
        address _estimation,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _address2,
        bytes32 _state,
        bytes32 _lat,
        bytes32 _lon
    ) public Ownable() {
        require(_name.length != 0);
        require(_manager != address(0));
        require(_trustee != address(0));
        require(_registrar != address(0));
        require(_country.length != 0);
        require(_address1.length != 0);
        require(_address2.length != 0);
        require(_lat.length != 0);
        require(_lon.length != 0);

        name = _name;
        manager = _manager;
        trustees.push(_trustee);
        estimations.push(_estimation);
        registrar = _registrar;
        country = _country;
        address1 = _address1;
        address2 = _address2;
        state = _state;
        lat = _lat;
        lon = _lon;
    }

    function addEstimation(address _estimation) public {
        estimations.push(_estimation);
    }
}
