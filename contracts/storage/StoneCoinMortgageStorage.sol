pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";
import "../interfaces/StoneCoinMortgageStorageInt.sol";

//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoinMortgageStorage is Ownables, StoneCoinMortgageStorageInt {
    using SafeMath for uint256;

    struct MortgagedHolding {
        bool valid;
        bool defaulted;
        uint256 units;
        address mortgagee;
        address holder;
    }
    mapping(address => mapping(address => MortgagedHolding)) public holdings;
    mapping(address => uint256) public totalUserMortgageHoldings;

    function setTotalUserHoldings(address user, uint256 _holdings)
        public
        onlyOwner
    {
        totalUserMortgageHoldings[user] = _holdings;
    }

    function getTotalUserHoldings(address user) public view returns (uint256) {
        return totalUserMortgageHoldings[user];
    }

    function isMortgageValid(address user, address mortgageAddress)
        public
        view
        returns (bool)
    {
        return holdings[user][mortgageAddress].valid;
    }

    function setMortgageValid(address user, address mortgageAddress, bool valid)
        public
        onlyOwner
    {
        holdings[user][mortgageAddress].valid = valid;
    }

    function isMortgageDefaulted(address user, address mortgageAddress)
        public
        view
        returns (bool)
    {
        return holdings[user][mortgageAddress].defaulted;
    }

    function setMortgageDefaulted(
        address user,
        address mortgageAddress,
        bool defaulted
    ) public onlyOwner {
        holdings[user][mortgageAddress].defaulted = defaulted;
    }

    function getMortgageHoldings(address user, address mortgageAddress)
        public
        view
        returns (uint256)
    {
        return holdings[user][mortgageAddress].units;
    }
    function setMortgageHoldings(
        address user,
        address mortgageAddress,
        uint256 units
    ) public onlyOwner {
        holdings[user][mortgageAddress].units = units;
    }

    function getMortgageHolder(address user, address mortgageAddress)
        public
        view
        returns (address)
    {
        return holdings[user][mortgageAddress].holder;
    }
    function setMortgageHolder(address user, address mortgageAddress)
        public
        onlyOwner
    {
        holdings[user][mortgageAddress].holder = user;
    }

    function getMortgageMortgagee(address user, address mortgageAddress)
        public
        view
        returns (address)
    {
        return holdings[user][mortgageAddress].mortgagee;
    }

    function setMortgageMortgagee(
        address user,
        address mortgageAddress,
        address mortgagee
    ) public onlyOwner {
        holdings[user][mortgageAddress].mortgagee = mortgagee;
    }

}
