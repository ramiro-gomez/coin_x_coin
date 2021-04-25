import { UserInterface } from './ui.js';
import { RequestHandler } from './request_handler.js';

let baseCurrency = 'ARS';
const UI = new UserInterface();
const handler = new RequestHandler();

handler.callApi(baseCurrency).then((allCurrencies) => {
	UI.showCards(allCurrencies, baseCurrency);
	UI.showBaseOptions(allCurrencies);
});

//  Dom events
const selectEelement = document.querySelector('div.base-bar select');
selectEelement.addEventListener('change', () => {
	baseCurrency = selectEelement.value;
	handler.callApi(baseCurrency).then((allCurrencies) => {
		UI.updateCards(allCurrencies, baseCurrency);
	});
});
