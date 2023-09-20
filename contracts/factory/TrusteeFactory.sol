pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Trustee.sol";
import "../libs/types.sol";

contract TrusteeFactory is Ownable {
    using SafeMath for uint256;
    mapping(address => bool) trustees;
    event TrusteeRoleCreated(address trustee);
    event TrusteeCreated(address trustee);
    address public _manager;

    modifier onlyTrustee() {
        require(trustees[msg.sender] == true || owner == msg.sender);
        _;
    }

    function createTrustee(
        bytes32 _name,
        Types.TrusteeType _trusteeType,
        bytes32 _licenseNumber,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _address2,
        bytes32 _contactFirstName,
        bytes32 _contactSecondName,
        bytes32 _phoneNumber,
        bytes32 _email,
        bytes32 _url,
        bytes32 _urlMD5
    ) public onlyTrustee returns (address) {
        Trustee newContract = new Trustee(
            _name,
            _trusteeType,
            _licenseNumber,
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
        emit TrusteeCreated(address(newContract));
        return address(newContract);
    }

    function addTrustee(address _trustee) public onlyOwner {
        require(trustees[_trustee] != true);
        trustees[_trustee] = true;
        emit TrusteeRoleCreated(_trustee);
    }
}
