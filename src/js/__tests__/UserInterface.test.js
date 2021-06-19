import fs from 'fs';
import path from 'path';
import { JSDOM } from '../../../node_modules/jsdom';
import UserInterface from '../UserInterface';
import CurrencyList from '../CurrencyList';

jest.mock('../CurrencyList.js');
const mockCurrencyList = new CurrencyList();

const HTML = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
const DOM = new JSDOM(HTML);
document.body.innerHTML = DOM.window.document.body.innerHTML;
const mockModalContainer = DOM.window.document.querySelector('.modal-container').outerHTML;
const mockCards = `
	<div class="card">
		<button type="button">
			<i class="fas fa-thumbtack"></i>
		</button>
		<div class="card-name">
			<h2>AED</h2>
			<p>United Arab Emirates Dirham</p>
		</div>
		<div class="card-value">
			<p>1<span>AED</span> = </p>
			<h3>25.9<span>ARS</span></h3>
		</div>
	</div>
	<div class="card">
		<button type="button">
			<i class="fas fa-thumbtack"></i>
		</button>
		<div class="card-name">
			<h2>AFN</h2>
			<p>Afghan Afghani</p>
		</div>
		<div class="card-value">
			<p>1<span>AFN</span> = </p>
			<h3>1.21<span>ARS</span></h3>
		</div>
	</div>
	<div class="card">
		<button type="button">
			<i class="fas fa-thumbtack"></i>
		</button>
		<div class="card-name">
			<h2>ALL</h2>
			<p>Albanian Lek</p>
		</div>
		<div class="card-value">
			<p>1<span>ALL</span> = </p>
			<h3>0.94<span>ARS</span></h3>
		</div>
	</div>
	<div class="card">
		<button type="button">
			<i class="fas fa-thumbtack"></i>
		</button>
		<div class="card-name">
			<h2>AWG</h2>
			<p>Aruban Florin</p>
		</div>
		<div class="card-value">
			<p>1<span>AWG</span> = </p>
			<h3>3.5<span>ARS</span></h3>
		</div>
	</div>
`;

describe('#showCards', () => {
	it('should render the cards in the middle-container', () => {
		const middleElement = document.querySelector('.middle-container');
		UserInterface.showCards(mockCurrencyList);
		expect(middleElement).toMatchSnapshot();
	});
});

describe('#updateCardPrices', () => {
	beforeEach(() => {
		document.querySelector('.middle-container').innerHTML = mockCards;
	});
	it('should update the prices of the cards with the given currencies', () => {
		const cardElements = document.querySelectorAll('.middle-container div.card');
		UserInterface.updateCardPrices(mockCurrencyList);
		let assertions = 0;
		cardElements.forEach((card) => {
			const id = card.querySelector('.card-name h2').textContent;
			const priceValue = card.querySelector('.card-value h3').childNodes[0].nodeValue.replace(/\s+/g, '');
			const priceBasis = card.querySelector('.card-value h3 span').textContent;
			if (mockCurrencyList.currencies[id]) {
				expect(priceValue).toBe(mockCurrencyList.currencies[id].price.value.toString());
				expect(priceBasis).toBe(mockCurrencyList.currencies[id].price.base);
				assertions += 2;
			}
		});
		expect.assertions(assertions);
	});
});

describe('#toggleCardPushpin', () => {
	beforeEach(() => {
		document.querySelector('.middle-container').innerHTML = mockCards;
	});
	beforeAll(() => {
		document.querySelector('.middle-container').innerHTML = '';
	});
	it('should toggle the classes pushpin and order-first of the given card', () => {
		const card = document.querySelector('.middle-container .card');
		const pushpin = card.querySelector('button i');
		UserInterface.toggleCardPushpin(card);
		expect(pushpin.className).toMatch('pushpin');
		expect(card.className).toMatch('order-first');
		UserInterface.toggleCardPushpin(card);
		expect(pushpin.className).not.toMatch('pushpin');
		expect(card.className).not.toMatch('order-first');
	});
});

describe('#addDefaultPushpins', () => {
	beforeEach(() => {
		document.querySelector('.middle-container').innerHTML = mockCards;
	});
	beforeAll(() => {
		document.querySelector('.middle-container').innerHTML = '';
	});
	it('should add the pushpin and order-first class to the cards of the indicated currencies', () => {
		const mockDefaultPushpins = ['AFN', 'ALL'];
		const cardElements = document.querySelectorAll('.middle-container div.card');
		UserInterface.addDefaultPushpins({
			toCardElements: cardElements,
			defaultPushpins: mockDefaultPushpins,
		});
		cardElements.forEach((card) => {
			const id = card.querySelector('div.card-name h2').textContent;
			const pushpinIcon = card.querySelector('button i');
			if (mockDefaultPushpins.includes(id)) {
				expect(pushpinIcon.classList.contains('pushpin')).toBeTruthy();
				expect(card.classList.contains('order-first')).toBeTruthy();
			} else {
				expect(pushpinIcon.classList.contains('pushpin')).toBeFalsy();
				expect(card.classList.contains('order-first')).toBeFalsy();
			}
		});
		expect.assertions(cardElements.length * 2);
	});
});

describe('#showOptions', () => {
	afterEach(() => {
		document.querySelector('div.base-bar select').innerHTML = '';
	});
	it('should render the options of the base selector and exchange input selector 0 and 1', () => {
		const baseSelector = document.querySelector('div.base-bar select');
		const exchangeSelector = document.querySelectorAll('div.exchange-box select');
		UserInterface.showOptions({
			currencyList: mockCurrencyList,
		});
		expect(baseSelector).toMatchSnapshot();
		expect(exchangeSelector[0]).toMatchSnapshot();
		expect(exchangeSelector[1]).toMatchSnapshot();
	});
	it('should select the default option of the base selector and exchange input selector 0 and 1', () => {
		const baseSelector = document.querySelector('div.base-bar select');
		const exchangeSelector = document.querySelectorAll('div.exchange-box select');
		UserInterface.showOptions({
			currencyList: mockCurrencyList,
			defaultBase: 'AFN',
			defaultExchange0: 'ALL',
			defaultExchange1: 'AMD',
		});
		expect(baseSelector.value).toBe('AFN');
		expect(exchangeSelector[0].value).toBe('ALL');
		expect(exchangeSelector[1].value).toBe('AMD');
	});
});

describe('#showValueInExchangeInput', () => {
	beforeAll(() => {
		document.querySelectorAll('div.exchange-box input').forEach((input) => {
			input.value = '';
		});
	});
	it('should render the value in the exchange input 0', () => {
		const exchangeInput = document.querySelectorAll('div.exchange-box input');
		UserInterface.showValueInExchangeInput({
			showInInputNumber: 0,
			valueToShow: 15,
		});
		expect(exchangeInput[0].value).toBe('15');
	});
	it('should render the value in the exchange input 1', () => {
		const exchangeInput = document.querySelectorAll('div.exchange-box input');
		UserInterface.showValueInExchangeInput({
			showInInputNumber: 1,
			valueToShow: 30,
		});
		expect(exchangeInput[1].value).toBe('30');
	});
});

describe('#showModal', () => {
	afterEach(() => {
		document.querySelector('.modal-container').outerHTML = mockModalContainer;
	});
	it('should add the class open to modal-container', () => {
		const modalContainer = document.querySelector('.modal-container');
		UserInterface.showModal();
		expect(modalContainer.classList.contains('open')).toBeTruthy();
	});
});

describe('#hideModal', () => {
	afterEach(() => {
		document.querySelector('.modal-container').outerHTML = mockModalContainer;
	});
	it('should remove the class open to modal-container', () => {
		const modalContainer = document.querySelector('.modal-container');
		modalContainer.classList.add('open');
		UserInterface.hideModal();
		expect(modalContainer.classList.contains('open')).toBeFalsy();
	});
});
