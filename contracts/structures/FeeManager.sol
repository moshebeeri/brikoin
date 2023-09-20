pragma solidity ^0.4.0;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/Ownables.sol";

contract FeeManager is Ownables {
    using SafeMath for uint256;
    mapping(address => uint256) totalFees;
    uint256 public defaultBuyingFeeRatio = 25;
    uint256 public defaultSellingFeeRatio = 25;
    mapping(address => uint256) buyingFeeRatio;
    mapping(address => bool) buyingFeeRatioEnabled;
    mapping(address => bool) sellingFeeRatioEnabled;
    mapping(address => uint256) sellingFeeRatio;
    mapping(address => mapping(address => bool)) public usersFeeStatus;
    mapping(address => bool) public feeManagerRoles;

    constructor() public Ownables() {}

    function getUserSellingFee(
        address user,
        uint256 amount,
        uint256 limit_price,
        address organization
    ) public view returns (uint256) {
        if (!usersFeeStatus[organization][user]) {
            return 0;
        }

        if (buyingFeeRatioEnabled[organization]) {
            return
                amount.mul(limit_price).mul(buyingFeeRatio[organization]).div(
                    1000
                );
        }

        return amount.mul(limit_price).mul(defaultBuyingFeeRatio).div(1000);
    }

    function setFeeManagerRole(address user) public onlyOwner {
        feeManagerRoles[user] = true;
    }

    function getUserBuyingFee(
        address user,
        uint256 amount,
        uint256 limit_price,
        address organization
    ) public view returns (uint256) {
        if (!usersFeeStatus[organization][user]) {
            return 0;
        }

        if (sellingFeeRatioEnabled[organization]) {
            return
                amount.mul(limit_price).mul(sellingFeeRatio[organization]).div(
                    1000
                );
        }
        return amount.mul(limit_price).mul(defaultSellingFeeRatio).div(1000);
    }

    function getTotalFees(address stoneCoinAddress)
        public
        view
        returns (uint256)
    {
        require(feeManagerRoles[msg.sender]);
        return totalFees[stoneCoinAddress];
    }

    function clearFees(address stoneCoinAddress) public returns (uint256) {
        require(feeManagerRoles[msg.sender]);
        totalFees[stoneCoinAddress] = 0;
    }

    function setBuyingFeeRatio(uint256 ratio_mill, address organization)
        public
    {
        require(feeManagerRoles[msg.sender]);
        require(ratio_mill < 100);
        require(ratio_mill > 0);
        buyingFeeRatio[organization] = ratio_mill;
        buyingFeeRatioEnabled[organization] = true;
    }

    function setSellingFeeRatio(uint256 ratio_mill, address organization)
        public
    {
        require(feeManagerRoles[msg.sender]);
        require(ratio_mill < 100);
        require(ratio_mill > 0);
        sellingFeeRatio[organization] = ratio_mill;
        sellingFeeRatioEnabled[organization] = true;
    }

    function addToTotalFee(uint256 fee, address stoneCoinAddress)
        public
        onlyOwner
        returns (uint256)
    {
        totalFees[stoneCoinAddress] = totalFees[stoneCoinAddress].add(fee);
    }

    function setUserFeeStatus(address user, bool state, address organization)
        public
    {
        require(feeManagerRoles[msg.sender]);
        usersFeeStatus[organization][user] = state;
    }

}
