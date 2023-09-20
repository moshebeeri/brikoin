pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./interfaces/CornerStoneBaseInt.sol";
import "./interfaces/MortgageOperationsInt.sol";
import "./interfaces/MortgageStoneStorageInt.sol";
import "./interfaces/MortgageInt.sol";
import "./interfaces/MortgageStoneInt.sol";
import "./interfaces/Ownables.sol";
import "./interfaces/MortgageRequestInt.sol";

contract MortgageStone is Ownables, MortgageStoneInt {
    using SafeMath for uint256;

    event BidMortgageCreated(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        uint256 available
    );
    event AskMortgageCreated(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros
    );
    event TradeMortgaged(
        address stoneCoinAddress,
        address buyer,
        address seller,
        uint256 amount,
        uint256 price
    );
    event BuyerMortgageeInsufficientBalance();
    event MortgageeAdded(
        address newMortgagee,
        uint256 microUSDs,
        uint256 maxMortgage
    );
    event MortgageeAddFunds(
        address newMortgagee,
        uint256 microUSDs,
        uint256 maxMortgage
    );
    event TradeMortgageCreated(uint64 key);
    event debug(address buyer, uint256 value, uint256 budget);
    event MortgageDefaulted(
        address mortgageAddress,
        address buyer,
        address mortgagee,
        uint256 balance,
        uint256 value,
        uint256 timestamp
    );
    event MortgagePayment(
        address mortgageAddress,
        address buyer,
        address mortgagee,
        uint256 balance,
        uint256 value,
        uint256 timestamp
    );

    address public cornerStoneBaseAddress;
    address mortgageOperationsAddress;
    address storageAddress;
    constructor() public Ownables() {}

    function setStoneBaseAddress(address _cornerStoneBaseAddress)
        public
        onlyOwner
    {
        cornerStoneBaseAddress = _cornerStoneBaseAddress;
    }
    function setStorageAddress(address _storageAddress) public onlyOwner {
        storageAddress = _storageAddress;
    }

    function setMortgageOperationAddress(address _mortgageOperationsAddress)
        public
        onlyOwner
    {
        mortgageOperationsAddress = _mortgageOperationsAddress;
    }

    function addMortgageBalance(address _user, uint256 microUSDs)
        public
        onlyOwner
    {
        MortgageStoneStorageInt(storageAddress).setMortgageeBalance(
            _user,
            MortgageStoneStorageInt(storageAddress)
                .getMortgageeBalance(_user)
                .add(microUSDs)
        );

    }

    function bidAmount(address stoneCoinAddress, address user)
        public
        view
        returns (uint256)
    {
        return
            MortgageStoneStorageInt(storageAddress).bidAmount(
                user,
                stoneCoinAddress
            );
    }

    function bidValueHold(address stoneCoinAddress, address user)
        public
        view
        returns (uint256)
    {
        return
            MortgageStoneStorageInt(storageAddress).bidMortgageValueHold(
                user,
                stoneCoinAddress
            );
    }

    function isBidMortgaged(address stoneCoinAddress, address user)
        public
        view
        returns (bool)
    {
        return
            MortgageStoneStorageInt(storageAddress).bidMortgaged(
                user,
                stoneCoinAddress
            );
    }

    function setBidAmount(
        address stoneCoinAddress,
        address user,
        uint256 amount
    ) public onlyOwner returns (uint256) {
        MortgageStoneStorageInt(storageAddress).setBidAmount(
            stoneCoinAddress,
            user,
            amount
        );
        MortgageStoneStorageInt(storageAddress).setBidMortgaged(
            stoneCoinAddress,
            user,
            false
        );
    }

    function setBidLimit(address stoneCoinAddress, address user, uint256 limit)
        public
        onlyOwner
        returns (uint256)
    {
        MortgageStoneStorageInt(storageAddress).setBidLimit(
            stoneCoinAddress,
            user,
            limit
        );
    }

    function setAskAmount(
        address stoneCoinAddress,
        address user,
        uint256 amount
    ) public onlyOwner returns (uint256) {
        MortgageStoneStorageInt(storageAddress).setAskAmount(
            stoneCoinAddress,
            user,
            amount
        );
        MortgageStoneStorageInt(storageAddress).setAskMortgaged(
            stoneCoinAddress,
            user,
            false
        );
    }

    function setAskLimit(address stoneCoinAddress, address user, uint256 limit)
        public
        onlyOwner
        returns (uint256)
    {
        MortgageStoneStorageInt(storageAddress).setAskLimit(
            stoneCoinAddress,
            user,
            limit
        );
    }

    function setBidValueHold(
        address stoneCoinAddress,
        address user,
        uint256 valueHold
    ) public onlyOwner returns (uint256) {
        MortgageStoneStorageInt(storageAddress).setBidValueHold(
            stoneCoinAddress,
            user,
            valueHold
        );
    }

    function askAmount(address stoneCoinAddress, address user)
        public
        view
        returns (uint256)
    {
        return
            MortgageStoneStorageInt(storageAddress).askAmount(
                user,
                stoneCoinAddress
            );
    }

    function withdrawMortgageBalance(address _user, uint256 microUSDs)
        public
        onlyOwner
    {
        uint256 userBalance = MortgageStoneStorageInt(storageAddress)
            .getMortgageeBalance(_user);
        require(userBalance > 0);
        if (userBalance > microUSDs) {
            MortgageStoneStorageInt(storageAddress).setMortgageeBalance(
                _user,
                userBalance.sub(microUSDs)
            );
            CornerStoneBaseInt(cornerStoneBaseAddress).addBalance(
                _user,
                microUSDs,
                0,
                "WITHDRAW_MORTGAGE_BALANCE"
            );
            CornerStoneBaseInt(cornerStoneBaseAddress).subOwnerBalance(
                microUSDs
            );
        } else {
            CornerStoneBaseInt(cornerStoneBaseAddress).addBalance(
                _user,
                userBalance,
                0,
                "WITHDRAW_MORTGAGE_BALANCE"
            );
            CornerStoneBaseInt(cornerStoneBaseAddress).subOwnerBalance(
                userBalance
            );
            MortgageStoneStorageInt(storageAddress).setMortgageeBalance(
                _user,
                0
            );
        }
    }

    function mortgageeBalanceOf(address _user) public view returns (uint256) {
        return
            MortgageStoneStorageInt(storageAddress).getMortgageeBalance(_user);
    }

    function addMortgegee(
        address user,
        uint256 microUSDs,
        uint256 maxMortgage,
        address newMortgagee
    ) public onlyOwner returns (address) {
        require(microUSDs > 0);
        require(maxMortgage > 0);
        require(
            microUSDs <=
                CornerStoneBaseInt(cornerStoneBaseAddress).balanceOf(user)
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).subBalance(
            user,
            microUSDs,
            0,
            "MORTGAGEE_ADD"
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).addOwnerBalance(microUSDs);
        MortgageStoneStorageInt(storageAddress).setMortgageeBalance(
            user,
            microUSDs
        );
        emit MortgageeAdded(user, microUSDs, maxMortgage);
        return address(newMortgagee);
    }

    function mortgagePayment(
        address user,
        address mortgageAddress,
        uint256 marketPriceMills,
        uint256 paymentInMills
    ) public onlyOwner returns (uint256) {
        require(
            CornerStoneBaseInt(cornerStoneBaseAddress).isMortgageOperator(user)
        );
        uint256 buyerBalance;
        MortgageInt mortgage = MortgageInt(mortgageAddress);
        address _buyer = mortgage.getBuyer();
        uint256 _value = mortgage.getNextPayment();
        if (paymentInMills > 0) {
            require(
                CornerStoneBaseInt(cornerStoneBaseAddress).isMortgageFinance(
                    user
                )
            );
            _value = paymentInMills;
        }
        require(_value > 0);
        if (
            CornerStoneBaseInt(cornerStoneBaseAddress).balanceOf(_buyer) <
            _value
        ) {
            uint64 defaults = mortgage.getDefaultStatus();
            if (defaults == 2) {
                partlyForfeitureMortgage(
                    mortgage.getStoneCoinAddress(),
                    _buyer,
                    mortgage.getMortgagee(),
                    mortgageAddress,
                    marketPriceMills,
                    true
                );
                emit MortgageDefaulted(
                    mortgageAddress,
                    _buyer,
                    mortgage.getMortgagee(),
                    buyerBalance,
                    _value,
                    now
                );
                return buyerBalance;
            }
            MortgageOperationsInt(mortgageOperationsAddress).defaulted(
                mortgageAddress
            );
            partlyForfeitureMortgage(
                mortgage.getStoneCoinAddress(),
                _buyer,
                mortgage.getMortgagee(),
                mortgageAddress,
                marketPriceMills,
                false
            );
            buyerBalance = CornerStoneBaseInt(cornerStoneBaseAddress).balanceOf(
                _buyer
            );
            emit MortgageDefaulted(
                mortgageAddress,
                _buyer,
                mortgage.getMortgagee(),
                buyerBalance,
                _value,
                now
            );
            return buyerBalance;
        }
        transferMortgageBalance(
            _buyer,
            _value,
            mortgageAddress,
            mortgage.getStoneCoinAddress()
        );

        //check if close mortgage
        if (!mortgage.shouldRefinance()) {
            uint256 nextValue = mortgage.getNextPayment();
            if (nextValue == 0) {
                address stoneCoinAddress = mortgage.getStoneCoinAddress();
                CornerStoneBaseInt(cornerStoneBaseAddress).clearMortgage(
                    stoneCoinAddress,
                    _buyer,
                    mortgageAddress
                );
            }
        }
        buyerBalance = CornerStoneBaseInt(cornerStoneBaseAddress).balanceOf(
            _buyer
        );
        emit MortgagePayment(
            mortgageAddress,
            _buyer,
            mortgage.getMortgagee(),
            buyerBalance,
            _value,
            now
        );
        return _value;
    }

    function clearAllMortgage(address user, address mortgageAddress)
        public
        onlyOwner
        returns (uint256)
    {
        MortgageInt mortgage = MortgageInt(mortgageAddress);
        address _buyer = mortgage.getBuyer();
        uint256 _value = mortgage.getRemainingLoanBalance();
        require(user == _buyer);
        require(
            CornerStoneBaseInt(cornerStoneBaseAddress).balanceOf(_buyer) >
                _value
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).transferAll(
            _buyer,
            mortgage.getMortgagee(),
            _value,
            0,
            "CLEAR_MORTGAGE"
        );
        address stoneCoinAddress = mortgage.getStoneCoinAddress();
        clearMortgage(stoneCoinAddress, _buyer, mortgageAddress);
        return _value;
    }

    function bidMortgaged(
        address _user,
        address mortgageRequestAddress,
        address stoneCoinAddress,
        uint64 downPaymentMicros,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool successeded, uint256 available) {
        validateBidCreation(
            _user,
            mortgageRequestAddress,
            stoneCoinAddress,
            signDocument
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).subBalance(
            _user,
            downPaymentMicros,
            stoneCoinAddress,
            "BID_MORTGAGED"
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).addOwnerBalance(
            downPaymentMicros
        );

        createBidMortgage(
            limit_micros,
            amount,
            downPaymentMicros,
            mortgageOperationsAddress,
            _user,
            stoneCoinAddress
        );
        uint256 senderBalance = CornerStoneBaseInt(cornerStoneBaseAddress)
            .balanceOf(_user);
        emit BidMortgageCreated(
            msg.sender,
            stoneCoinAddress,
            amount,
            limit_micros,
            senderBalance
        );
        return (true, senderBalance);
    }

    function validateBidCreation(
        address _user,
        address mortgageRequestAddress,
        address stoneCoinAddress,
        address signDocument
    ) private {
        require(MortgageRequestInt(mortgageRequestAddress).isApproved());
        require(
            MortgageStoneStorageInt(storageAddress).bidAmount(
                _user,
                stoneCoinAddress
            ) ==
                0
        );
        if (signDocument != address(0)) {
            require(
                CornerStoneBaseInt(cornerStoneBaseAddress).checkSignature(
                    signDocument,
                    stoneCoinAddress
                )
            );
        }
    }

    function createBidMortgage(
        uint256 limit_micros,
        uint256 amount,
        uint256 downPaymentMicros,
        address mortgageRequestAddress,
        address _user,
        address stoneCoinAddress
    ) private {
        MortgageStoneStorageInt(storageAddress).createBid(
            limit_micros,
            amount,
            downPaymentMicros,
            true,
            mortgageRequestAddress,
            _user,
            stoneCoinAddress
        );
    }

    function askMortgaged(
        address user,
        address mortgageAddress,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool) {
        bool initialOffering = CornerStoneBaseInt(cornerStoneBaseAddress)
            .isInitialOffering(stoneCoinAddress);
        require(!initialOffering);
        require(
            MortgageStoneStorageInt(storageAddress).askAmount(
                user,
                stoneCoinAddress
            ) ==
                0
        );
        require(
            CornerStoneBaseInt(cornerStoneBaseAddress).checkSignature(
                signDocument,
                stoneCoinAddress
            )
        );

        MortgageStoneStorageInt(storageAddress).createAsk(
            limit_micros,
            amount,
            true,
            mortgageAddress,
            user,
            stoneCoinAddress
        );
        emit AskMortgageCreated(user, stoneCoinAddress, amount, limit_micros);
    }

    function createTradeMortgage(
        uint64 key,
        address _stoneCoinAddress,
        address _buyer,
        address _seller,
        address _buyerMortgage,
        address _sellerMortgage,
        uint256 _amount,
        uint256 _price
    ) public onlyOwner {
        if (_buyerMortgage != address(0)) {
            require(
                MortgageOperationsInt(mortgageOperationsAddress)
                    .isMortgageRegistered(_buyerMortgage)
            );
        }

        require(
            MortgageStoneStorageInt(storageAddress).bidAmount(
                _buyer,
                _stoneCoinAddress
            ) >=
                _amount
        );
        uint256 _valueHold = MortgageStoneStorageInt(storageAddress)
            .bidMortgageValueHold(_buyer, _stoneCoinAddress);
        bool _bidMortgaged = MortgageStoneStorageInt(storageAddress)
            .bidMortgaged(_buyer, _stoneCoinAddress);
        bool _askMortgaged = MortgageStoneStorageInt(storageAddress)
            .askMortgaged(_seller, _stoneCoinAddress);
        uint256 _payAmount = _amount.mul(_price);
        MortgageStoneStorageInt(storageAddress).createTradeMortgage(
            key,
            true,
            _stoneCoinAddress,
            _buyer,
            _seller,
            _buyerMortgage,
            _sellerMortgage,
            _amount,
            _price,
            _payAmount,
            _valueHold,
            _bidMortgaged,
            _askMortgaged
        );
        ////   require(stoneCoin.getMinBulkSize() <= _amount);
        require(
            MortgageStoneStorageInt(storageAddress).askAmount(
                _seller,
                _stoneCoinAddress
            ) >=
                _amount
        );

        emit TradeMortgageCreated(key);
    }

    function bidTradeMortgaged(
        address buyerMortgage,
        address buyer,
        uint256 valuePayed,
        address stoneCoin,
        uint256 _bidValueHold,
        uint256 amount,
        uint256 price
    ) private onlyOwner {
        if (
            MortgageStoneStorageInt(storageAddress).bidMortgaged(
                buyer,
                stoneCoin
            )
        ) {
            calculateBidTrade(
                buyerMortgage,
                valuePayed,
                buyer,
                _bidValueHold,
                amount,
                price,
                stoneCoin
            );
        } else {
            require(
                MortgageStoneStorageInt(storageAddress).bidMortgageValueHold(
                    buyer,
                    stoneCoin
                ) >=
                    valuePayed
            );
            CornerStoneBaseInt(cornerStoneBaseAddress).buy(
                stoneCoin,
                buyer,
                amount,
                price
            );
            uint256 newValue = MortgageStoneStorageInt(storageAddress)
                .bidMortgageValueHold(buyer, stoneCoin)
                .sub(valuePayed);
            MortgageStoneStorageInt(storageAddress).setBidValueHold(
                stoneCoin,
                buyer,
                newValue
            );

        }
        require(
            MortgageStoneStorageInt(storageAddress).bidAmount(
                buyer,
                stoneCoin
            ) >=
                0
        );
        uint256 newBidAmount = MortgageStoneStorageInt(storageAddress)
            .bidAmount(buyer, stoneCoin)
            .sub(amount);
        MortgageStoneStorageInt(storageAddress).setBidAmount(
            stoneCoin,
            buyer,
            newBidAmount
        );

        uint256 buyerValueHolds = MortgageStoneStorageInt(storageAddress)
            .bidMortgageValueHold(buyer, stoneCoin);
        if (
            MortgageStoneStorageInt(storageAddress).bidAmount(
                buyer,
                stoneCoin
            ) ==
            0 &&
            buyerValueHolds > 0
        ) {
            CornerStoneBaseInt(cornerStoneBaseAddress).addBalance(
                buyer,
                buyerValueHolds,
                stoneCoin,
                "BID_REQUEST"
            );
            CornerStoneBaseInt(cornerStoneBaseAddress).subOwnerBalance(
                buyerValueHolds
            );
            MortgageStoneStorageInt(storageAddress).setBidValueHold(
                stoneCoin,
                buyer,
                0
            );
        }

    }

    function calculateBidTrade(
        address buyerMortgage,
        uint256 valuePayed,
        address buyer,
        uint256 _bidValueHold,
        uint256 amount,
        uint256 price,
        address stoneCoin
    ) private {
        MortgageInt buyerMortgageInt = MortgageInt(buyerMortgage);
        require(buyerMortgageInt.getBuyer() == buyer);
        require(
            _bidValueHold.add(buyerMortgageInt.getLoanValue()) >= valuePayed
        );

        if (
            MortgageStoneStorageInt(storageAddress).getMortgageeBalance(
                buyerMortgageInt.getMortgagee()
            ) <
            buyerMortgageInt.getLoanValue()
        ) {
            emit BuyerMortgageeInsufficientBalance();
            return;
        }

        uint256 downPaymentMicro = buyerMortgageInt.getDownPayment();
        uint256 mortgageeBalance = MortgageStoneStorageInt(storageAddress)
            .getMortgageeBalance(buyerMortgageInt.getMortgagee());
        MortgageStoneStorageInt(storageAddress).setMortgageeBalance(
            buyerMortgageInt.getMortgagee(),
            mortgageeBalance.sub(valuePayed - downPaymentMicro)
        );
        uint256 newValueBid = MortgageStoneStorageInt(storageAddress)
            .bidMortgageValueHold(buyer, stoneCoin)
            .sub(downPaymentMicro);
        MortgageStoneStorageInt(storageAddress).setBidValueHold(
            stoneCoin,
            buyer,
            newValueBid
        );

        CornerStoneBaseInt(cornerStoneBaseAddress).buyMortgaged(
            stoneCoin,
            buyerMortgage,
            buyer,
            amount,
            price
        );

    }

    function askTradeMortgaged(
        uint64 key,
        address sellerMortgage,
        address seller,
        uint256 valuePayed,
        address stoneCoin,
        uint256 amount,
        uint256 price
    ) private onlyOwner {
        require(MortgageStoneStorageInt(storageAddress).isTradeValid(key));
        bool isInitialize = CornerStoneBaseInt(cornerStoneBaseAddress)
            .isInitialOffering(stoneCoin);
        if (
            MortgageStoneStorageInt(storageAddress).askMortgaged(
                seller,
                stoneCoin
            )
        ) {
            MortgageInt mortgage = MortgageInt(sellerMortgage);
            uint256 remainingLoanBalance = mortgage.getRemainingLoanBalance();
            if (valuePayed > remainingLoanBalance) {
                uint256 transferToSeller = valuePayed.sub(remainingLoanBalance);
                CornerStoneBaseInt(cornerStoneBaseAddress).addBalance(
                    seller,
                    transferToSeller,
                    stoneCoin,
                    "TRADE"
                );
                CornerStoneBaseInt(cornerStoneBaseAddress).subOwnerBalance(
                    transferToSeller
                );
                MortgageOperationsInt(mortgageOperationsAddress).clearance(
                    sellerMortgage,
                    remainingLoanBalance
                );
            } else {
                MortgageOperationsInt(mortgageOperationsAddress).clearance(
                    sellerMortgage,
                    valuePayed
                );
            }
            CornerStoneBaseInt(cornerStoneBaseAddress).sellMortgaged(
                stoneCoin,
                sellerMortgage,
                seller,
                amount,
                price
            );
        } else {
            if (!isInitialize) {
                CornerStoneBaseInt(cornerStoneBaseAddress).addBalance(
                    seller,
                    valuePayed,
                    stoneCoin,
                    "TRADE"
                );
                CornerStoneBaseInt(cornerStoneBaseAddress).subOwnerBalance(
                    valuePayed
                );
            }
            CornerStoneBaseInt(cornerStoneBaseAddress).sell(
                stoneCoin,
                seller,
                amount,
                price
            );
        }
        uint256 _askAmount = MortgageStoneStorageInt(storageAddress).askAmount(
            seller,
            stoneCoin
        );
        require(_askAmount >= 0 && _askAmount >= amount);
        MortgageStoneStorageInt(storageAddress).setAskAmount(
            stoneCoin,
            seller,
            _askAmount.sub(amount)
        );

    }

    function applyMortgageClearance(address mortgageAddress) public onlyOwner {
        MortgageOperationsInt(mortgageOperationsAddress).applyMortgageClearance(
            mortgageAddress
        );
    }

    function tradeMortgaged(uint64 key) public onlyOwner {
        require(MortgageStoneStorageInt(storageAddress).isTradeValid(key));
        address seller = MortgageStoneStorageInt(storageAddress).getTradeSeller(
            key
        );
        address stoneCoin = MortgageStoneStorageInt(storageAddress)
            .getTradeStoneCoin(key);
        uint256 amount = MortgageStoneStorageInt(storageAddress).getTradeAmount(
            key
        );
        uint256 price = MortgageStoneStorageInt(storageAddress).getTradePrice(
            key
        );
        address buyer = MortgageStoneStorageInt(storageAddress).getTradeBuyer(
            key
        );
        address buyerMortgage = MortgageStoneStorageInt(storageAddress)
            .getTradeBuyerMortgage(key);
        uint256 valuePayed = MortgageStoneStorageInt(storageAddress)
            .getTradeValuePayed(key);
        uint256 _bidValueHold = MortgageStoneStorageInt(storageAddress)
            .bidMortgageValueHold(buyer, stoneCoin);
        address sellerMortgage = MortgageStoneStorageInt(storageAddress)
            .getTradeSellerMortgage(key);
        askTradeMortgaged(
            key,
            sellerMortgage,
            seller,
            valuePayed,
            stoneCoin,
            amount,
            price
        );
        bidTradeMortgaged(
            buyerMortgage,
            buyer,
            valuePayed,
            stoneCoin,
            _bidValueHold,
            amount,
            price
        );

        MortgageStoneStorageInt(storageAddress).setTradeValid(key, false);
        emit TradeMortgaged(stoneCoin, buyer, seller, amount, price);
    }

    function transferMortgageBalance(
        address _buyer,
        uint256 _value,
        address mortgageAddress,
        address stoneCoinAddress
    ) public onlyOwner {
        MortgageInt mortgage = MortgageInt(mortgageAddress);
        CornerStoneBaseInt(cornerStoneBaseAddress).subBalance(
            _buyer,
            _value,
            stoneCoinAddress,
            "MORTGAGE_BALANCE"
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).addOwnerBalance(_value);
        // TODO
        CornerStoneBaseInt(cornerStoneBaseAddress).addBalance(
            mortgage.getMortgagee(),
            _value,
            stoneCoinAddress,
            "MORTGAGE_BALANCE"
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).subOwnerBalance(_value);
        MortgageOperationsInt(mortgageOperationsAddress).payed(mortgageAddress);
        uint256 clearances = mortgage.getTotalClearances();
        if (clearances > 0) {
            CornerStoneBaseInt(cornerStoneBaseAddress).subOwnerBalance(
                clearances
            );
            CornerStoneBaseInt(cornerStoneBaseAddress).addBalance(
                mortgage.getMortgagee(),
                clearances,
                stoneCoinAddress,
                "MORTGAGE_BALANCE"
            );
            applyMortgageClearance(mortgageAddress);
        }
    }

    function clearMortgage(
        address stoneCoinAddress,
        address user,
        address mortgageAddress
    ) public onlyOwner {
        MortgageOperationsInt(mortgageOperationsAddress).clearMortgage(
            mortgageAddress
        );
        CornerStoneBaseInt(cornerStoneBaseAddress).clearMortgage(
            stoneCoinAddress,
            user,
            mortgageAddress
        );

    }

    function partlyForfeitureMortgage(
        address stoneCoinAddress,
        address user,
        address mortgagee,
        address mortgageAddress,
        uint256 marketPriceMills,
        bool maxDefaulted
    ) public onlyOwner {
        CornerStoneBaseInt(cornerStoneBaseAddress).partlyForfeitureMortgage(
            stoneCoinAddress,
            user,
            mortgagee,
            mortgageAddress,
            marketPriceMills,
            maxDefaulted
        );
        if (maxDefaulted) {
            MortgageOperationsInt(mortgageOperationsAddress).clearMortgage(
                mortgageAddress
            );
        }
    }

}
