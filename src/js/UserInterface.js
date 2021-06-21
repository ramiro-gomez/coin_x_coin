export default class UserInterface {
	static showCards(currencyList) {
		const documentFragment = new DocumentFragment();
		const middleElement = document.querySelector('.middle-container');
		Object.values(currencyList.currencies).forEach((currency) => {
			const card = document.createElement('div');
			card.classList.add('card');
			card.innerHTML = `
				<button type="button">
					<i class="fas fa-thumbtack"></i>
				</button>
				<div class="card-name">
					<h2>${currency.id}</h2>
					<p>${currency.name}</p>
				</div>
				<div class="card-price">
					<p>1<span>${currency.id}</span> = </p>
					<h3>${currency.price.value}<span>${currency.price.base}</span></h3>
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
				const priceValue = card.querySelector('.card-price h3');
				const priceBasis = card.querySelector('.card-price h3 span');
				priceValue.childNodes[0].nodeValue = currencyList.currencies[id].price.value;
				priceBasis.textContent = currencyList.currencies[id].price.base;
			}
		});
	}

	static toggleCardPushpin(card) {
		const pushpin = card.querySelector('button i');
		pushpin.classList.toggle('pushpin');
		card.classList.toggle('order-first');
	}

	static addsavedPushpins = ({ toCardElements, savedPushpins }) => {
		toCardElements.forEach((card) => {
			const id = card.querySelector('div.card-name h2').textContent;
			if (savedPushpins.includes(id)) {
				card.querySelector('i.fa-thumbtack').classList.add('pushpin');
				card.classList.add('order-first');
			}
		});
	}

	static showOptions({
		currencyList, savedBase, savedExchange0, savedExchange1,
	}) {
		const baseSelector = document.querySelector('div.base-bar select');
		const exchangeSelector = document.querySelectorAll('div.exchange-box select');
		const baseDocumentFrag = new DocumentFragment();
		Object.values(currencyList.currencies).forEach((currency) => {
			const option = document.createElement('option');
			option.value = currency.id;
			option.textContent = currency.id;
			baseDocumentFrag.appendChild(option);
		});

		const exchangeDocumentFrag0 = baseDocumentFrag.cloneNode(true);
		const exchangeDocumentFrag1 = baseDocumentFrag.cloneNode(true);

		if (savedBase) baseDocumentFrag.querySelector(`option[value=${savedBase}]`).selected = true;
		if (savedExchange0) exchangeDocumentFrag0.querySelector(`option[value=${savedExchange0}]`).selected = true;
		if (savedExchange1) exchangeDocumentFrag1.querySelector(`option[value=${savedExchange1}]`).selected = true;

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
