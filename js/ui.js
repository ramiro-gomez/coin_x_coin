export class UserInterface {
	showCards(allCurrencies, base) {
		this.cardsArray = allCurrencies;
		this.base = base;
		const documentFragment = new DocumentFragment();
		const middleElement = document.querySelector('.middle-container');
		for (const currency of Object.keys(allCurrencies)) {
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card');
			cardDiv.innerHTML = `
			<a>
                <i class="fas fa-thumbtack"></i>
            </a>
            <div class="card-name">
                <h2>${allCurrencies[currency].id}</h2>
                <p>${allCurrencies[currency].name}</p>
            </div>
            <div class="card-value">
                <p>1<span>${allCurrencies[currency].id}</span> = </p>
                <h3>${allCurrencies[currency].value}<span>${base}</span></h3>
            </div>
			`;
			documentFragment.appendChild(cardDiv);
		}
		middleElement.appendChild(documentFragment);
	}

	updateCards(allCurrencies, base) {
		this.allCurrencies = allCurrencies;
		const cards = document.querySelectorAll('.middle-container div.card');
		cards.forEach((currentValue) => {
			const id = currentValue.querySelector('.card-name h2').innerHTML;
			currentValue.querySelector('.card-value').innerHTML = `
			<p>1<span>${id}</span> = </p>
			<h3>${allCurrencies[id].value}<span>${base}</span></h3>
			`;
		});
	}

	showBaseOptions(allCurrencies) {
		this.allCurrencies = allCurrencies;
		const documentFragment = new DocumentFragment();
		const selectEelement = document.querySelector('div.base-bar select');

		for (const currency of Object.keys(allCurrencies)) {
			const option = document.createElement('option');
			option.value = allCurrencies[currency].id;
			option.innerHTML = allCurrencies[currency].id;
			documentFragment.appendChild(option);
		}
		selectEelement.appendChild(documentFragment);
	}
}
