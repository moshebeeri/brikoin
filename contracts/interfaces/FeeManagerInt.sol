pragma solidity ^0.4.0;

contract FeeManagerInt {
    function getUserSellingFee(
        address user,
        uint256 amount,
        uint256 limit_price,
        address organization
    ) public view returns (uint256);
    function setFeeManagerRole(address user) public;
    function getUserBuyingFee(
        address user,
        uint256 amount,
        uint256 limit_price,
        address organization
    ) public view returns (uint256);

    function getTotalFees(address stoneCoinAddress)
        public
        view
        returns (uint256);

    function clearFees(address stoneCoinAddress) public returns (uint256);

    function setBuyingFeeRatio(uint256 ratio_mill, address organization) public;
    function setSellingFeeRatio(uint256 ratio_mill, address organization)
        public;
    function addToTotalFee(uint256 fee, address stoneCoinAddress)
        public
        returns (uint256);

    function setUserFeeStatus(address user, bool state, address organization)
        public;

}
