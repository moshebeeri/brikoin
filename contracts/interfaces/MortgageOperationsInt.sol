pragma solidity ^0.4.0;
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract MortgageOperationsInt {
    function createExternalMortgage(
        address _mortgageeAddress,
        address _stoneCoinAddress,
        address _mortgageRequestAddress,
        uint256 _key,
        address baseStoneAddress
    ) public returns (address);
    function createMortgage(
        address mortgageOwner,
        address _mortgageeAddress,
        address _stoneCoinAddress,
        address _mortgageRequestAddress,
        address _mortgageeConditionAddress,
        uint256 _key,
        bool isExternal,
        address baseStoneAddress
    ) public returns (address);

    function lastMortgage(uint256 _key) public view returns (address);

    function payed(address mortgageAddress) public;

    function applyMortgageClearance(address mortgageAddress) public;
    function defaulted(address mortgageAddress) public;

    function clearance(address mortgageAddress, uint256 valuePayed) public;
    function clearMortgage(address mortgageAddress) public;

    function isMortgageRegistered(address mortgageAddress)
        public
        view
        returns (bool);
}
