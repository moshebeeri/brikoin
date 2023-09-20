pragma solidity ^0.4.24;

//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoinMortgageInt {
    function transferBuyMortgaged(
        address _mortgageAddress,
        address _to,
        uint256 _units
    ) public returns (bool);

    function transferSellMortgaged(
        address _mortgageAddress,
        address _from,
        uint256 _units
    ) public returns (bool);

    function clearMortgage(address user, address _mortgageAddress) public;

    function partlyForfeitureMortgage(
        address user,
        address mortgagee,
        address _mortgageAddress,
        uint256 _marketPriceMills,
        bool maxDefaulted
    ) public returns (uint256);
    function buyMortgaged(address mortgageAddress, address buyer, uint256 units)
        public;
    function sellMortgaged(
        address mortgageAddress,
        address seller,
        uint256 units
    ) public;
    function balanceOf(address _user) public view returns (uint256);

    function balanceOfMortgage(address _user, address mortgageAddress)
        public
        view
        returns (uint256);
    function forecloseTokens(address _user, address mortgageAddress) public;

}
