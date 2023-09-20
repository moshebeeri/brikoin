export default class CardDetails {
	public CardNumber: string;
	public Month: string;
	public Year: string;
	public TZ: string;
	public CVV: string;

	constructor(cardNumber: string, month: string, year: string, tz: string, cvv: string) {
		this.CardNumber = cardNumber;
		this.Month = month;
		this.Year = year;
		this.CVV = cvv;
	}
}
