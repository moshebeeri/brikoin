pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TradesHistoryInt {
    function buyingTrade(
        address stoneCoinAddress,
        address user,
        uint256 amount,
        uint256 buy_limit
    ) public;

    function sellingTrade(
        address stoneCoinAddress,
        address user,
        uint256 amount,
        uint256 sell_limit
    ) public;

    function getHistoryTradesCount(address user) public view returns (uint256);
    function getHistoryTradesTime(address user, uint256 index)
        public
        view
        returns (uint256);
    function getHistoryTradesAmount(address user, uint256 index)
        public
        view
        returns (uint256);
    function getHistoryTradesSellingPrice(address user, uint256 index)
        public
        view
        returns (uint256);

    function getHistoryTradesBuyingPrice(address user, uint256 index)
        public
        view
        returns (uint256);

    function getHistoryTradesProject(address user, uint256 index)
        public
        view
        returns (address);

    function getPrice(address stoneCoinAddress, address user, uint256 index)
        public
        view
        returns (uint256);
    function getPrices(address stoneCoinAddress, address user)
        public
        view
        returns (uint256);
    function getAmountByPrice(
        address stoneCoinAddress,
        address user,
        uint256 price
    ) public view returns (uint256);

}
