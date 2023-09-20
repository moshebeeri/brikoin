pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Mortgage.sol";
import "./factory/StoneCoinFactory.sol";

import "./CornerTransaction.sol";

import "./Mortgagee.sol";

import "./interfaces/CornerStoneBaseInt.sol";
import "./interfaces/TradesHistoryInt.sol";
import "./interfaces/FeeManagerInt.sol";
import "./interfaces/BrokerManagerInt.sol";
import "./interfaces/StoneCoinMortgageInt.sol";
import "./interfaces/SignedDocumentInt.sol";
import "./interfaces/CornerTransactionInt.sol";
import "./interfaces/CornerStoneBaseStorageInt.sol";
import "./interfaces/StoneCoinInt.sol";
import "./interfaces/Ownables.sol";
import "./interfaces/TransactionTaxesInt.sol";
import "./interfaces/TaxEntityInt.sol";

contract CornerStoneBase is Ownables, CornerStoneBaseInt {
    using SafeMath for uint256;

    event WithdrawPending(
        address indexed from,
        uint256 amount,
        uint256 balance
    );
    event Withdraw(address indexed from, uint256 amount, uint256 balance);
    event Deposit(address indexed to, uint256 amount, uint256 balance);
    event Investment(
        address investor,
        address stoneCoinAddress,
        uint256 amount,
        uint256 total
    );
    event StoneTransferred(
        address payee,
        address payer,
        bytes32 stoneCoinName,
        uint256 price,
        uint256 amount
    );
    event Transfer(address _from, address _to, uint256 _value);
    event StoneCoinCreated(bytes32 name);
    event IncomePayment(
        address holder,
        uint256 userShare,
        address stoneCoinAddress,
        uint256 holders
    );
    event TransferFromOwner(
        address stoneCoinAddress,
        address to,
        uint256 amount
    );

    address tradesHistoryAddress;
    address feeManagerAddress;
    address brokerManagerAddress;
    address cornerTransactionAddress;
    address cornerStoneBaseStorageAddress;
    constructor() public Ownables() {}

    function setCornerStoneBaseStorage(address _cornerStoneBaseStorageAddress)
        public
        onlyOwner
    {
        cornerStoneBaseStorageAddress = _cornerStoneBaseStorageAddress;
    }

    function init() public onlyOwner {
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress).setUserBalance(
            msg.sender,
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getInitialSupply()
        );
    }

    function setNewTraderHistory(address _tradesHistoryAddress)
        public
        onlyOwner
    {
        tradesHistoryAddress = _tradesHistoryAddress;
    }

    function setNewCornerTransaction(address _cornerTransactionAddress)
        public
        onlyOwner
    {
        cornerTransactionAddress = _cornerTransactionAddress;
    }

    function setNewFeeManager(address _feeManagerAddress) public onlyOwner {
        feeManagerAddress = _feeManagerAddress;
    }

    function setNewBrokerManager(address _brokerManagerAddress)
        public
        onlyOwner
    {
        brokerManagerAddress = _brokerManagerAddress;
    }

    function getBrokerManager() public view returns (address) {
        return brokerManagerAddress;
    }
    function getTransactionManager() public view returns (address) {
        return cornerTransactionAddress;
    }
    function setBrokerFees(
        address user,
        uint256 firstDealRatio,
        uint256 otherDealRatio,
        uint256 secondaryFee,
        address organization
    ) public onlyOwner {
        BrokerManagerInt(brokerManagerAddress).setBrokerFees(
            user,
            firstDealRatio,
            otherDealRatio,
            secondaryFee,
            organization
        );
    }

    function addBroker(address user, address organization) public onlyOwner {
        BrokerManagerInt(brokerManagerAddress).addBroker(user, organization);
    }
    function setTransactionManager(address user) public onlyOwner {
        CornerTransactionInt(cornerTransactionAddress).setTransactionManager(
            user
        );
    }

    function addUserToBroker(address user, address broker, address organization)
        public
        onlyOwner
    {
        BrokerManagerInt(brokerManagerAddress).addUserToBroker(
            user,
            broker,
            organization
        );
    }

    function getTradesHistory() public view returns (address) {
        return tradesHistoryAddress;
    }

    function getFeeManager() public view returns (address) {
        return feeManagerAddress;
    }

    function addFeeManagerRole(address user) public onlyOwner {
        FeeManagerInt(feeManagerAddress).setFeeManagerRole(user);
    }

    function isMortgageOperator(address _user) public view returns (bool) {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getMortgageOperatorRoles(_user);
    }

    function isMortgageFinance(address _user) public view returns (bool) {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getMortgageFinanceRoles(_user);
    }

    function isTokenApproveRole(address _user) public view returns (bool) {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getTokenApproveRoles(_user);
    }

    function addMortgageOperatorRole(address _user) public onlyOwner {
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
            .setMortgageOperatorRoles(_user, true);
    }

    function addMortgageFinanceRole(address _user) public onlyOwner {
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
            .setMortgageFinanceRoles(_user, true);
    }

    function addTokenApproveRole(address _user) public onlyOwner {
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
            .setTokenApproveRoles(_user, true);
    }

    function subBalance(
        address _user,
        uint256 _value,
        address stoneCoin,
        string operation
    ) public onlyOwner returns (uint256) {
        if (stoneCoin != address(0)) {
            uint256 reserveBid = getReserveBid(_user, stoneCoin);
            if (reserveBid > 0) {
                uint256 totalFund = reserveBid.add(
                    CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                        .getUserBalance(_user)
                );
                require(totalFund >= _value);
                cancelReserveBid(_user, stoneCoin);
            } else {
                require(
                    CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                        .getUserBalance(_user) >=
                        _value
                );
            }
            CornerTransactionInt(cornerTransactionAddress).addTransaction(
                _user,
                false,
                _value,
                stoneCoin,
                operation
            );
        } else {
            require(
                CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                    .getUserBalance(_user) >=
                    _value
            );

        }
        uint256 userBalance = CornerStoneBaseStorageInt(
            cornerStoneBaseStorageAddress
        )
            .getUserBalance(_user)
            .sub(_value);
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress).setUserBalance(
            _user,
            userBalance
        );
        return userBalance;
    }

    function reserveBid(address _user, address _stoneCoinAddress)
        public
        onlyOwner
    {
        uint256 bidReserved = StoneCoinInt(_stoneCoinAddress)
            .getReservedPrice();
        require(
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getUserReservedBalance(_user, _stoneCoinAddress) ==
                0
        );
        require(
            bidReserved <=
                CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                    .getUserBalance(_user)
        );
        subBalance(_user, bidReserved, _stoneCoinAddress, "RESERVE_BID");
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
            .setUserReservedBalance(_user, _stoneCoinAddress, bidReserved);
    }

    function getReserveBid(address _user, address _stoneCoinAddress)
        public
        view
        returns (uint256)
    {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getUserReservedBalance(_user, _stoneCoinAddress);
    }

    function reservedBidLost(address _user, address _stoneCoinAddress)
        public
        onlyOwner
    {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .setUserReservedBalance(_user, _stoneCoinAddress, 0);
    }

    function cancelReserveBid(address _user, address _stoneCoinAddress)
        public
        onlyOwner
    {
        uint256 bidReserved = CornerStoneBaseStorageInt(
            cornerStoneBaseStorageAddress
        )
            .getUserReservedBalance(_user, _stoneCoinAddress);
        if (bidReserved > 0) {
            addBalance(
                _user,
                bidReserved,
                _stoneCoinAddress,
                "CANCEL_RESERVED_BID"
            );
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .setUserReservedBalance(_user, _stoneCoinAddress, 0);
        }
    }

    function addBalance(
        address _user,
        uint256 _value,
        address stoneCoin,
        string operation
    ) public onlyOwner returns (uint256) {
        if (stoneCoin != address(0)) {
            CornerTransactionInt(cornerTransactionAddress).addTransaction(
                _user,
                true,
                _value,
                stoneCoin,
                operation
            );
        }
        uint256 userBalance = CornerStoneBaseStorageInt(
            cornerStoneBaseStorageAddress
        )
            .getUserBalance(_user)
            .add(_value);
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress).setUserBalance(
            _user,
            userBalance
        );
        return userBalance;
    }

    function addOwnerBalance(uint256 _value)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 userBalance = CornerStoneBaseStorageInt(
            cornerStoneBaseStorageAddress
        )
            .getUserBalance(owner)
            .add(_value);
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress).setUserBalance(
            owner,
            userBalance
        );
        return userBalance;
    }

    function subOwnerBalance(uint256 _value)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 userBalance = CornerStoneBaseStorageInt(
            cornerStoneBaseStorageAddress
        )
            .getUserBalance(owner)
            .sub(_value);
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress).setUserBalance(
            owner,
            userBalance
        );
        return userBalance;
    }

    function getInitialSupply() public view returns (uint256) {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getInitialSupply();
    }

    function symbol() external view returns (bytes32) {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getSymbol();
    }

    function transfer(address _to, uint256 _value, string operation)
        public
        onlyOwner
        returns (bool)
    {
        require(_to != address(0));
        require(_value <= balanceOf(msg.sender));

        subBalance(msg.sender, _value, address(0), operation);
        addBalance(_to, _value, address(0), operation);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function balanceOf(address _user) public view returns (uint256) {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getUserBalance(_user);
    }

    function getOwnerBalance() public view returns (uint256) {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getUserBalance(owner);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value,
        address stoneCoin,
        string operation
    ) public onlyOwner returns (bool) {
        require(_to != address(0));
        require(_from != address(0));
        require(_value <= balanceOf(_from));
        subBalance(_from, _value, stoneCoin, operation);
        addBalance(_to, _value, stoneCoin, operation);

        emit Transfer(_from, _to, _value);
        return true;
    }

    function sell(
        address stoneCoinAddress,
        address seller,
        uint256 amount,
        uint256 price
    ) public onlyOwner {
        require(StoneCoinInt(stoneCoinAddress).getMinBulkSize() <= amount);
        StoneCoinInt(stoneCoinAddress).sell(seller, amount);
        TradesHistoryInt(tradesHistoryAddress).sellingTrade(
            stoneCoinAddress,
            seller,
            amount,
            price
        );
        transferSellingFee(seller, amount, price, stoneCoinAddress);
    }
    function buy(
        address stoneCoinAddress,
        address buyer,
        uint256 amount,
        uint256 price
    ) public onlyOwner {
        require(StoneCoinInt(stoneCoinAddress).getMinBulkSize() <= amount);
        transferBrokerFee(buyer, amount, price, stoneCoinAddress);
        StoneCoinInt(stoneCoinAddress).buy(buyer, amount);
        TradesHistoryInt(tradesHistoryAddress).buyingTrade(
            stoneCoinAddress,
            buyer,
            amount,
            price
        );
        transferBuyingFee(buyer, amount, price, stoneCoinAddress);

    }

    function clearMortgage(
        address stoneCoinAddress,
        address user,
        address mortgageAddress
    ) public onlyOwner {
        StoneCoinInt(stoneCoinAddress).clearMortgage(user, mortgageAddress);

    }

    function partlyForfeitureMortgage(
        address stoneCoinAddress,
        address user,
        address mortgagee,
        address mortgageAddress,
        uint256 marketPriceMills,
        bool maxDefaulted
    ) public onlyOwner {
        StoneCoinInt(stoneCoinAddress).partlyForfeitureMortgage(
            user,
            mortgagee,
            mortgageAddress,
            marketPriceMills,
            maxDefaulted
        );
    }

    function calculateTax(address taxes, address buyer, address seller)
        public
        onlyOwner
    {
        if (taxes != address(0)) {
            calculateBuyerTax(buyer, taxes);
            calculateSellerTax(seller, taxes);
        }
    }

    function calculateBuyerTax(address buyer, address taxes) private onlyOwner {
        uint256 arrayLength = TransactionTaxesInt(taxes)
            .getBuyerTaxEntitiesLength();
        for (uint256 i = 0; i < arrayLength; i++) {
            address taxEntity = TaxEntityInt(
                TransactionTaxesInt(taxes).getBuyerTaxEntity(i)
            );
            address stoneCoinAddress = TransactionTaxesInt(taxes)
                .getStoneCoinAddress();
            uint256 tax = TaxEntityInt(taxEntity).getTax(
                buyer,
                stoneCoinAddress
            );
            subBalance(buyer, tax, stoneCoinAddress, "TAXES_TOTAL");
            addBalance(taxEntity, tax, stoneCoinAddress, "TAXES_TOTAL");
        }
    }

    function calculateSellerTax(address seller, address taxes)
        private
        onlyOwner
    {
        uint256 arrayLength = TransactionTaxesInt(taxes)
            .getSellerTaxEntitiesLength();
        for (uint256 i = 0; i < arrayLength; i++) {
            address taxEntity = TaxEntityInt(
                TransactionTaxesInt(taxes).getSellerTaxEntity(i)
            );
            address stoneCoinAddress = TransactionTaxesInt(taxes)
                .getStoneCoinAddress();
            uint256 tax = TaxEntityInt(taxEntity).getTax(
                seller,
                stoneCoinAddress
            );
            subBalance(seller, tax, stoneCoinAddress, "TAXES_TOTAL");
            addBalance(taxEntity, tax, stoneCoinAddress, "TAXES_TOTAL");
        }
    }
    function buyMortgaged(
        address stoneCoinAddress,
        address mortgageAddress,
        address buyer,
        uint256 amount,
        uint256 price
    ) public onlyOwner {
        transferBrokerFee(buyer, amount, price, stoneCoinAddress);
        StoneCoinInt(stoneCoinAddress).buyMortgaged(
            mortgageAddress,
            buyer,
            amount
        );
        TradesHistoryInt(tradesHistoryAddress).buyingTrade(
            stoneCoinAddress,
            buyer,
            amount,
            price
        );
        transferBuyingFee(buyer, amount, price, stoneCoinAddress);

    }

    function sellMortgaged(
        address stoneCoinAddress,
        address mortgageAddress,
        address seller,
        uint256 amount,
        uint256 price
    ) public onlyOwner {
        StoneCoinInt(stoneCoinAddress).sellMortgaged(
            mortgageAddress,
            seller,
            amount
        );
        TradesHistoryInt(tradesHistoryAddress).sellingTrade(
            stoneCoinAddress,
            seller,
            amount,
            price
        );
        transferSellingFee(seller, amount, price, stoneCoinAddress);

    }

    function isInitialOffering(address stoneCoinAddress)
        public
        view
        onlyOwner
        returns (bool)
    {
        return StoneCoinInt(stoneCoinAddress).isInitialOffering();
    }

    function deposit(address payee, uint256 amount, address stoneCoin)
        public
        onlyOwner
        returns (bool)
    {
        require(payee != 0 && payee != address(0));
        require(amount > 0);
        require(amount <= balanceOf(owner));
        transferFrom(owner, payee, amount, stoneCoin, "DEPOSIT");
        emit Deposit(payee, amount, balanceOf(payee));
        return true;
    }

    function pendingBalanceOf(address _user)
        private
        view
        onlyOwner
        returns (uint256)
    {
        return
            CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
                .getUserPendingBalance(_user);
    }
    function withdrawApprove(
        address user,
        uint256 amount,
        address stoneCoinAddress
    ) public onlyOwner returns (bool) {
        require(user != 0 && user != address(0));
        require(amount > 0);
        require(amount <= pendingBalanceOf(user));

        uint256 pendingBalance = pendingBalanceOf(user).sub(amount);
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
            .setUserPendingBalance(user, pendingBalance);
        CornerTransactionInt(cornerTransactionAddress).addTransaction(
            user,
            false,
            amount,
            stoneCoinAddress,
            "WITHDRAW_APPROVED"
        );

        addBalance(owner, amount, stoneCoinAddress, "WITHDRAW_APPROVED");
        emit WithdrawPending(user, amount, pendingBalance);
        return true;
    }

    function withdraw(address user, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        require(user != 0 && user != address(0));
        require(amount > 0);
        require(amount <= balanceOf(user));
        subBalance(user, amount, address(0), "WITHDRAW");
        uint256 pendingBalance = pendingBalanceOf(user).add(amount);
        CornerStoneBaseStorageInt(cornerStoneBaseStorageAddress)
            .setUserPendingBalance(user, pendingBalance);
        emit Withdraw(user, amount, balanceOf(user));
        return true;
    }

    //pay incomne
    function payIncome(address stoneCoinAddress, uint256 micros)
        public
        onlyOwner
        returns (uint256 remaining)
    {
        remaining = 0;
        require(micros > 0);
        require(stoneCoinAddress != address(0));

        uint256 totalAllocated = StoneCoinInt(stoneCoinAddress).STONES();
        uint256 length = StoneCoinInt(stoneCoinAddress).getHoldersCount();
        for (uint256 i = 0; i < length; i++) {
            address holder = StoneCoinInt(stoneCoinAddress).getHolderByIndex(i);
            uint256 balance = StoneCoinInt(stoneCoinAddress).balanceOf(holder);
            uint256 totalMicros = micros.mul(balance);
            uint256 userShare = totalMicros / totalAllocated;
            transferFrom(
                owner,
                holder,
                userShare,
                stoneCoinAddress,
                "PAY_INCOME"
            );
            emit IncomePayment(holder, userShare, stoneCoinAddress, length);
        }

        return remaining;
    }

    function getTotalAllocated(address stoneCoinAddress)
        public
        view
        returns (uint256)
    {
        uint256 totalAllocated = StoneCoinInt(stoneCoinAddress).STONES();
        return totalAllocated;
    }

    function getUserHoldings(address stoneCoinAddress, address user)
        public
        view
        returns (uint256)
    {
        uint256 userHoldings = StoneCoinInt(stoneCoinAddress).balanceOf(user);
        return userHoldings;
    }

    //StoneCoin project sold
    function closeStoneCoin(address stoneCoinAddress, uint256 micros)
        public
        onlyOwner
    {
        payIncome(stoneCoinAddress, micros);
    }

    function checkSignature(address signDocument, address stoneCoinAddress)
        public
        returns (bool)
    {
        bool result = true;
        if (StoneCoinInt(stoneCoinAddress).isSignDocument()) {
            result = SignedDocumentInt(signDocument).isSign();
            if (result) {
                SignedDocumentInt(signDocument).approved();
            }
        }
        return result;
    }

    function transferFromOwner(
        address stoneCoinAddress,
        address to,
        uint256 amount
    ) public onlyOwner returns (bool) {
        StoneCoinInt(stoneCoinAddress).buy(to, amount);
        emit TransferFromOwner(stoneCoinAddress, to, amount);
        return true;
    }

    function transferAll(
        address _buyer,
        address _seller,
        uint256 _value,
        address stoneCoinAddress,
        string operation
    ) public onlyOwner {
        subBalance(_buyer, _value, stoneCoinAddress, operation);
        addOwnerBalance(_value);
        addBalance(_seller, _value, stoneCoinAddress, operation);
        subOwnerBalance(_value);
    }

    function transferBuyingFee(
        address _buyer,
        uint256 amount,
        uint256 price,
        address stoneCoinAddress
    ) private onlyOwner {
        uint256 userFee = FeeManagerInt(feeManagerAddress).getUserBuyingFee(
            _buyer,
            amount,
            price,
            StoneCoinInt(stoneCoinAddress).getOrganization()
        );
        if (userFee > 0) {
            subBalance(_buyer, userFee, stoneCoinAddress, "BUYING_FEES");
            addOwnerBalance(userFee);
            FeeManagerInt(feeManagerAddress).addToTotalFee(
                userFee,
                stoneCoinAddress
            );
        }
    }
    function transferSellingFee(
        address _seller,
        uint256 amount,
        uint256 price,
        address stoneCoinAddress
    ) private onlyOwner {
        uint256 userFee = FeeManagerInt(feeManagerAddress).getUserSellingFee(
            _seller,
            amount,
            price,
            StoneCoinInt(stoneCoinAddress).getOrganization()
        );
        if (userFee > 0) {
            subBalance(_seller, userFee, stoneCoinAddress, "SELLING_FEES");
            addOwnerBalance(userFee);
            FeeManagerInt(feeManagerAddress).addToTotalFee(
                userFee,
                stoneCoinAddress
            );
        }
    }

    function payBroker(
        address broker,
        uint256 payment,
        address organization,
        address stoneCoinAddress
    ) public onlyOwner {
        BrokerManagerInt(brokerManagerAddress).payBroker(
            broker,
            payment,
            organization,
            stoneCoinAddress
        );
    }

    function transferBrokerFee(
        address user,
        uint256 amount,
        uint256 price,
        address stoneCoinAddress
    ) private onlyOwner {
        address brokerUser = BrokerManagerInt(brokerManagerAddress).checkBroker(
            user,
            stoneCoinAddress
        );

        uint256 brokerFeeRatio = BrokerManagerInt(brokerManagerAddress)
            .getBrokerFee(user, stoneCoinAddress);
        if (brokerFeeRatio > 0) {
            BrokerManagerInt(brokerManagerAddress).addBrokerHistory(
                stoneCoinAddress,
                brokerUser,
                user,
                amount,
                price,
                brokerFeeRatio
            );
        }
    }

}
