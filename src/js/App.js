import '../css/style.css';
import UserInterface from './UserInterface';
import RequestHandler from './RequestHandler';
import EventManager from './EventManager';
import CurrencyList from './CurrencyList';

const defaultBase = 'ARS';
const defaultExchange0 = 'ARS';
const defaultExchange1 = 'USD';
const defaultPushpins = ['EUR', 'GBP', 'USD'];

(async () => {
	const [currencyNames, exchangeRates] = await Promise.all([
		RequestHandler.getCurrencyNames(),
		RequestHandler.getExchangeRates(defaultBase),
	]);
	const currencyList = new CurrencyList({
		currencyNames,
		exchangeRates,
		base: defaultBase,
	});
	EventManager.docReady(() => {
		UserInterface.showCards(currencyList);
		UserInterface.showOptions({
			currencyList,
			defaultBase,
			defaultExchange0,
			defaultExchange1,
		});
		const cardElements = document.querySelectorAll('.middle-container > div.card');
		UserInterface.addDefaultPushpins({
			toCardElements: cardElements,
			defaultPushpins,
		});
		EventManager.addPushpinEvent(cardElements);
		EventManager.addSearchCardEvent(cardElements);
		EventManager.addInputConversionEvent(exchangeRates);
		EventManager.addBaseSelectorEvent(currencyList);
	});
})();

EventManager.docReady(() => {
	EventManager.addModalEvent();
});