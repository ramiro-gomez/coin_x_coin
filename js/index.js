import { UserInterface } from './ui.js';
import { RequestHandler } from './request_handler.js';

const UI = new UserInterface();
const handler = new RequestHandler();
const currenciesList = {};
let exchangesList;
let baseCurrency = 'ARS'; //  Default base

const twoDecimals = (value) => {
	if (value < 1) {
		//  Return the first non-zero decimal and rounded it
		value = value.toFixed(1 - Math.floor(Math.log(value) / Math.log(100)));
	} else {
		value = value.toFixed(2);
	}
	return parseFloat(value);
};

const valueToBase = (val) => {
	const valConverted = 1 / parseFloat(val);
	return twoDecimals(valConverted);
};

Promise.all([
	handler.getCurrencies(),
	handler.getExchanges(baseCurrency),
]).then((responses) => Promise.all(responses.map((res) => res))).then((data) => {
	//  Join all the relevant data in currenciesList
	const coinbaseCurrencies = data[0];
	exchangesList = data[1];
	for (const currency of coinbaseCurrencies) {
		//  Avoid metals
		if (currency.name !== 'Silver (Troy Ounce)' && currency.name !== 'Gold (Troy Ounce)'
		&& currency.name !== 'Palladium' && currency.name !== 'Platinum') {
			currenciesList[currency.id] = {
				id: currency.id,
				name: currency.name,
				value: valueToBase(exchangesList[currency.id]),
			};
		}
	}
	UI.showCards(currenciesList, baseCurrency);
	UI.showOptions(currenciesList, baseCurrency);
}).catch((error) => {
	console.log(error);
});

//  Dom events
//  Update base currency
const selectBase = document.querySelector('div.base-bar select');
selectBase.addEventListener('change', (event) => {
	baseCurrency = event.target.value;
	handler.getExchanges(baseCurrency).then((exchanges) => {
		const exchangesConverted = {};
		for (const id of Object.keys(exchanges)) {
			exchangesConverted[id] = valueToBase(exchanges[id]);
		}
		UI.updateCardsExchanges(exchangesConverted, baseCurrency);
	}).catch((e) => console.log(e));
});

//  Make exchange
const selectExch = document.querySelectorAll('div.exchange-box select');
const inputExchange = document.querySelectorAll('div.exchange-box input');

const convert = (val, inputTargetNumb) => {
	val = parseFloat(val);
	if (val === 0) {
		inputExchange[inputTargetNumb].value = 0;
	} else if (Number.isNaN(val)) {
		inputExchange[inputTargetNumb].value = null;
	} else if (inputTargetNumb === 1) {
		inputExchange[inputTargetNumb].value = twoDecimals(val
			* exchangesList[selectExch[1].value]);
	} else {
		inputExchange[inputTargetNumb].value = twoDecimals(val
			/ exchangesList[selectExch[1].value]);
	}
};

selectExch[0].addEventListener('change', (event) => {
	//  Get exchange data with current currency for greater exchange accuracy
	handler.getExchanges(event.target.value).then((res) => {
		exchangesList = res;
		convert(inputExchange[0].value, 1);
	});
});
selectExch[1].addEventListener('change', () => {
	convert(inputExchange[0].value, 1);
});

inputExchange[0].addEventListener('keyup', (event) => {
	convert(event.target.value, 1);
});
inputExchange[0].addEventListener('change', (event) => {
	convert(event.target.value, 1);
});

inputExchange[1].addEventListener('keyup', (event) => {
	convert(event.target.value, 0);
});
inputExchange[1].addEventListener('change', (event) => {
	convert(event.target.value, 0);
});

//  Search card
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('keyup', (event) => {
	const cards = document.querySelectorAll('.middle-container div.card');
	cards.forEach((cardDiv) => {
		const cardName = cardDiv.querySelector('.card-name p').textContent.toLowerCase();
		const cardID = cardDiv.querySelector('.card-name h2').textContent.toLowerCase();
		const searchText = event.target.value.toLowerCase();
		if (cardName.includes(searchText) || cardID.includes(searchText)) cardDiv.classList.remove('d-none');
		else cardDiv.classList.add('d-none');
	});
});
