export class UserInterface {
	showCards(cardsArray, base) {
		this.cardsArray = cardsArray;
		this.base = base;

		const documentFragment = new DocumentFragment();
		const middleElement = document.querySelector('.middle-container');
		for (const card of cardsArray) {
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card');
			// let cardSubName = `<p>${card.name}</p>`;
			// if (card.name.length >= 11) {
			// cardSubName = `<p class="f-size-large-text">${card.name}</p>`;
			// }
			cardDiv.innerHTML = `
			<a>
                <i class="fas fa-thumbtack"></i>
            </a>
            <div class="card-name">
                <h2>${card.id}</h2>
                <p>${card.name}</p>
            </div>
            <div class="card-value">
                <p>1<span>${card.id}</span> = </p>
                <h3>${card.value}<span>${base}</span></h3>
            </div>
			`;
			documentFragment.appendChild(cardDiv);
		}
		middleElement.appendChild(documentFragment);
	}
}
