/* eslint-disable no-console */
import { Card } from './card.js';
import { UserInterface } from './ui.js';

const allCurrencies = {}; //   All the relevant data from the apis
const base = 'ARS';
const cardsArray = [];
const UI = new UserInterface();

function valueToBase(value) {
	const valueFloat = (1 / parseFloat(value)).toFixed(2);
	return valueFloat.toString();
}

Promise.all([
	fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${base}`),
	fetch('https://api.coinbase.com/v2/currencies'),
]).then((responses) => Promise.all(responses.map((res) => res.json()))).then((data) => {
	//  Join currencies data in an object
	const coinbaseExchanges = data[0].data.rates;
	const coinbaseCurrencies = data[1].data;
	let i = 0;
	for (const currency of coinbaseCurrencies) {
		//  Avoid metals
		if (currency.name !== 'Silver (Troy Ounce)' && currency.name !== 'Gold (Troy Ounce)'
		&& currency.name !== 'Palladium' && currency.name !== 'Platinum') {
			allCurrencies[currency.id] = {
				id: currency.id,
				name: currency.name,
				value: valueToBase(coinbaseExchanges[currency.id]),
			};
			cardsArray[i] = new Card(allCurrencies[currency.id].id, allCurrencies[currency.id].name,
				allCurrencies[currency.id].value, base);
			i += 1;
		}
	}
	UI.showCards(cardsArray, base);
}).catch((error) => {
	console.log(error);
});
