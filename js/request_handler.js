export default class RequestHandler {
	getCurrencies() {
		return fetch('https://api.coinbase.com/v2/currencies')
			.then((res) => res.json()).then((data) => data.data).catch((error) => {
				console.log(error);
			});
	}

	getExchanges(base) {
		this.base = base;
		return fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${base}`)
			.then((res) => res.json()).then((data) => data.data.rates).catch((error) => {
				console.log(error);
			});
	}
}
