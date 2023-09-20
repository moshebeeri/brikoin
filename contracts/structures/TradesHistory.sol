pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/TradesHistoryInt.sol";
import "../interfaces/Ownables.sol";
contract TradesHistory is Ownables, TradesHistoryInt {
    using SafeMath for uint256;
    event buyEvent(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros
    );
    event sellEvent(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 buy_limit,
        uint256 sell_limit
    );

    struct HoldingBundle {
        bool holds;
        uint256[] buyPrices;
        mapping(uint256 => uint256) buysPriceToAmount;
    }

    struct TradeHistory {
        uint256 time;
        uint256 amount;
        uint256 sellingPrice;
        uint256 buyingPrice;
        address stoneCoinAddress;
    }

    mapping(address => mapping(address => HoldingBundle)) private trades;
    mapping(address => TradeHistory[]) private userTradesHistory;

    constructor() public Ownables() {}

    function remove(uint256 index, uint256[] array)
        private
        pure
        returns (uint256[])
    {
        if (index >= array.length) return;

        for (uint256 i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }
        delete array[array.length - 1];
        return array;
    }

    function sort(uint256[] data) private pure returns (uint256[]) {
        quickSort(data, int256(0), int256(data.length - 1));
        return data;
    }

    function quickSort(uint256[] memory arr, int256 left, int256 right)
        internal
        pure
    {
        int256 i = left;
        int256 j = right;
        if (i == j) return;
        uint256 pivot = arr[uint256(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint256(i)] < pivot) i++;
            while (pivot < arr[uint256(j)]) j--;
            if (i <= j) {
                (arr[uint256(i)], arr[uint256(j)]) = (
                    arr[uint256(j)],
                    arr[uint256(i)]
                );
                i++;
                j--;
            }
        }
        if (left < j) quickSort(arr, left, j);
        if (i < right) quickSort(arr, i, right);
    }

    function buyingTrade(
        address stoneCoinAddress,
        address user,
        uint256 amount,
        uint256 buy_limit
    ) public onlyOwner {
        trades[stoneCoinAddress][user].buyPrices.push(buy_limit);
        trades[stoneCoinAddress][user].holds = true;
        trades[stoneCoinAddress][user].buyPrices = sort(
            trades[stoneCoinAddress][user].buyPrices
        );
        trades[stoneCoinAddress][user].buysPriceToAmount[buy_limit] = amount;
        emit buyEvent(user, stoneCoinAddress, amount, buy_limit);
    }

    function sellingTrade(
        address stoneCoinAddress,
        address user,
        uint256 amount,
        uint256 sell_limit
    ) public onlyOwner {
        HoldingBundle storage holdings = trades[stoneCoinAddress][user];
        if (holdings.holds) {
            uint256 index = holdings.buyPrices.length - 1;
            bool last = false;
            while (amount > 0 && !last) {
                if (index == 0) {
                    last = true;
                }
                uint256 holdingPrice = holdings.buyPrices[index];
                uint256 tradeAmount = holdings.buysPriceToAmount[holdingPrice];
                if (tradeAmount == 0) {
                    index = index - 1;
                } else {
                    if (amount > tradeAmount) {
                        index = index - 1;
                        emit sellEvent(
                            user,
                            stoneCoinAddress,
                            tradeAmount,
                            holdingPrice,
                            sell_limit
                        );
                        holdings.buysPriceToAmount[holdingPrice] = 0;
                        addTradeHistory(
                            stoneCoinAddress,
                            user,
                            tradeAmount,
                            sell_limit,
                            holdingPrice
                        );
                        amount = amount.sub(tradeAmount);
                    } else {
                        emit sellEvent(
                            user,
                            stoneCoinAddress,
                            amount,
                            holdingPrice,
                            sell_limit
                        );
                        addTradeHistory(
                            stoneCoinAddress,
                            user,
                            amount,
                            sell_limit,
                            holdingPrice
                        );
                        holdings.buysPriceToAmount[holdingPrice] = tradeAmount
                            .sub(amount);
                        amount = 0;
                    }
                }
            }
        }
    }

    function addTradeHistory(
        address stoneCoinAddress,
        address user,
        uint256 amount,
        uint256 sellingPrice,
        uint256 buyingPrice
    ) private {
        TradeHistory memory trade;
        trade.time = now;
        trade.amount = amount;
        trade.sellingPrice = sellingPrice;
        trade.buyingPrice = buyingPrice;
        trade.stoneCoinAddress = stoneCoinAddress;
        userTradesHistory[user].push(trade);
    }

    function getHistoryTradesCount(address user) public view returns (uint256) {
        return userTradesHistory[user].length;
    }

    function getHistoryTradesTime(address user, uint256 index)
        public
        view
        returns (uint256)
    {
        require(userTradesHistory[user].length > index);
        return userTradesHistory[user][index].time;
    }
    function getHistoryTradesAmount(address user, uint256 index)
        public
        view
        returns (uint256)
    {
        require(userTradesHistory[user].length > index);
        return userTradesHistory[user][index].amount;
    }
    function getHistoryTradesSellingPrice(address user, uint256 index)
        public
        view
        returns (uint256)
    {
        require(userTradesHistory[user].length > index);
        return userTradesHistory[user][index].sellingPrice;
    }

    function getHistoryTradesBuyingPrice(address user, uint256 index)
        public
        view
        returns (uint256)
    {
        require(userTradesHistory[user].length > index);
        return userTradesHistory[user][index].buyingPrice;
    }

    function getHistoryTradesProject(address user, uint256 index)
        public
        view
        returns (address)
    {
        require(userTradesHistory[user].length > index);
        return userTradesHistory[user][index].stoneCoinAddress;
    }

    function getPrice(address stoneCoinAddress, address user, uint256 index)
        public
        view
        returns (uint256)
    {
        require(trades[stoneCoinAddress][user].buyPrices.length > index);
        return trades[stoneCoinAddress][user].buyPrices[index];
    }

    function getPrices(address stoneCoinAddress, address user)
        public
        view
        returns (uint256)
    {
        return trades[stoneCoinAddress][user].buyPrices.length;
    }

    function getAmountByPrice(
        address stoneCoinAddress,
        address user,
        uint256 price
    ) public view returns (uint256) {
        return trades[stoneCoinAddress][user].buysPriceToAmount[price];
    }

}
