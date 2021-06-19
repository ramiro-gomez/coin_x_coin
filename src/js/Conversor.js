export default class Conversor {
	static twoDecimals(value) {
		let converted;
		if (value === 0) {
			converted = 0;
		} else if (value < 1) {
			//  Return the first non-zero decimal and rounded it
			converted = value.toFixed(1 - Math.floor(Math.log(value) / Math.log(10)));
		} else {
			converted = value.toFixed(2);
		}
		return parseFloat(converted);
	}

	static toBase(value) {
		// Coinbase exchanges rates returns 1USD: { 95ARS, 717CLP, 0.82EUR, etc }
		// but I want to show all the prices on the same base
		// { 1ARS: 0.01USD, 1CLP:0.001USD, 1EUR:1.2USD  }
		const converted = 1 / parseFloat(value);
		return this.twoDecimals(converted);
	}

	// Since the exchange rates are based on the selector 0,
	// the reference currency is of the selector 1
	// Example, x ARS = 2 USD
	// 1 ARS = {
	// 		USD: 0,01, <- Reference
	//		EUR: 0,009,
	// }
	// 2USD / 0.01 = 200ARS
	static convertValueOfExchangeInput({ ofInputNumber, withValue, referenceExchangeRate }) {
		const value = parseFloat(withValue);
		if (Number.isNaN(value)) return null;
		return (
			ofInputNumber === 0 ? this.twoDecimals(value * referenceExchangeRate)
				: this.twoDecimals(value / referenceExchangeRate)
		);
	}
}
