import CardDetails from './CardDetails';


/*
ClientID: Identity for client,
Password,
TotalSum: Total transaction sum,
FirstPay: First payment,
AddPay: Any additional payment,
PayNumber,
OwnerName: Cardholder's name, optional,
MType- -
Currency: 1- SHEKEL, 2- DOLAR, 3- DOLLAR_LINKED, 4- INDEX_LINKED, 5- EURO.
Opt: Action type Credit transaction-51, Debit transaction-01.
externalID: This field holds the value of your token or single value that allow you to follow this deal later, by working with our Web Service API, the method called "GetDealByExternalID",
Token: Credit card ID- returned from CreateNewToken function,
DealType:
	1 - CREDIT_CARD_REGULAR_CREDIT
	2 - CREDIT_CARD_PLUS_30
	3 - CREDIT_CARD_INSTANT_BILLING
	4 - CREDIT_CARD_CLUB_CREDIT
	5 - CREDIT_CARD_SUPER_CREDIT
	6 - CREDIT_CARD_CREDITS
	8 - CREDIT_CARD_PAYMENTS
	9 - CREDIT_CARD_INSTALLMENT_CLUB_DEAL
	50 - PayPal
CardNumber: Credit card number,
Month: Valid month, MUST,
Year: Year format- yy or yyyy,System does not accept expired credit card, MUST,
TZ: Cardholder's ID, optional,
CVV: optional,
ActionMethod: Action Type, 00 Regular Deal, 50 Phone Deal.
AuthNum: Authentication number for transaction,
Cell: Telephone,
CreateToken: Do create token (0 or 1),
JsonProductsList: Products for which payment is made
Example for json ={"JsonProductsList" : [ {"Quantity" : "1","Number" : "0","Cost" : "25","Details" : "PROD 1"},{"Quantity" : "1","Number" : "0","Cost" : "25","Details" : "PROD 2"}]}
CostumerAddress CostumerPostalCode
CostumerEmail CostumerPhomeNumber
EcPwd: Encrypted password -override the password if got both
typeDoDeal: Type for DoDeal DoDealUserCodeWithTokenExt, DoDealWithProducts, DoDealJ5WithToken
 */
export default class PaymentRequest {
	public ClientIDPass: any;
	public TotalSum: string;
	public MType: string;
	public ExternalID: string;
	public DealType: string;
    public Opt: string;
    public ActionMethod : string;
    public JsonProductsList: string;


	private cardDetails: CardDetails;

	constructor(cardDetails: CardDetails, data: any) {
		this.cardDetails = cardDetails;
		this.ExternalID = data.externalId;
		this.TotalSum = data.product.Cost;
		this.MType = data.payment.mType;
		this.DealType = data.payment.dealType;
		this.Opt = data.payment.opt;
		this.ActionMethod  = data.payment.actionMethod ;
		this.JsonProductsList = JSON.stringify([data.product]);
	}

	public getCardDeteils(): CardDetails {
		return this.cardDetails;
	}

	// public AddPay: string;
	// public PayNumber: string;
	// public OwnerName: string;
	// public Opt: string;
	// public Note: string;
	// public Token: string;
	// public ActionMethod: string;
	// public AuthNum: string;
	// public Cell: string;
	// public UserCode: string;
	// public CreateToken: string;
	// public Email: string;
	// public CostumerAddress: string;
	// public CostumerPostalCode: string;
	// public CostumerEmail: string;
	// public CostumerPhomeNumber: string;
	// public EcPwd: string;
}
