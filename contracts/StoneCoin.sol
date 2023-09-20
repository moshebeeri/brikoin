pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Mortgage.sol";
import "./structures/TokenApproveContract.sol";
import "./interfaces/StoneCoinMortgageInt.sol";
import "./interfaces/StoneCoinStorageInt.sol";
import "./interfaces/Ownables.sol";
import "./interfaces/StoneCoinInt.sol";
//TODO: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
contract StoneCoin is Ownables, StoneCoinInt {
    using SafeMath for uint256;
    address stoneCoinMortgageAddress;
    address stoneCoinStorageAddress;

    address public assetManager;
    bytes32[] public url;
    bytes32[] public urlMD5;
    uint256 minBulkSize;
    uint256 maxBulkSize;
    uint256 reservedPrice;

    bytes32 public name = "StoneCoin";
    bytes32 public symbol = "STC";
    bytes32 currency;

    uint256 public startTimestamp; // timestamp after which ICO will start
    uint256 public durationSeconds = 16 * 7 * 24 * 60 * 60; // 16 weeks
    uint256 target = 0;
    bool initialOffering = true;
    bool signDocument = false;
    bool tokenFreeTransfer = false;
    bool transferWithContract = false;
    uint256 initialOfferingUnits = 0;
    address organization = 0;

    event Sent(address from, address to, uint256 amount);
    event EstimationAdded(address estimation);
    event Invest(address user, uint256 units);
    event Buy(address buyer, uint256 units, bool initialOffering);
    event Sell(address seller, uint256 units);
    event OwnerTokenCleared(uint256 units);
    event MortgageCleared(address user, address mortgageAddress);
    event MortgageForfeiture(
        address user,
        address mortgagee,
        address mortgageAddress
    );
    event BuyMortgaged(address buyer, uint256 units, bool initialOffering);
    event SellMortgaged(address seller, uint256 units);
    event Debug(uint256 ownerUnits);
    // This is the constructor whose code is
    // run only when the contract is created.
    constructor(
        bytes32 _name,
        bytes32 _symbol,
        uint256 _target,
        uint256 _startTimestamp,
        uint256 _durationSeconds,
        address _assetManager,
        bytes32 _url,
        bytes32 _urlMD5,
        bool _signDocument,
        uint256 _minBulkSize
    ) public Ownables() {
        name = _name;
        symbol = _symbol;
        target = _target;
        url.push(_url);
        urlMD5.push(_urlMD5);
        startTimestamp = _startTimestamp;
        minBulkSize = _minBulkSize;
        durationSeconds = _durationSeconds;
        assetManager = _assetManager;
        owner = msg.sender;
        maxBulkSize = _target;
        signDocument = _signDocument;
        tokenFreeTransfer = false;
        transferWithContract = false;
        currency = "USD";

    }

    function isInitialOffering() public view returns (bool) {
        return initialOffering;
    }
    function getOwnerTokens() public view returns (uint256) {
        return getBalance(owner);
    }
    function isSignDocument() public view returns (bool) {
        return signDocument;
    }
    function getOrganization() public view returns (address) {
        return organization;
    }

    function getReservedPrice() public view returns (uint256) {
        return reservedPrice;
    }

    function getCurrency() public view returns (bytes32) {
        return currency;
    }

    function setReservedPrice(uint256 _reservedPrice) public onlyOwner {
        reservedPrice = _reservedPrice;
    }
    function setCurrency(bytes32 _currency) public onlyOwner {
        currency = _currency;
    }

    function setStoneCoinMortgageAddress(address _stoneCoinMortgageAddress)
        public
        onlyOwner
    {
        stoneCoinMortgageAddress = _stoneCoinMortgageAddress;
    }

    function setStoneCoinStorageAddress(address _stoneCoinStorageAddress)
        public
        onlyOwner
    {
        stoneCoinStorageAddress = _stoneCoinStorageAddress;
    }
    function init() public onlyOwner {
        StoneCoinStorageInt(stoneCoinStorageAddress).addStones(target);
        newHolder(owner, target);
    }
    function STONES() public view returns (uint256) {
        return StoneCoinStorageInt(stoneCoinStorageAddress).getStones();
    }

    function isHolder(address holder) public view returns (bool) {
        if (getHoldersCount() == 0) return false;
        uint256 index = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldersIndex(holder);
        return (StoneCoinStorageInt(stoneCoinStorageAddress).getHolder(index) ==
            holder);
    }

    function setTransferFree() public onlyOwner {
        tokenFreeTransfer = true;
    }

    function setTransferFreeWithContract() public onlyOwner {
        transferWithContract = true;
    }

    function getHolderByIndex(uint256 i)
        public
        view
        onlyOwner
        returns (address holder)
    {
        return StoneCoinStorageInt(stoneCoinStorageAddress).getHolder(i);
    }

    function getHoldersCount() public view returns (uint256 holderCount) {
        return StoneCoinStorageInt(stoneCoinStorageAddress).getHoldersLength();
    }

    function newHolder(address holder, uint256 units)
        public
        onlyOwner
        returns (bool success)
    {
        require(isHolder(holder) == false);
        StoneCoinStorageInt(stoneCoinStorageAddress).setValid(holder, true);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            holder,
            units
        );
        uint256 holderIndex = StoneCoinStorageInt(stoneCoinStorageAddress)
            .addHolder(holder) -
            1;
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldersIndex(
            holder,
            holderIndex
        );
        return true;
    }

    function updateHoldings(address holder, uint256 units)
        public
        onlyOwner
        returns (bool success)
    {
        require(isHolder(holder) == true);
        uint256 holdingsNew = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(holder)
            .add(units);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            holder,
            holdingsNew
        );
        return true;
    }

    function deleteHolder(address holder)
        public
        onlyOwner
        returns (bool success)
    {
        require(isHolder(holder) == true);
        StoneCoinStorageInt(stoneCoinStorageAddress).deleteHolder(holder);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _units)
        private
        returns (bool)
    {
        require(_to != address(0));
        uint256 fromUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(_from);
        uint256 toUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(_to);
        require(_units <= fromUnits);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            _from,
            fromUnits.sub(_units)
        );
        toUnits = StoneCoinStorageInt(stoneCoinStorageAddress).getHoldingsUnits(
            _to
        );
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            _to,
            toUnits.add(_units)
        );
        return true;
    }

    function transferTokenFrom(
        address _from,
        address _to,
        uint256 _units,
        address contractAddress
    ) public returns (bool) {
        require(msg.sender == _from);
        require(tokenFreeTransfer || transferWithContract);
        if (!tokenFreeTransfer) {
            require(contractAddress != address(0));
            TokenApproveContract tokenApproveContract = TokenApproveContract(
                contractAddress
            );
            require(tokenApproveContract.isApproved());
            require(_to == tokenApproveContract.toUser());
            require(_from == tokenApproveContract.fromUser());
            require(_units == tokenApproveContract.units());
        }
        transferFrom(_from, _to, _units);
        return true;
    }

    function partlyForfeitureTransfer(
        address _user,
        address _mortgagee,
        address _mortgageAddress,
        uint256 marketPriceMill,
        bool maxDefaulted
    ) private onlyOwner returns (bool) {
        uint256 numberOfUnits = StoneCoinMortgageInt(stoneCoinMortgageAddress)
            .partlyForfeitureMortgage(
            _user,
            _mortgagee,
            _mortgageAddress,
            marketPriceMill,
            maxDefaulted
        );
        uint256 mortgageeUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(_mortgagee);
        //TODO
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            _mortgagee,
            mortgageeUnits.add(numberOfUnits)
        );
        return true;
    }

    function transferBuyMortgaged(
        address _mortgageAddress,
        address _to,
        uint256 _units
    ) private onlyOwner returns (bool) {
        uint256 ownerUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(owner);

        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            owner,
            ownerUnits.sub(_units)
        );

        StoneCoinMortgageInt(stoneCoinMortgageAddress).transferBuyMortgaged(
            _mortgageAddress,
            _to,
            _units
        );
        return true;
    }

    function transferSellMortgaged(
        address _mortgageAddress,
        address _from,
        uint256 _units
    ) private onlyOwner returns (bool) {
        require(_from != address(0));
        StoneCoinMortgageInt(stoneCoinMortgageAddress).transferSellMortgaged(
            _mortgageAddress,
            _from,
            _units
        );
        uint256 ownerUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(owner);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            owner,
            ownerUnits.add(_units)
        );
        return true;
    }

    function buy(address buyer, uint256 units) public onlyOwner {
        bool holder = isHolder(buyer);

        if (!holder) {
            newHolder(buyer, 0);
        }
        transferFrom(owner, buyer, units);
        checkInitialOffering(units);
        emit Buy(buyer, getBalance(buyer), initialOffering);
    }

    function sell(address seller, uint256 units) public onlyOwner {
        transferFrom(seller, owner, units);
        emit Sell(seller, getBalance(seller));
    }

    function clearOwnerTokens() public onlyOwner {
        uint256 ownerRemainingHoldings = StoneCoinStorageInt(
            stoneCoinStorageAddress
        )
            .getHoldingsUnits(owner);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(owner, 0);
        target = target.sub(ownerRemainingHoldings);
        initialOffering = false;
        emit OwnerTokenCleared(ownerRemainingHoldings);
    }

    function clearMortgage(address user, address _mortgageAddress)
        public
        onlyOwner
    {
        uint256 _units = StoneCoinMortgageInt(stoneCoinMortgageAddress)
            .balanceOfMortgage(user, _mortgageAddress);
        StoneCoinMortgageInt(stoneCoinMortgageAddress).clearMortgage(
            user,
            _mortgageAddress
        );

        uint256 userUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(user);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            user,
            userUnits.add(_units)
        );
    }

    function partlyForfeitureMortgage(
        address user,
        address mortgagee,
        address _mortgageAddress,
        uint256 _marketPriceMills,
        bool maxDefaulted
    ) public onlyOwner {
        partlyForfeitureTransfer(
            user,
            mortgagee,
            _mortgageAddress,
            _marketPriceMills,
            maxDefaulted
        );
        emit MortgageForfeiture(user, mortgagee, _mortgageAddress);
    }

    function buyMortgaged(address mortgageAddress, address buyer, uint256 units)
        public
    {
        bool holder = isHolder(buyer);
        if (!holder) {
            newHolder(buyer, 0);
        }
        transferBuyMortgaged(mortgageAddress, buyer, units);

        checkInitialOffering(units);
        emit BuyMortgaged(buyer, getBalance(buyer), initialOffering);
    }

    function checkInitialOffering(uint256 units) private onlyOwner {
        if (initialOffering == true) {
            initialOfferingUnits = initialOfferingUnits.add(units);
            if (initialOfferingUnits >= target) initialOffering = false;
        }
    }

    function getBalance(address user) public view returns (uint256 balance) {
        require(user != address(0));
        balance = StoneCoinStorageInt(stoneCoinStorageAddress).getHoldingsUnits(
            user
        );
    }

    function sellMortgaged(
        address mortgageAddress,
        address seller,
        uint256 amount
    ) public onlyOwner {
        transferSellMortgaged(mortgageAddress, seller, amount);
    }

    function getOwnerBalance() public view returns (uint256 balance) {
        balance = StoneCoinStorageInt(stoneCoinStorageAddress).getHoldingsUnits(
            owner
        );
        return balance;
    }

    function balanceOf(address _user) public view returns (uint256) {
        if (stoneCoinMortgageAddress != address(0)) {
            uint256 result = StoneCoinStorageInt(stoneCoinStorageAddress)
                .getHoldingsUnits(_user)
                .add(
                StoneCoinMortgageInt(stoneCoinMortgageAddress).balanceOf(_user)
            );
            return result;
        } else {
            return
                StoneCoinStorageInt(stoneCoinStorageAddress).getHoldingsUnits(
                    _user
                );
        }
    }

    function getMinBulkSize() external view returns (uint256) {
        uint256 ownerHoldings = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(owner);
        if (ownerHoldings < minBulkSize) {
            return ownerHoldings;
        }
        return minBulkSize;
    }

    function getMaxBulkSize() external view returns (uint256) {
        return maxBulkSize;
    }

    function dilutionStoneCoin(uint256 dilutionUnits) public onlyOwner {
        uint256 contractOwnerUnits = StoneCoinStorageInt(
            stoneCoinStorageAddress
        )
            .getHoldingsUnits(owner);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            owner,
            contractOwnerUnits.add(dilutionUnits)
        );

        StoneCoinStorageInt(stoneCoinStorageAddress).addStones(dilutionUnits);
    }

    function removeStoneCoin(uint256 units) public onlyOwner {
        uint256 contractOwnerUnits = StoneCoinStorageInt(
            stoneCoinStorageAddress
        )
            .getHoldingsUnits(owner);
        require(contractOwnerUnits >= units);
        StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
            owner,
            contractOwnerUnits.sub(units)
        );

        StoneCoinStorageInt(stoneCoinStorageAddress).removeStones(units);
    }

    function setMinBulkSize(uint256 bulkSize) public onlyOwner {
        minBulkSize = bulkSize;
    }
    function setMaxBulkSize(uint256 bulkSize) public onlyOwner {
        maxBulkSize = bulkSize;
    }
    function setOrganization(address _organization) public onlyOwner {
        organization = _organization;
    }

    function addDocument(bytes32 _url, bytes32 _urlMD5) public onlyOwner {
        url.push(_url);
        urlMD5.push(_urlMD5);
    }

    function getDocumentsLength() external view returns (uint256) {
        return url.length;
    }

    function forecloseTokens(
        address _user,
        address mortgageAddress,
        address _to,
        bool sale
    ) public onlyOwner {
        uint256 _toUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(_to);
        uint256 _userUnits = StoneCoinStorageInt(stoneCoinStorageAddress)
            .getHoldingsUnits(_user);
        if (mortgageAddress != address(0)) {
            uint256 mortgagedUnits = StoneCoinMortgageInt(
                stoneCoinMortgageAddress
            )
                .balanceOfMortgage(_user, mortgageAddress);
            StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
                _to,
                _toUnits.add(mortgagedUnits)
            );
            if (sale) {
                initialOfferingUnits = initialOfferingUnits.sub(mortgagedUnits);
            }
            StoneCoinMortgageInt(stoneCoinMortgageAddress).forecloseTokens(
                _user,
                mortgageAddress
            );
        } else {
            StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
                _to,
                _toUnits.add(_userUnits)
            );
            if (sale) {
                initialOfferingUnits = initialOfferingUnits.sub(_userUnits);
            }
            StoneCoinStorageInt(stoneCoinStorageAddress).setHoldingsUnits(
                _user,
                0
            );

        }
    }

}
