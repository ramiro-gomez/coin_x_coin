export class RequestHandler {
	callApi(base) {
		this.base = base;
		const result = Promise.all([
			fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${base}`),
			fetch('https://api.coinbase.com/v2/currencies'),
		]).then((responses) => Promise.all(responses.map((res) => res.json()))).then((data) => {
			//  Join all the relevant data in an array
			const allCurrencies = {};
			const coinbaseExchanges = data[0].data.rates;
			const coinbaseCurrencies = data[1].data;
			for (const currency of coinbaseCurrencies) {
				//  Avoid metals
				if (currency.name !== 'Silver (Troy Ounce)' && currency.name !== 'Gold (Troy Ounce)'
				&& currency.name !== 'Palladium' && currency.name !== 'Platinum') {
					const valueToBase = (1 / parseFloat(coinbaseExchanges[currency.id]))
						.toFixed(2).toString();
					allCurrencies[currency.id] = {
						id: currency.id,
						name: currency.name,
						value: valueToBase,
					};
				}
			}
			return allCurrencies;
		}).catch((error) => {
			console.log(error);
		});
		return result;
	}
}
