pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Mortgage.sol";
import "./structures/Estimation.sol";
import "./structures/Registrar.sol";
import "./structures/Terms.sol";
import "./structures/Manager.sol";
import "./structures/Property.sol";
import "./structures/Trustee.sol";
import "./interfaces/StoneCoinMortgageInt.sol";
import "./interfaces/Ownables.sol";
import "./interfaces/StoneCoinMortgageStorageInt.sol";

//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoinMortgage is Ownables, StoneCoinMortgageInt {
    using SafeMath for uint256;

    address mortgageStorage;

    constructor() public Ownables() {}

    function setStoneCoinMortgageStorage(address _mortgageStorage)
        public
        onlyOwner
    {
        mortgageStorage = _mortgageStorage;
    }

    function getUserMortgageHoldings(address _user, address _mortgageAddress)
        private
        view
        returns (uint256)
    {
        return
            StoneCoinMortgageStorageInt(mortgageStorage).getMortgageHoldings(
                _user,
                _mortgageAddress
            );
    }

    function getTotalUserHoldings(address _user)
        private
        view
        returns (uint256)
    {
        return
            StoneCoinMortgageStorageInt(mortgageStorage).getTotalUserHoldings(
                _user
            );
    }

    function setTotalUserHoldings(address _user, uint256 units) private {
        StoneCoinMortgageStorageInt(mortgageStorage).setTotalUserHoldings(
            _user,
            units
        );
    }

    function subUserMortgageHoldings(
        address _user,
        address _mortgageAddress,
        uint256 units
    ) private {
        uint256 userHoldings = getUserMortgageHoldings(_user, _mortgageAddress)
            .sub(units);
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageHoldings(
            _user,
            _mortgageAddress,
            userHoldings
        );

    }

    function transferFromMortgage(address _user, address _mortgageAddress)
        private
        returns (bool)
    {
        require(_user != address(0));
        Mortgage mortgage = Mortgage(_mortgageAddress);
        require(_user == mortgage.getBuyer());
        require(0 == mortgage.getRemainingLoanBalance());
        setTotalUserHoldings(
            _user,
            getTotalUserHoldings(_user).sub(
                getUserMortgageHoldings(_user, _mortgageAddress)
            )
        );
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageHoldings(
            _user,
            _mortgageAddress,
            0
        );
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageValid(
            _user,
            _mortgageAddress,
            false
        );
        return true;
    }

    function partlyForfeitureTransfer(
        address _user,
        address _mortgagee,
        address _mortgageAddress,
        uint256 marketPriceMill,
        bool maxDefaulted
    ) private returns (uint256) {
        require(_user != address(0));
        Mortgage mortgage = Mortgage(_mortgageAddress);
        require(_user == mortgage.getBuyer());
        require(_mortgagee == mortgage.getMortgagee());
        require(0 < mortgage.getDefaultStatus());

        uint256 payment = mortgage.getNextPayment();
        if (maxDefaulted) {
            payment = mortgage.getRemainingLoanBalance();
        }
        uint256 numberOfUnits = payment.div(1000000).mul(marketPriceMill).div(
            1000
        );
        numberOfUnits = numberOfUnits.mul(1100).div(1000);
        if (numberOfUnits > getUserMortgageHoldings(_user, _mortgageAddress)) {
            setTotalUserHoldings(
                _user,
                getTotalUserHoldings(_user).sub(
                    getUserMortgageHoldings(_user, _mortgageAddress)
                )
            );
            StoneCoinMortgageStorageInt(mortgageStorage).setMortgageHoldings(
                _user,
                _mortgageAddress,
                0
            );
            StoneCoinMortgageStorageInt(mortgageStorage).setMortgageValid(
                _user,
                _mortgageAddress,
                false
            );
            return numberOfUnits;
        }
        subUserMortgageHoldings(_user, _mortgageAddress, numberOfUnits);
        setTotalUserHoldings(
            _user,
            getTotalUserHoldings(_user).sub(numberOfUnits)
        );
        return numberOfUnits;
    }

    function transferBuyMortgaged(
        address _mortgageAddress,
        address _to,
        uint256 _units
    ) public onlyOwner returns (bool) {
        require(_to != address(0));
        require(
            !StoneCoinMortgageStorageInt(mortgageStorage).isMortgageValid(
                _to,
                _mortgageAddress
            )
        );
        Mortgage mortgage = Mortgage(_mortgageAddress);
        setTotalUserHoldings(_to, getTotalUserHoldings(_to).add(_units));
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageValid(
            _to,
            _mortgageAddress,
            true
        );
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageHoldings(
            _to,
            _mortgageAddress,
            _units
        );
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageMortgagee(
            _to,
            _mortgageAddress,
            mortgage.getMortgagee()
        );
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageHolder(
            _to,
            _mortgageAddress
        );
        return true;
    }

    function transferSellMortgaged(
        address _mortgageAddress,
        address _from,
        uint256 _units
    ) public onlyOwner returns (bool) {
        require(_from != address(0));
        require(
            StoneCoinMortgageStorageInt(mortgageStorage).isMortgageValid(
                _from,
                _mortgageAddress
            )
        );

        require(getUserMortgageHoldings(_from, _mortgageAddress) >= _units);
        setTotalUserHoldings(_from, getTotalUserHoldings(_from).sub(_units));
        subUserMortgageHoldings(_from, _mortgageAddress, _units);
        return true;
    }

    function clearMortgage(address user, address _mortgageAddress)
        public
        onlyOwner
    {
        transferFromMortgage(user, _mortgageAddress);
    }

    function partlyForfeitureMortgage(
        address user,
        address mortgagee,
        address _mortgageAddress,
        uint256 _marketPriceMills,
        bool maxDefaulted
    ) public onlyOwner returns (uint256) {
        uint256 result = partlyForfeitureTransfer(
            user,
            mortgagee,
            _mortgageAddress,
            _marketPriceMills,
            maxDefaulted
        );
        return result;
    }

    function buyMortgaged(address mortgageAddress, address buyer, uint256 units)
        public
        onlyOwner
    {
        transferBuyMortgaged(mortgageAddress, buyer, units);
    }

    function sellMortgaged(
        address mortgageAddress,
        address seller,
        uint256 units
    ) public onlyOwner {
        transferSellMortgaged(mortgageAddress, seller, units);
    }

    function balanceOf(address _user) public view returns (uint256) {
        uint256 result = getTotalUserHoldings(_user);
        return result;
    }

    function balanceOfMortgage(address _user, address mortgageAddress)
        public
        view
        returns (uint256)
    {
        uint256 result = getUserMortgageHoldings(_user, mortgageAddress);
        return result;
    }
    function forecloseTokens(address _user, address mortgageAddress)
        public
        onlyOwner
    {
        StoneCoinMortgageStorageInt(mortgageStorage).setMortgageHoldings(
            _user,
            mortgageAddress,
            0
        );
    }

}
