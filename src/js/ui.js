export default class UserInterface {
	static showCards(currenciesList, base) {
		const documentFragment = new DocumentFragment();
		const middleElement = document.querySelector('.middle-container');
		for (const currency of Object.keys(currenciesList)) {
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card');
			cardDiv.innerHTML = `
			<button type="button">
				<i class="fas fa-thumbtack"></i>
			</button>
			<div class="card-name">
				<h2>${currenciesList[currency].id}</h2>
				<p>${currenciesList[currency].name}</p>
			</div>
			<div class="card-value">
				<p>1<span>${currenciesList[currency].id}</span> = </p>
				<h3>${currenciesList[currency].value}<span>${base}</span></h3>
			</div>
			`;
			documentFragment.appendChild(cardDiv);
		}
		middleElement.appendChild(documentFragment);
	}

	static updateCardsExchanges(exchanges, base) {
		const cardsList = document.querySelectorAll('.middle-container div.card');
		cardsList.forEach((cardDiv) => {
			const id = cardDiv.querySelector('.card-name h2').innerHTML;
			cardDiv.querySelector('.card-value').innerHTML = `
			<p>1<span>${id}</span> = </p>
			<h3>${exchanges[id]}<span>${base}</span></h3>
			`;
		});
	}

	static showOptions(currenciesList, defaultOption) {
		const selectBase = document.querySelector('div.base-bar select');
		const selectExchange = document.querySelectorAll('div.exchange-box select');
		const docFragBase = new DocumentFragment();

		for (const currency of Object.keys(currenciesList)) {
			const option = document.createElement('option');
			if (currenciesList[currency].id === defaultOption) {
				option.selected = true;
			}
			option.value = currenciesList[currency].id;
			option.innerHTML = currenciesList[currency].id;
			docFragBase.appendChild(option);
		}

		const docFragExchange1 = docFragBase.cloneNode(true);
		const docFragExchange2 = docFragBase.cloneNode(true);

		docFragExchange1.querySelector(`option[value=${defaultOption}]`).selected = true;
		docFragExchange2.querySelector('option[value=USD]').selected = true;

		selectBase.appendChild(docFragBase);
		selectExchange[0].appendChild(docFragExchange1);
		selectExchange[1].appendChild(docFragExchange2);
	}
}
