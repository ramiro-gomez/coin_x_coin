import { UserInterface } from './ui.js';
import { RequestHandler } from './request_handler.js';

const UI = new UserInterface();
const handler = new RequestHandler();
const currenciesList = {};
let baseCurrency = 'AED';

function valueToBase(value) {
	let valConverted = 1 / parseFloat(value);
	if (valConverted < 1) {
		//  Return the first non-zero decimal and rounded it
		valConverted = valConverted.toFixed(1 - Math.floor(Math.log(valConverted) / Math.log(100)));
	} else {
		valConverted = valConverted.toFixed(2);
	}
	return parseFloat(valConverted);
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
