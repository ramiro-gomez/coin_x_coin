import Currency from './Currency';
import Conversor from './Conversor';

export default class CurrencyList {
	#currencies;

	constructor({ currencyNames, exchangeRates, base }) {
		this.#currencies = currencyNames.reduce((acc, currency) => {
			//  Avoid metals
			if (currency.name === 'Silver (Troy Ounce)'
				|| currency.name === 'Gold (Troy Ounce)'
				|| currency.name === 'Palladium'
				|| currency.name === 'Platinum') {
				return { ...acc };
			}
			return {
				...acc,
				[currency.id]: new Currency({
					id: currency.id,
					name: currency.name,
					price: {
						value: Conversor.toBase(exchangeRates[currency.id]),
						base,
					},
				}),
			};
		}, {});
	}

	get currencies() {
		return this.#currencies;
	}
}
