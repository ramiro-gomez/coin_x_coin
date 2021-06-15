export default class UserInterface {
	static showCards(currencyList) {
		const documentFragment = new DocumentFragment();
		const middleElement = document.querySelector('.middle-container');
		Object.keys(currencyList.currencies).forEach((id) => {
			const card = document.createElement('div');
			card.classList.add('card');
			card.innerHTML = `
				<button type="button">
					<i class="fas fa-thumbtack"></i>
				</button>
				<div class="card-name">
					<h2>${currencyList.currencies[id].id}</h2>
					<p>${currencyList.currencies[id].name}</p>
				</div>
				<div class="card-value">
					<p>1<span>${currencyList.currencies[id].id}</span> = </p>
					<h3>${currencyList.currencies[id].price.value}<span>${currencyList.currencies[id].price.base}</span></h3>
				</div>
			`;
			documentFragment.appendChild(card);
		});
		middleElement.appendChild(documentFragment);
	}

	static updateCardPrices(currencyList) {
		const cardElements = document.querySelectorAll('.middle-container div.card');
		cardElements.forEach((card) => {
			const id = card.querySelector('.card-name h2').textContent;
			if (currencyList.currencies[id]) {
				const cardPrice = card.querySelector('.card-value h3');
				cardPrice.innerHTML = `
					${currencyList.currencies[id].price.value}<span>${currencyList.currencies[id].price.base}</span></h3>
				`;
			}
		});
	}

	static toggleCardPushpin(card) {
		const pushpin = card.querySelector('button i');
		pushpin.classList.toggle('pushpin');
		card.classList.toggle('order-first');
	}

	static addDefaultPushpins = ({ toCardElements, defaultPushpins }) => {
		toCardElements.forEach((card) => {
			const id = card.querySelector('div.card-name h2').textContent;
			if (defaultPushpins.includes(id)) {
				card.querySelector('i.fa-thumbtack').classList.add('pushpin');
				card.classList.add('order-first');
			}
		});
	}

	static showOptions({
		currencyList, defaultBase, defaultExchange0, defaultExchange1,
	}) {
		const baseSelector = document.querySelector('div.base-bar select');
		const exchangeSelector = document.querySelectorAll('div.exchange-box select');
		const baseDocumentFrag = new DocumentFragment();
		Object.keys(currencyList.currencies).forEach((currency) => {
			const option = document.createElement('option');
			option.value = currencyList.currencies[currency].id;
			option.innerHTML = currencyList.currencies[currency].id;
			baseDocumentFrag.appendChild(option);
		});

		const exchangeDocumentFrag0 = baseDocumentFrag.cloneNode(true);
		const exchangeDocumentFrag1 = baseDocumentFrag.cloneNode(true);

		if (defaultBase) baseDocumentFrag.querySelector(`option[value=${defaultBase}]`).selected = true;
		if (defaultExchange0) exchangeDocumentFrag0.querySelector(`option[value=${defaultExchange0}]`).selected = true;
		if (defaultExchange1) exchangeDocumentFrag1.querySelector(`option[value=${defaultExchange1}]`).selected = true;

		baseSelector.appendChild(baseDocumentFrag);
		exchangeSelector[0].appendChild(exchangeDocumentFrag0);
		exchangeSelector[1].appendChild(exchangeDocumentFrag1);
	}

	static showValueInExchangeInput({ showInInputNumber, valueToShow }) {
		const exchangeInput = document.querySelectorAll('div.exchange-box input');
		exchangeInput[showInInputNumber].value = valueToShow;
	}

	static showModal() {
		const modalContainer = document.querySelector('.modal-container');
		modalContainer.classList.add('open');
	}

	static hideModal() {
		const modalContainer = document.querySelector('.modal-container');
		modalContainer.classList.remove('open');
	}
}
