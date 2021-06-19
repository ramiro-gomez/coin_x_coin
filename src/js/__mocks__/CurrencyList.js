import Currency from '../Currency';

export default class CurrencyList {
	#currencies = {
		AED: new Currency({
			id: 'AED',
			name: 'United Arab Emirates Dirham',
			price: {
				value: 10,
				base: 'ARS',
			},
		}),
		AFN: new Currency({
			id: 'AFN',
			name: 'Afghan Afghani',
			price: {
				value: 25,
				base: 'ARS',
			},
		}),
		ALL: new Currency({
			id: 'ALL',
			name: 'Albanian Lek',
			price: {
				value: 5,
				base: 'ARS',
			},
		}),
		AMD: new Currency({
			id: 'AMD',
			name: 'Armenian Dram',
			price: {
				value: 30,
				base: 'ARS',
			},
		}),
	};

	get currencies() {
		return this.#currencies;
	}
}
