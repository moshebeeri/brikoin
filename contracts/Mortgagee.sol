pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Mortgage.sol";
import "./structures/MortgageRequest.sol";
import "./structures/MortgageeCondition.sol";

contract Mortgagee is Ownable {
    using SafeMath for uint256;

    address public mortgageeAddress;
    uint256 public maxMortgage;
    bytes32 name;
    bytes32 mortgageeType;
    bytes32 city;
    bytes32 country;
    bytes32 address1;
    bytes32 businessIdentifier;

    event MortgageDeclined(
        address mortgageRequestAddress,
        address mortgageeConditionAddress
    );
    event MortgageApproved(
        address mortgageRequestAddress,
        address mortgageeConditionAddress,
        address mortgage
    );

    constructor(
        address _mortgageeAddress,
        uint256 _maxMortgage,
        bytes32 _name,
        bytes32 _mortgageeType,
        bytes32 _city,
        bytes32 _country,
        bytes32 _address1,
        bytes32 _businessIdentifier
    ) public {
        mortgageeAddress = _mortgageeAddress;
        maxMortgage = _maxMortgage;
        name = _name;
        mortgageeType = _mortgageeType;
        city = _city;
        country = _country;
        address1 = _address1;
        businessIdentifier = _businessIdentifier;
    }

    function approve(
        address mortgageRequestAddress,
        address mortgageeConditionAddress
    ) public onlyOwner {
        require(mortgageRequestAddress != address(0));
        require(mortgageeConditionAddress != address(0));
        MortgageRequest request = MortgageRequest(mortgageRequestAddress);
        MortgageeCondition condition = MortgageeCondition(
            mortgageeConditionAddress
        );

        Mortgage mortgage = new Mortgage(
            condition.getStoneCoinAddress(),
            condition.getMortgagee(),
            request.getRequester(),
            mortgageRequestAddress,
            mortgageeConditionAddress,
            false
        );

        emit MortgageApproved(
            mortgageRequestAddress,
            mortgageeConditionAddress,
            address(mortgage)
        );
    }

    function decline(
        address mortgageRequestAddress,
        address mortgageeConditionAddress
    ) public onlyOwner {
        require(mortgageRequestAddress != address(0));
        require(mortgageeConditionAddress != address(0));
        emit MortgageDeclined(
            mortgageRequestAddress,
            mortgageeConditionAddress
        );
    }
}
