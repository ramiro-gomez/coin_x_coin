export class UserInterface {
	showCards(cardsArray, base) {
		this.cardsArray = cardsArray;
		this.base = base;

		const documentFragment = new DocumentFragment();
		const middleElement = document.querySelector('.middle-container');
		for (const card of cardsArray) {
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card');
			cardDiv.innerHTML = `
			<a>
				<i class="fas fa-thumbtack"></i>
			</a>
			<div>
				<h2>${card.id}</h2>
				<p>${card.name}</p>
			</div>
			<p class="card-sub-text">1<span>${card.id}</span> = </p>
			<h3>${card.value}<span>${base}</span></h3>
			`;
			documentFragment.appendChild(cardDiv);
		}
		middleElement.appendChild(documentFragment);
	}
}
