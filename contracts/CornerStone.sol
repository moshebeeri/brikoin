pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./structures/Disposition.sol";
import "./interfaces/MortgageStoneInt.sol";
import "./interfaces/StoneCoinInt.sol";
import "./interfaces/CornerStoneBaseInt.sol";
import "./interfaces/DispositionInt.sol";
import "./interfaces/Ownables.sol";

contract CornerStone is Ownables {
    using SafeMath for uint256;

    event BidCreated(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        uint256 available
    );
    event BidMortgageCreated(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        uint256 available
    );
    event BidCancel(address user, address stoneCoinAddress);
    event AskCreated(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros
    );
    event AskMortgageCreated(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros
    );
    event InitialAskCreated(address stoneCoinAddress, uint256 amount);
    event AskCancel(address user, address stoneCoinAddress);
    event Trade(
        address stoneCoinAddress,
        address buyer,
        address seller,
        uint256 amount,
        uint256 price,
        bool initi
    );
    event TradeMortgaged(
        address stoneCoinAddress,
        address buyer,
        address seller,
        uint256 amount,
        uint256 price
    );
    event TotalAllocated(uint256 total);
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
    event MortgageDefaulted(
        address mortgageAddress,
        address buyer,
        address mortgagee,
        uint256 balance,
        uint256 value,
        uint256 timestamp
    );
    event StoneCoinCreated(address stoneCoin);
    event MortgageCreated(address mortgage);
    event MortgagePayment(
        address mortgageAddress,
        address buyer,
        address mortgagee,
        uint256 balance,
        uint256 value,
        uint256 timestamp
    );

    address mortgageStoneAddress;
    address baseStoneAddress;
    address dispositionAddress;

    constructor() public Ownables() {}

    function setDispositionAddress(address _dispositionAddress)
        public
        onlyOwner
    {
        dispositionAddress = _dispositionAddress;
    }

    function setMortgageStoneAddress(address _mortgageStoneAddress)
        public
        onlyOwner
    {
        mortgageStoneAddress = _mortgageStoneAddress;
    }

    function setBaseStoneAddress(address _baseStoneAddress) public onlyOwner {
        baseStoneAddress = _baseStoneAddress;
    }

    function getBrokerManager() public view returns (address) {
        return CornerStoneBaseInt(baseStoneAddress).getBrokerManager();
    }

    function getTransactionManager() public view returns (address) {
        return CornerStoneBaseInt(baseStoneAddress).getTransactionManager();
    }

    function setTransactionManager(address user) public onlyOwner {
        CornerStoneBaseInt(baseStoneAddress).setTransactionManager(user);
    }

    function addBroker(address user) public onlyOwner {
        CornerStoneBaseInt(baseStoneAddress).addBroker(user, 0);
    }

    function addTokenApproveRole(address user) public onlyOwner {
        CornerStoneBaseInt(baseStoneAddress).addTokenApproveRole(user);
    }

    function setBrokerFees(
        address user,
        uint256 firstDealRatio,
        uint256 otherDealRatio,
        uint256 secondaryFee,
        address organization
    ) public onlyOwner {
        CornerStoneBaseInt(baseStoneAddress).setBrokerFees(
            user,
            firstDealRatio,
            otherDealRatio,
            secondaryFee,
            organization
        );
    }

    function payBroker(
        address broker,
        uint256 payment,
        address organization,
        address stoneCoinAddress
    ) public onlyOwner {
        CornerStoneBaseInt(baseStoneAddress).payBroker(
            broker,
            payment,
            organization,
            stoneCoinAddress
        );
    }
    function addUserToBroker(address user, address broker, address organization)
        public
        onlyOwner
    {
        CornerStoneBaseInt(baseStoneAddress).addUserToBroker(
            user,
            broker,
            organization
        );
    }

    function getTradesHistory() public view returns (address) {
        return CornerStoneBaseInt(baseStoneAddress).getTradesHistory();
    }

    function getFeeManager() public view returns (address) {
        return CornerStoneBaseInt(baseStoneAddress).getFeeManager();
    }

    function addFeeManagerRole(address user) public onlyOwner {
        CornerStoneBaseInt(baseStoneAddress).addFeeManagerRole(user);
    }

    function balanceOf(address _user) public view returns (uint256) {
        uint256 balance = CornerStoneBaseInt(baseStoneAddress).balanceOf(_user);
        return balance;
    }

    function getOwnerBalance() public view returns (uint256) {
        return CornerStoneBaseInt(baseStoneAddress).getOwnerBalance();
    }

    function getCornerBase() public view returns (address) {
        return baseStoneAddress;
    }

    function getInitialSupply() public view returns (uint256) {
        return CornerStoneBaseInt(baseStoneAddress).getInitialSupply();
    }

    function bidAmount(address stoneCoinAddress, address user)
        external
        view
        returns (uint256)
    {
        return
            MortgageStoneInt(mortgageStoneAddress).bidAmount(
                stoneCoinAddress,
                user
            );
    }
    function askAmount(address stoneCoinAddress, address user)
        external
        view
        returns (uint256)
    {
        return
            MortgageStoneInt(mortgageStoneAddress).askAmount(
                stoneCoinAddress,
                user
            );
    }

    function mortgageeBalanceOf(address _user) public view returns (uint256) {
        return MortgageStoneInt(mortgageStoneAddress).mortgageeBalanceOf(_user);
    }

    function withdrawMortgageBalance(uint256 microUSDs) public {
        MortgageStoneInt(mortgageStoneAddress).withdrawMortgageBalance(
            msg.sender,
            microUSDs
        );
    }

    function deposit(address payee, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        return CornerStoneBaseInt(baseStoneAddress).deposit(payee, amount, 0);
    }
    function depositProject(
        address payee,
        uint256 amount,
        address stoneCoinAddress
    ) public onlyOwner returns (bool) {
        return
            CornerStoneBaseInt(baseStoneAddress).deposit(
                payee,
                amount,
                stoneCoinAddress
            );
    }

    function withdrawApprove(
        address user,
        uint256 amount,
        address stoneCoinAddress
    ) public onlyOwner returns (bool) {
        return
            CornerStoneBaseInt(baseStoneAddress).withdrawApprove(
                user,
                amount,
                stoneCoinAddress
            );
    }

    function withdraw(address user, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        return CornerStoneBaseInt(baseStoneAddress).withdraw(user, amount);
    }

    //pay income
    function payIncome(address stoneCoinAddress, uint256 micros)
        public
        onlyOwner
        returns (uint256 remaining)
    {
        return
            CornerStoneBaseInt(baseStoneAddress).payIncome(
                stoneCoinAddress,
                micros
            );
    }

    function setUserDispositionState(address user, bool state)
        public
        onlyOwner
    {
        DispositionInt(dispositionAddress).setUserDisposition(user, state);
    }

    function setProjectDispositionState(address project, bool state)
        public
        onlyOwner
    {
        DispositionInt(dispositionAddress).setProjectDisposition(
            project,
            state
        );
    }

    function getTotalAllocated(address stoneCoinAddress)
        public
        view
        returns (uint256)
    {
        return
            CornerStoneBaseInt(baseStoneAddress).getTotalAllocated(
                stoneCoinAddress
            );
    }

    function getUserHoldings(address stoneCoinAddress, address user)
        public
        view
        returns (uint256)
    {
        return
            CornerStoneBaseInt(baseStoneAddress).getUserHoldings(
                stoneCoinAddress,
                user
            );
    }

    function addMortgageOperatorRole(address user) public onlyOwner {
        return
            CornerStoneBaseInt(baseStoneAddress).addMortgageOperatorRole(user);
    }
    function addMortgageFinanceRole(address user) public onlyOwner {
        return
            CornerStoneBaseInt(baseStoneAddress).addMortgageFinanceRole(user);
    }

    //StoneCoin project sold
    function closeStoneCoin(address stoneCoinAddress, uint256 micros)
        public
        onlyOwner
    {
        return
            CornerStoneBaseInt(baseStoneAddress).closeStoneCoin(
                stoneCoinAddress,
                micros
            );
    }

    function transferFromOwner(
        address stoneCoinAddress,
        address to,
        uint256 amount
    ) public onlyOwner returns (bool) {
        return
            CornerStoneBaseInt(baseStoneAddress).transferFromOwner(
                stoneCoinAddress,
                to,
                amount
            );
    }

    function bid(
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool successeded, uint256 available) {
        internalBid(
            msg.sender,
            stoneCoinAddress,
            amount,
            limit_micros,
            signDocument
        );
        uint256 bidderBalance = CornerStoneBaseInt(baseStoneAddress).balanceOf(
            msg.sender
        );
        return (true, bidderBalance);
    }

    function bidAdmin(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public onlyOwner {
        internalBid(user, stoneCoinAddress, amount, limit_micros, signDocument);
    }

    function reservedBid(address stoneCoinAddress) public {
        CornerStoneBaseInt(baseStoneAddress).reserveBid(
            msg.sender,
            stoneCoinAddress
        );
    }
    function reservedBidLost(address user, address stoneCoinAddress)
        public
        onlyOwner
    {
        CornerStoneBaseInt(baseStoneAddress).reservedBidLost(
            user,
            stoneCoinAddress
        );
    }

    function cancelReserveBid(address stoneCoinAddress) public {
        CornerStoneBaseInt(baseStoneAddress).cancelReserveBid(
            msg.sender,
            stoneCoinAddress
        );
    }

    function getReserveBid(address _stoneCoinAddress)
        public
        view
        returns (uint256)
    {
        return
            CornerStoneBaseInt(baseStoneAddress).getReserveBid(
                msg.sender,
                _stoneCoinAddress
            );
    }

    function internalBid(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) private {
        require(StoneCoinInt(stoneCoinAddress).getMinBulkSize() <= amount);
        require(StoneCoinInt(stoneCoinAddress).getMaxBulkSize() >= amount);
        require(
            MortgageStoneInt(mortgageStoneAddress).bidAmount(
                stoneCoinAddress,
                user
            ) ==
                0
        );
        require(checkSignature(signDocument, stoneCoinAddress));
        require(DispositionInt(dispositionAddress).checkUserDisposition(user));
        require(
            DispositionInt(dispositionAddress).checkProjectDisposition(
                stoneCoinAddress
            )
        );
        uint256 value = amount.mul(limit_micros);

        // hold funds been bid
        CornerStoneBaseInt(baseStoneAddress).subBalance(
            user,
            value,
            stoneCoinAddress,
            "INTERNAL_BID"
        );
        CornerStoneBaseInt(baseStoneAddress).addOwnerBalance(value);

        MortgageStoneInt(mortgageStoneAddress).setBidLimit(
            stoneCoinAddress,
            user,
            limit_micros
        );
        MortgageStoneInt(mortgageStoneAddress).setBidAmount(
            stoneCoinAddress,
            user,
            amount
        );
        MortgageStoneInt(mortgageStoneAddress).setBidValueHold(
            stoneCoinAddress,
            user,
            value
        );
        uint256 bidderBalance = CornerStoneBaseInt(baseStoneAddress).balanceOf(
            user
        );
        emit BidCreated(
            msg.sender,
            stoneCoinAddress,
            amount,
            limit_micros,
            bidderBalance
        );
    }

    function checkSignature(address signDocument, address stoneCoinAddress)
        public
        returns (bool)
    {
        return
            CornerStoneBaseInt(baseStoneAddress).checkSignature(
                signDocument,
                stoneCoinAddress
            );
    }

    function bidCancel(address stoneCoinAddress) public {
        bidCancelInternal(msg.sender, stoneCoinAddress);
    }

    function bidCancelAdmin(address user, address stoneCoinAddress)
        public
        onlyOwner
    {
        bidCancelInternal(user, stoneCoinAddress);
    }

    function bidCancelInternal(address user, address stoneCoinAddress)
        private
        returns (bool successeded, uint256 available)
    {
        // add back funds been in bid
        uint256 valueHold = MortgageStoneInt(mortgageStoneAddress).bidValueHold(
            stoneCoinAddress,
            user
        );
        CornerStoneBaseInt(baseStoneAddress).addBalance(
            user,
            valueHold,
            stoneCoinAddress,
            "CANCEL_BID"
        );
        CornerStoneBaseInt(baseStoneAddress).subOwnerBalance(valueHold);

        MortgageStoneInt(mortgageStoneAddress).setBidLimit(
            stoneCoinAddress,
            user,
            0
        );
        MortgageStoneInt(mortgageStoneAddress).setBidAmount(
            stoneCoinAddress,
            user,
            0
        );
        MortgageStoneInt(mortgageStoneAddress).setBidValueHold(
            stoneCoinAddress,
            user,
            0
        );
        emit BidCancel(user, stoneCoinAddress);
        return (true, CornerStoneBaseInt(baseStoneAddress).balanceOf(user));
    }

    function initialAsk(address stoneCoinAddress, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        MortgageStoneInt(mortgageStoneAddress).setAskLimit(
            stoneCoinAddress,
            msg.sender,
            1000000
        );
        MortgageStoneInt(mortgageStoneAddress).setAskAmount(
            stoneCoinAddress,
            msg.sender,
            amount
        );
        emit InitialAskCreated(stoneCoinAddress, amount);
        return true;
    }
    function initialAskAdmin(
        address adminUser,
        address stoneCoinAddress,
        uint256 amount
    ) public onlyOwner returns (bool) {
        MortgageStoneInt(mortgageStoneAddress).setAskLimit(
            stoneCoinAddress,
            adminUser,
            1000000
        );
        MortgageStoneInt(mortgageStoneAddress).setAskAmount(
            stoneCoinAddress,
            adminUser,
            amount
        );
        emit InitialAskCreated(stoneCoinAddress, amount);
        return true;
    }

    function ask(
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool) {
        internalAsk(
            msg.sender,
            stoneCoinAddress,
            amount,
            limit_micros,
            signDocument
        );
        return true;
    }

    function askAdmin(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public onlyOwner returns (bool) {
        internalAsk(user, stoneCoinAddress, amount, limit_micros, signDocument);
        return true;
    }

    function internalAsk(
        address user,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) private {
        bool isInitialize = CornerStoneBaseInt(baseStoneAddress)
            .isInitialOffering(stoneCoinAddress);
        require(StoneCoinInt(stoneCoinAddress).getMinBulkSize() <= amount);
        require(StoneCoinInt(stoneCoinAddress).getOwnerTokens() == 0);
        require(StoneCoinInt(stoneCoinAddress).getMaxBulkSize() >= amount);
        require(DispositionInt(dispositionAddress).checkUserDisposition(user));
        require(
            DispositionInt(dispositionAddress).checkProjectDisposition(
                stoneCoinAddress
            )
        );
        require(
            !isInitialize &&
                MortgageStoneInt(mortgageStoneAddress).askAmount(
                    stoneCoinAddress,
                    user
                ) ==
                0
        );
        require(
            MortgageStoneInt(mortgageStoneAddress).askAmount(
                stoneCoinAddress,
                user
            ) ==
                0
        );
        require(checkSignature(signDocument, stoneCoinAddress));
        MortgageStoneInt(mortgageStoneAddress).setAskLimit(
            stoneCoinAddress,
            user,
            limit_micros
        );
        MortgageStoneInt(mortgageStoneAddress).setAskAmount(
            stoneCoinAddress,
            user,
            amount
        );
        emit AskCreated(user, stoneCoinAddress, amount, limit_micros);
    }

    function askCancelAdmin(address user, address stoneCoinAddress)
        public
        onlyOwner
        returns (bool)
    {
        askCancelInternal(user, stoneCoinAddress);
        return true;
    }
    function askCancel(address stoneCoinAddress) public returns (bool) {
        askCancelInternal(msg.sender, stoneCoinAddress);
        return true;
    }
    function askCancelInternal(address user, address stoneCoinAddress)
        private
        returns (bool)
    {
        MortgageStoneInt(mortgageStoneAddress).setAskLimit(
            stoneCoinAddress,
            user,
            0
        );
        MortgageStoneInt(mortgageStoneAddress).setAskAmount(
            stoneCoinAddress,
            user,
            0
        );
        emit AskCancel(msg.sender, stoneCoinAddress);
        return true;
    }

    function trade(
        address stoneCoinAddress,
        address buyer,
        address seller,
        uint256 amount,
        uint256 price,
        address taxes
    ) public onlyOwner returns (bool) {
        require(DispositionInt(dispositionAddress).checkUserDisposition(buyer));
        require(
            DispositionInt(dispositionAddress).checkUserDisposition(seller)
        );
        require(
            DispositionInt(dispositionAddress).checkProjectDisposition(
                stoneCoinAddress
            )
        );

        uint256 askTradeAmount = MortgageStoneInt(mortgageStoneAddress)
            .askAmount(stoneCoinAddress, seller);
        uint256 valuePayed = amount.mul(price);
        uint256 tradeBidAmount = MortgageStoneInt(mortgageStoneAddress)
            .bidAmount(stoneCoinAddress, buyer);
        require(tradeBidAmount >= amount);
        require(askTradeAmount >= amount);
        uint256 valueHold = MortgageStoneInt(mortgageStoneAddress).bidValueHold(
            stoneCoinAddress,
            buyer
        );
        require(valueHold >= valuePayed);
        CornerStoneBaseInt(baseStoneAddress).addBalance(
            seller,
            valuePayed,
            stoneCoinAddress,
            "TRADE"
        );
        MortgageStoneInt(mortgageStoneAddress).setBidValueHold(
            stoneCoinAddress,
            buyer,
            valueHold.sub(valuePayed)
        );
        uint256 remainingValueHold = MortgageStoneInt(mortgageStoneAddress)
            .bidValueHold(stoneCoinAddress, buyer);

        CornerStoneBaseInt(baseStoneAddress).subOwnerBalance(valuePayed);

        MortgageStoneInt(mortgageStoneAddress).setAskAmount(
            stoneCoinAddress,
            seller,
            askTradeAmount.sub(amount)
        );
        MortgageStoneInt(mortgageStoneAddress).setBidAmount(
            stoneCoinAddress,
            buyer,
            tradeBidAmount.sub(amount)
        );
        require(
            MortgageStoneInt(mortgageStoneAddress).bidAmount(
                stoneCoinAddress,
                buyer
            ) >=
                0
        );
        doTrade(
            stoneCoinAddress,
            buyer,
            seller,
            price,
            amount,
            remainingValueHold
        );
        CornerStoneBaseInt(baseStoneAddress).calculateTax(taxes, buyer, seller);
        return true;
    }

    function doTrade(
        address stoneCoinAddress,
        address buyer,
        address seller,
        uint256 price,
        uint256 amount,
        uint256 remainingValueHold
    ) private onlyOwner {
        if (
            MortgageStoneInt(mortgageStoneAddress).bidAmount(
                stoneCoinAddress,
                buyer
            ) ==
            0 &&
            remainingValueHold > 0
        ) {
            //bid ended and user hold more then buy value.
            MortgageStoneInt(mortgageStoneAddress).setBidValueHold(
                stoneCoinAddress,
                buyer,
                0
            );
            CornerStoneBaseInt(baseStoneAddress).addBalance(
                buyer,
                remainingValueHold,
                stoneCoinAddress,
                "TRADE"
            );
            CornerStoneBaseInt(baseStoneAddress).subOwnerBalance(
                remainingValueHold
            );
        }

        CornerStoneBaseInt(baseStoneAddress).sell(
            stoneCoinAddress,
            seller,
            amount,
            price
        );
        CornerStoneBaseInt(baseStoneAddress).buy(
            stoneCoinAddress,
            buyer,
            amount,
            price
        );
        bool isInitialize = CornerStoneBaseInt(baseStoneAddress)
            .isInitialOffering(stoneCoinAddress);
        emit Trade(
            stoneCoinAddress,
            buyer,
            seller,
            amount,
            price,
            isInitialize
        );

    }

    function addMortgegee(
        uint256 microUSDs,
        uint256 maxMortgage,
        address newMortgagee
    ) public returns (address) {
        return
            addMortgegeeInternal(
                msg.sender,
                microUSDs,
                maxMortgage,
                newMortgagee
            );
    }

    function addMortgegeeAdmin(
        address user,
        uint256 microUSDs,
        uint256 maxMortgage,
        address newMortgagee
    ) public onlyOwner returns (address) {
        return addMortgegeeInternal(user, microUSDs, maxMortgage, newMortgagee);
    }

    function addMortgegeeInternal(
        address user,
        uint256 microUSDs,
        uint256 maxMortgage,
        address newMortgagee
    ) private returns (address) {
        require(microUSDs > 0);
        require(maxMortgage > 0);
        require(
            microUSDs <= CornerStoneBaseInt(baseStoneAddress).balanceOf(user)
        );
        CornerStoneBaseInt(baseStoneAddress).subBalance(
            user,
            microUSDs,
            0,
            "MORTGAGEE_DEPOSIT"
        );
        CornerStoneBaseInt(baseStoneAddress).addOwnerBalance(microUSDs);
        MortgageStoneInt(mortgageStoneAddress).addMortgageBalance(
            user,
            microUSDs
        );
        emit MortgageeAdded(user, microUSDs, maxMortgage);
        return address(newMortgagee);
    }

    function mortgagePayment(address mortgageAddress, uint256 marketPriceMills)
        public
        returns (uint256)
    {
        return
            MortgageStoneInt(mortgageStoneAddress).mortgagePayment(
                msg.sender,
                mortgageAddress,
                marketPriceMills,
                0
            );
    }
    function trustedMortgagePayment(
        address mortgageAddress,
        uint256 marketPriceMills,
        uint256 paymentInMills
    ) public returns (uint256) {
        return
            MortgageStoneInt(mortgageStoneAddress).mortgagePayment(
                msg.sender,
                mortgageAddress,
                marketPriceMills,
                paymentInMills
            );
    }

    function clearAllMortgage(address mortgageAddress)
        public
        returns (uint256)
    {
        return
            MortgageStoneInt(mortgageStoneAddress).clearAllMortgage(
                msg.sender,
                mortgageAddress
            );
    }

    function bidMortgaged(
        address mortgageRequestAddress,
        address stoneCoinAddress,
        uint64 downPaymentMicros,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool successeded, uint256 available) {
        bidMortgagedInternal(
            msg.sender,
            mortgageRequestAddress,
            stoneCoinAddress,
            downPaymentMicros,
            amount,
            limit_micros,
            signDocument
        );
        uint256 senderBalance = CornerStoneBaseInt(baseStoneAddress).balanceOf(
            msg.sender
        );
        return (true, senderBalance);
    }

    function bidMortgagedAdmin(
        address user,
        address mortgageRequestAddress,
        address stoneCoinAddress,
        uint64 downPaymentMicros,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public onlyOwner {
        bidMortgagedInternal(
            user,
            mortgageRequestAddress,
            stoneCoinAddress,
            downPaymentMicros,
            amount,
            limit_micros,
            signDocument
        );
    }

    function bidMortgagedInternal(
        address user,
        address mortgageRequestAddress,
        address stoneCoinAddress,
        uint64 downPaymentMicros,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) private {
        require(
            DispositionInt(dispositionAddress).checkProjectDisposition(
                stoneCoinAddress
            )
        );
        require(DispositionInt(dispositionAddress).checkUserDisposition(user));
        require(StoneCoinInt(stoneCoinAddress).getMinBulkSize() <= amount);
        require(StoneCoinInt(stoneCoinAddress).getMaxBulkSize() >= amount);
        MortgageStoneInt(mortgageStoneAddress).bidMortgaged(
            user,
            mortgageRequestAddress,
            stoneCoinAddress,
            downPaymentMicros,
            amount,
            limit_micros,
            signDocument
        );
        uint256 senderBalance = CornerStoneBaseInt(baseStoneAddress).balanceOf(
            user
        );
        emit BidMortgageCreated(
            user,
            stoneCoinAddress,
            amount,
            limit_micros,
            senderBalance
        );
    }

    function askMortgaged(
        address mortgageAddress,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public returns (bool) {
        askMortgagedInternal(
            msg.sender,
            mortgageAddress,
            stoneCoinAddress,
            amount,
            limit_micros,
            signDocument
        );
        return true;
    }

    function askMortgagedAdmin(
        address user,
        address mortgageAddress,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) public onlyOwner returns (bool) {
        askMortgagedInternal(
            user,
            mortgageAddress,
            stoneCoinAddress,
            amount,
            limit_micros,
            signDocument
        );
        return true;
    }

    function askMortgagedInternal(
        address user,
        address mortgageAddress,
        address stoneCoinAddress,
        uint256 amount,
        uint256 limit_micros,
        address signDocument
    ) private {
        require(DispositionInt(dispositionAddress).checkUserDisposition(user));
        require(
            DispositionInt(dispositionAddress).checkProjectDisposition(
                stoneCoinAddress
            )
        );
        require(StoneCoinInt(stoneCoinAddress).getOwnerTokens() == 0);
        require(StoneCoinInt(stoneCoinAddress).getMinBulkSize() <= amount);
        require(StoneCoinInt(stoneCoinAddress).getMaxBulkSize() >= amount);
        bool isInitialOffering = CornerStoneBaseInt(baseStoneAddress)
            .isInitialOffering(stoneCoinAddress);
        require(!isInitialOffering);
        require(
            MortgageStoneInt(mortgageStoneAddress).askAmount(
                stoneCoinAddress,
                user
            ) ==
                0
        );
        MortgageStoneInt(mortgageStoneAddress).askMortgaged(
            user,
            mortgageAddress,
            stoneCoinAddress,
            amount,
            limit_micros,
            signDocument
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
        uint256 _price,
        address taxes
    ) public onlyOwner {
        require(
            DispositionInt(dispositionAddress).checkUserDisposition(_buyer)
        );
        require(
            DispositionInt(dispositionAddress).checkUserDisposition(_seller)
        );
        require(
            DispositionInt(dispositionAddress).checkProjectDisposition(
                _stoneCoinAddress
            )
        );
        MortgageStoneInt(mortgageStoneAddress).createTradeMortgage(
            key,
            _stoneCoinAddress,
            _buyer,
            _seller,
            _buyerMortgage,
            _sellerMortgage,
            _amount,
            _price
        );
        MortgageStoneInt(mortgageStoneAddress).tradeMortgaged(key);
        CornerStoneBaseInt(baseStoneAddress).calculateTax(
            taxes,
            _buyer,
            _seller
        );

        emit TradeMortgageCreated(key);
    }

    function applyMortgageClearance(address mortgageAddress) public onlyOwner {
        MortgageStoneInt(mortgageStoneAddress).applyMortgageClearance(
            mortgageAddress
        );
    }

}
