pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoinMortgageStorageInt {
    function setTotalUserHoldings(address user, uint256 holdings) public;

    function getTotalUserHoldings(address user) public view returns (uint256);

    function isMortgageValid(address user, address mortgageAddress)
        public
        view
        returns (bool);

    function setMortgageValid(address user, address mortgageAddress, bool valid)
        public;

    function isMortgageDefaulted(address user, address mortgageAddress)
        public
        view
        returns (bool);
    function setMortgageDefaulted(
        address user,
        address mortgageAddress,
        bool defaulted
    ) public;
    function getMortgageHoldings(address user, address mortgageAddress)
        public
        view
        returns (uint256);
    function setMortgageHoldings(
        address user,
        address mortgageAddress,
        uint256 units
    ) public;

    function getMortgageHolder(address user, address mortgageAddress)
        public
        view
        returns (address);
    function setMortgageHolder(address user, address mortgageAddress) public;

    function getMortgageMortgagee(address user, address mortgageAddress)
        public
        view
        returns (address);

    function setMortgageMortgagee(
        address user,
        address mortgageAddress,
        address mortgagee
    ) public;

}
