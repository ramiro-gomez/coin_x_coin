import '../css/style.css';
import UserInterface from './UserInterface';
import RequestHandler from './RequestHandler';
import EventManager from './EventManager';
import CurrencyList from './CurrencyList';
import LocalSHandler from './LocalSHandler';

(async () => {
	const {
		savedBase, savedExchange0, savedExchange1, savedPushpins,
	} = LocalSHandler.loadStorage();
	const [currencyNames, exchangeRates] = await Promise.all([
		RequestHandler.getCurrencyNames(),
		RequestHandler.getExchangeRates(savedBase),
	]);
	const currencyList = new CurrencyList({
		currencyNames,
		exchangeRates,
		base: savedBase,
	});
	EventManager.docReady(() => {
		UserInterface.showCards(currencyList);
		UserInterface.showOptions({
			currencyList,
			savedBase,
			savedExchange0,
			savedExchange1,
		});
		const cardElements = document.querySelectorAll('.middle-container > div.card');
		UserInterface.addsavedPushpins({
			toCardElements: cardElements,
			savedPushpins,
		});
		EventManager.addPushpinEvent(cardElements);
		EventManager.addSearchCardEvent(cardElements);
		EventManager.addInputConversionEvent({
			selectorsWithSameCurrency: savedBase === savedExchange0,
			exchangeRates,
			savedExchange0,
		});
		EventManager.addBaseSelectorEvent(currencyList);
	});
})();

EventManager.docReady(() => {
	EventManager.addModalEvent();
});
