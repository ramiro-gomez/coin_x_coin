import UserInterface from './UserInterface';
import Conversor from './Conversor';
import RequestHandler from './RequestHandler';
import LocalSHandler from './LocalSHandler';

export default class EventManager {
	static docReady(fn) {
		if (window.document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', fn);
		} else {
			fn();
		}
	}

	static addModalEvent() {
		const openModalBtn = document.getElementById('open-modal-button');
		const closeModalBtn = document.getElementById('close-modal-button');
		const overlay = document.querySelector('.overlay');

		openModalBtn.addEventListener('click', () => UserInterface.showModal());
		closeModalBtn.addEventListener('click', () => UserInterface.hideModal());
		overlay.addEventListener('click', () => UserInterface.hideModal());
	}

	static addPushpinEvent(cardElements) {
		cardElements.forEach((card) => {
			const pushpinButton = card.querySelector('button');
			pushpinButton.addEventListener('click', () => {
				UserInterface.toggleCardPushpin(card);
				const id = card.querySelector('.card-name h2').textContent;
				LocalSHandler.toggleSavedPushpin(id);
			});
		});
	}

	static addSearchCardEvent(cardElements) {
		const searchInput = document.querySelector('.search-box input');
		searchInput.addEventListener('keyup', (event) => {
			const searchText = event.target.value.toLowerCase();
			cardElements.forEach((card) => {
				const cardName = card.querySelector('.card-name p').textContent.toLowerCase();
				const cardID = card.querySelector('.card-name h2').textContent.toLowerCase();
				const cardVal = parseFloat(card.querySelector('.card-price h3').textContent).toString();
				if (cardName.includes(searchText)
				|| cardID.includes(searchText)
				|| cardVal.includes(searchText)) {
					card.classList.remove('hidden');
				} else card.classList.add('hidden');
			});
		});
	}

	static async addInputConversionEvent({
		selectorsWithSameCurrency, exchangeRates, savedExchange0,
	}) {
		let exchRates;
		if (selectorsWithSameCurrency) exchRates = { ...exchangeRates };
		else exchRates = await RequestHandler.getExchangeRates(savedExchange0);
		const exchangeSelector = document.querySelectorAll('div.exchange-box select');
		const exchangeInput = document.querySelectorAll('div.exchange-box input');

		//	Adds almost the same callback for the input 0 and 1
		exchangeInput.forEach((input, inputNumber) => {
			//	And repeat the callback for the events 'keyup' and 'change' of both inputs
			['keyup', 'change'].forEach((eType) => {
				input.addEventListener(eType, () => {
					const convertedValue = Conversor.convertValueOfExchangeInput({
						ofInputNumber: inputNumber,
						withValue: exchangeInput[inputNumber].value,
						referenceExchangeRate: exchRates[exchangeSelector[1].value],
					});
					const oppositeInput = inputNumber === 0 ? 1 : 0;
					UserInterface.showValueInExchangeInput({
						showInInputNumber: oppositeInput,
						valueToShow: convertedValue,
					});
				});
			});
		});

		exchangeSelector.forEach((selector, selectorNumber) => {
			// For both selectors, the 'change' event converts the value of input 1 to input 2.
			selector.addEventListener('change', async () => {
				LocalSHandler.updateSavedExchange({
					exchangeNumber: selectorNumber,
					updateTo: selector.value,
				});
				if (selectorNumber === 0) {
					//  Get exchange data of the current currency for greater exchange accuracy
					exchRates = await RequestHandler.getExchangeRates(exchangeSelector[0].value);
				}
				const convertedValue = Conversor.convertValueOfExchangeInput({
					ofInputNumber: 0,
					withValue: exchangeInput[0].value,
					referenceExchangeRate: exchRates[exchangeSelector[1].value],
				});
				UserInterface.showValueInExchangeInput({
					showInInputNumber: 1,
					valueToShow: convertedValue,
				});
			});
		});
	}

	static addBaseSelectorEvent(currencyList) {
		const baseSelector = document.querySelector('div.base-bar select');
		baseSelector.addEventListener('change', async () => {
			LocalSHandler.updateSavedBase(baseSelector.value);
			const updatedExchangeRates = await RequestHandler.getExchangeRates(baseSelector.value);
			Object.entries(currencyList.currencies).forEach(([id, currency]) => {
				currency.updatePrice = {
					value: Conversor.toBase(updatedExchangeRates[id]),
					base: baseSelector.value,
				};
			});
			UserInterface.updateCardPrices(currencyList);
		});
	}
}
