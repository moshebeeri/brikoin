pragma solidity ^0.4.24;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownables {
    mapping(address => bool) public owners;
    address public owner;

    event OwnershipRenounced(address indexed previousOwner);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    function getAddress() public view returns (address) {
        return address(this);
    }
    function isOwnable(address user) public view returns (bool) {
        return owners[user];
    }

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owners[msg.sender] = true;
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owners[msg.sender]);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param _newOwner The address to transfer ownership to.
     */
    function addOwnership(address _newOwner) public onlyOwner {
        _addOwnership(_newOwner);
    }

    function removeOwnership(address _newOwner) public onlyOwner {
        _removeOwnership(_newOwner);
    }

    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param _newOwner The address to transfer ownership to.
     */
    function _addOwnership(address _newOwner) internal {
        require(_newOwner != address(0));
        emit OwnershipTransferred(owner, _newOwner);
        owners[_newOwner] = true;
    }

    function _removeOwnership(address _newOwner) internal {
        require(_newOwner != address(0));
        owners[_newOwner] = false;
    }
}
