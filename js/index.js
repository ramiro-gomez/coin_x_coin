import { UserInterface } from './ui.js';
import { RequestHandler } from './request_handler.js';

const UI = new UserInterface();
const handler = new RequestHandler();
const currenciesList = {};
let baseCurrency = 'ARS';

function valueToBase(value) {
	return (1 / parseFloat(value)).toFixed(2).toString();
}

Promise.all([
	handler.getCurrencies(),
	handler.getExchanges(baseCurrency),
]).then((responses) => Promise.all(responses.map((res) => res))).then((data) => {
	//  Join all the relevant data in currenciesList
	const coinbaseCurrencies = data[0];
	const coinbaseExchanges = data[1];
	for (const currency of coinbaseCurrencies) {
		//  Avoid metals
		if (currency.name !== 'Silver (Troy Ounce)' && currency.name !== 'Gold (Troy Ounce)'
		&& currency.name !== 'Palladium' && currency.name !== 'Platinum') {
			currenciesList[currency.id] = {
				id: currency.id,
				name: currency.name,
				value: valueToBase(coinbaseExchanges[currency.id]),
			};
		}
	}
	UI.showCards(currenciesList, baseCurrency);
	UI.showBaseOptions(currenciesList);
}).catch((error) => {
	console.log(error);
});

//  Dom events
const selectEelement = document.querySelector('div.base-bar select');
selectEelement.addEventListener('change', () => {
	baseCurrency = selectEelement.value;
	handler.getExchanges(baseCurrency).then((exchanges) => {
		const exchangesConverted = {};
		for (const id of Object.keys(exchanges)) {
			exchangesConverted[id] = valueToBase(exchanges[id]);
		}
		UI.updateCardsExchanges(exchangesConverted, baseCurrency);
	}).catch((e) => console.log(e));
});
