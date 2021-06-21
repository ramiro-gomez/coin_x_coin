import '../css/style.css';
import UserInterface from './UserInterface';
import RequestHandler from './RequestHandler';
import EventManager from './EventManager';
import CurrencyList from './CurrencyList';
import LocalSHandler from './LocalSHandler';

(async () => {
	const {
		defaultBase, defaultExchange0, defaultExchange1, defaultPushpins,
	} = LocalSHandler.loadDefaults();
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
		EventManager.addInputConversionEvent({
			selectorsWithSameCurrency: defaultBase === defaultExchange0,
			exchangeRates,
			defaultExchange0,
		});
		EventManager.addBaseSelectorEvent(currencyList);
	});
})();

EventManager.docReady(() => {
	EventManager.addModalEvent();
});
