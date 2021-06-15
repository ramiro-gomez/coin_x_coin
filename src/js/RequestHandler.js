export default class RequestHandler {
	static async getCurrencyNames() {
		try {
			const res = await fetch('https://api.coinbase.com/v2/currencies');
			const data = await res.json();
			return data.data;
		} catch (error) {
			return console.log(error);
		}
	}

	static async getExchangeRates(base) {
		try {
			const res = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${base}`);
			const data = await res.json();
			return data.data.rates;
		} catch (error) {
			return console.log(error);
		}
	}
}
