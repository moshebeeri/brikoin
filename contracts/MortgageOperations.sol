pragma solidity ^0.4.0;
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./structures/MortgageRequest.sol";
import "./Mortgage.sol";
import "./interfaces/MortgageOperationsInt.sol";
import "./interfaces/Ownables.sol";

contract MortgageOperations is Ownables, MortgageOperationsInt {
    using SafeMath for uint256;
    event MortgageCreated(
        address mortgage,
        address stoneCoin,
        address mortgagee,
        address requester,
        address mortgageRequest,
        address mortgageeCondition
    );

    mapping(address => bool) mortgageRequests;
    mapping(uint256 => address) lastMortgageAddress;

    constructor() public Ownables() {}
    function createExternalMortgage(
        address _mortgageeAddress,
        address _stoneCoinAddress,
        address _mortgageRequestAddress,
        uint256 _key,
        address baseStoneAddress
    ) public returns (address) {
        MortgageRequest mortgageRequest = MortgageRequest(
            _mortgageRequestAddress
        );
        Mortgage mortgage = new Mortgage(
            _stoneCoinAddress,
            _mortgageeAddress,
            mortgageRequest.getRequester(),
            _mortgageRequestAddress,
            0,
            true
        );
        mortgage.setCornerStoneBase(baseStoneAddress);
        lastMortgageAddress[_key] = address(mortgage);
        mortgageRequests[_mortgageRequestAddress] = true;
        return address(mortgage);
    }

    function createMortgage(
        address mortgageOwner,
        address _mortgageeAddress,
        address _stoneCoinAddress,
        address _mortgageRequestAddress,
        address _mortgageeConditionAddress,
        uint256 _key,
        bool isExternal,
        address baseStoneAddress
    ) public returns (address) {
        if (isExternal) {
            return
                createExternalMortgage(
                    _mortgageeAddress,
                    _stoneCoinAddress,
                    _mortgageRequestAddress,
                    _key,
                    baseStoneAddress
                );
        }
        MortgageeCondition mortgageCondition = MortgageeCondition(
            _mortgageeConditionAddress
        );
        MortgageRequest mortgageRequest = MortgageRequest(
            _mortgageRequestAddress
        );
        require(
            mortgageRequest.getMortgageCondition() == _mortgageeConditionAddress
        );

        require(mortgageCondition.isActive());
        require(mortgageRequests[_mortgageRequestAddress] == false);
        Mortgage mortgage = new Mortgage(
            _stoneCoinAddress,
            _mortgageeAddress,
            mortgageRequest.getRequester(),
            _mortgageRequestAddress,
            _mortgageeConditionAddress,
            false
        );
        mortgage.addOwnership(mortgageOwner);
        mortgage.setCornerStoneBase(baseStoneAddress);
        lastMortgageAddress[_key] = address(mortgage);
        mortgageRequests[_mortgageRequestAddress] = true;
        emit MortgageCreated(
            mortgage,
            _stoneCoinAddress,
            _mortgageeAddress,
            mortgageRequest.getRequester(),
            _mortgageRequestAddress,
            _mortgageeConditionAddress
        );
        return address(mortgage);
    }

    function lastMortgage(uint256 _key) public view returns (address) {
        return lastMortgageAddress[_key];
    }

    function payed(address mortgageAddress) public onlyOwner {
        Mortgage mortgage = Mortgage(mortgageAddress);
        return mortgage.payed();
    }

    function applyMortgageClearance(address mortgageAddress) public onlyOwner {
        Mortgage mortgage = Mortgage(mortgageAddress);
        mortgage.applyClearances();
    }
    function defaulted(address mortgageAddress) public onlyOwner {
        Mortgage mortgage = Mortgage(mortgageAddress);
        return mortgage.defaulted();
    }

    function clearance(address mortgageAddress, uint256 valuePayed)
        public
        onlyOwner
    {
        Mortgage mortgage = Mortgage(mortgageAddress);
        mortgage.clearance(valuePayed);
    }

    function clearMortgage(address mortgageAddress) public onlyOwner {
        Mortgage mortgage = Mortgage(mortgageAddress);
        mortgage.cleared();
    }

    function isMortgageRegistered(address mortgageAddress)
        public
        view
        returns (bool)
    {
        Mortgage mortgage = Mortgage(mortgageAddress);
        return mortgage.isMortgageRegistered();
    }
}
