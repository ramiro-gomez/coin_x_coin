export class UserInterface {
	showCards(currenciesList, base) {
		this.cardsArray = currenciesList;
		this.base = base;
		const documentFragment = new DocumentFragment();
		const middleElement = document.querySelector('.middle-container');
		for (const currency of Object.keys(currenciesList)) {
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card');
			cardDiv.innerHTML = `
			<a>
                <i class="fas fa-thumbtack"></i>
            </a>
            <div class="card-name">
                <h2>${currenciesList[currency].id}</h2>
				<div>
					<p>${currenciesList[currency].name}</p>
				</div>
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

	updateCardsExchanges(exchanges, base) {
		this.allCurrencies = exchanges;
		const cards = document.querySelectorAll('.middle-container div.card');
		cards.forEach((cardDiv) => {
			const id = cardDiv.querySelector('.card-name h2').innerHTML;
			cardDiv.querySelector('.card-value').innerHTML = `
			<p>1<span>${id}</span> = </p>
			<h3>${exchanges[id]}<span>${base}</span></h3>
			`;
		});
	}

	showBaseOptions(currenciesList) {
		this.allCurrencies = currenciesList;
		const documentFragment = new DocumentFragment();
		const selectEelement = document.querySelector('div.base-bar select');

		for (const currency of Object.keys(currenciesList)) {
			const option = document.createElement('option');
			option.value = currenciesList[currency].id;
			option.innerHTML = currenciesList[currency].id;
			documentFragment.appendChild(option);
		}
		selectEelement.appendChild(documentFragment);
	}
}
