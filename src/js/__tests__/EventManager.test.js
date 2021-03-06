import fs from 'fs';
import path from 'path';
import { JSDOM } from '../../../node_modules/jsdom';
import EventManager from '../EventManager';
import UserInterface from '../UserInterface';
import Conversor from '../Conversor';
import RequestHandler from '../RequestHandler';
import CurrencyList from '../CurrencyList';
import LocalSHandler from '../LocalSHandler';

jest.mock('../UserInterface');
jest.mock('../Conversor');
jest.mock('../RequestHandler');
jest.mock('../CurrencyList');
jest.mock('../LocalSHandler');

const HTML = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
const DOM = new JSDOM(HTML);
document.body.innerHTML = DOM.window.document.body.innerHTML;
const mockModalContainer = DOM.window.document.querySelector('.modal-container').outerHTML;

const readyState = jest.spyOn(document, 'readyState', 'get');
const getExchangeRates = jest.spyOn(RequestHandler, 'getExchangeRates');
const convertValueOfExchangeInput = jest.spyOn(Conversor, 'convertValueOfExchangeInput');
const toBase = jest.spyOn(Conversor, 'toBase');
const showValueInExchangeInput = jest.spyOn(UserInterface, 'showValueInExchangeInput');
const toggleCardPushpin = jest.spyOn(UserInterface, 'toggleCardPushpin');
const showModal = jest.spyOn(UserInterface, 'showModal');
const hideModal = jest.spyOn(UserInterface, 'hideModal');
const updatesavedBase = jest.spyOn(LocalSHandler, 'updateSavedBase');
const updatesavedExchange = jest.spyOn(LocalSHandler, 'updateSavedExchange');
const toggleSavedPushpin = jest.spyOn(LocalSHandler, 'toggleSavedPushpin');

const mockCards = `
	<div class="card">
		<button type="button">
			<i class="fas fa-thumbtack"></i>
		</button>
		<div class="card-name">
			<h2>AED</h2>
			<p>United Arab Emirates Dirham</p>
		</div>
		<div class="card-price">
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
		<div class="card-price">
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
		<div class="card-price">
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
		<div class="card-price">
			<p>1<span>AWG</span> = </p>
			<h3>3.5<span>ARS</span></h3>
		</div>
	</div>
`;

describe('#docReady', () => {
	const mockFunction = jest.fn();
	beforeEach(() => {
		mockFunction.mockClear();
	});
	it('should execute the given function when the initial DOM tree is loaded', () => {
		readyState.mockImplementation(() => 'loading');
		EventManager.docReady(mockFunction);
		expect(mockFunction).not.toHaveBeenCalled();
		document.dispatchEvent(new Event('DOMContentLoaded'));
		expect(mockFunction).toHaveBeenCalledTimes(1);
	});
	it('should execute the given function if the initial DOM tree has already been loaded', async () => {
		readyState.mockImplementation(() => 'interactive');
		EventManager.docReady(mockFunction);
		await expect(mockFunction).toHaveBeenCalledTimes(1);
	});
});

describe('#addModalEvent', () => {
	beforeEach(() => {
		document.querySelector('.modal-container').outerHTML = mockModalContainer;
		showModal.mockClear();
		hideModal.mockClear();
		EventManager.addModalEvent();
	});
	it('should call to showModal if the openModalBtn is clicked', () => {
		const openModalBtn = document.getElementById('open-modal-button');
		openModalBtn.dispatchEvent(new Event('click'));
		expect(showModal).toHaveBeenCalledTimes(1);
	});
	it('should call to hideModal if the closeModalBtn is clicked', () => {
		const closeModalBtn = document.getElementById('close-modal-button');
		closeModalBtn.dispatchEvent(new Event('click'));
		expect(hideModal).toHaveBeenCalledTimes(1);
	});
	it('should call to hideModal if the overlay is clicked', () => {
		const overlay = document.querySelector('.overlay');
		overlay.dispatchEvent(new Event('click'));
		expect(hideModal).toHaveBeenCalledTimes(1);
	});
});

describe('#addPushpinEvent', () => {
	beforeEach(() => {
		document.querySelector('.middle-container').innerHTML = mockCards;
		toggleCardPushpin.mockClear();
		toggleSavedPushpin.mockClear();
	});
	afterAll(() => {
		document.querySelector('.middle-container').innerHTML = '';
	});
	it('should call toggleCardPushpin and toggleSavedPushpin each time a pushpin of a card is clicked', () => {
		const cardElements = document.querySelectorAll('.middle-container .card');
		EventManager.addPushpinEvent(cardElements);
		cardElements.forEach((card, index) => {
			const id = card.querySelector('.card-name h2').textContent;
			const pushpin = card.querySelector('button');
			pushpin.dispatchEvent(new Event('click'));
			expect(toggleCardPushpin).toHaveBeenCalledTimes(index + 1);
			expect(toggleCardPushpin).toHaveBeenCalledWith(card);
			expect(toggleSavedPushpin).toHaveBeenCalledTimes(index + 1);
			expect(toggleSavedPushpin).toHaveBeenCalledWith(id);
		});
		expect.assertions(cardElements.length * 4);
	});
});

describe('#addSearchCardEvent', () => {
	beforeEach(() => {
		document.querySelector('.middle-container').innerHTML = mockCards;
		toggleCardPushpin.mockClear();
	});
	afterAll(() => {
		document.querySelector('.middle-container').innerHTML = '';
	});
	it('should hide the cards with id, name or value that don\'t match the word typed on searchInput', () => {
		const cardElements = document.querySelectorAll('.middle-container .card');
		const searchInput = document.querySelector('.search-box input');
		EventManager.addSearchCardEvent(cardElements);
		searchInput.value = 'afn';
		searchInput.dispatchEvent(new Event('keyup'));
		cardElements.forEach((card) => {
			const id = card.querySelector('.card-name h2').textContent;
			if (id === 'AFN') expect(card.classList.contains('hidden')).toBeFalsy();
			else expect(card.classList.contains('hidden')).toBeTruthy();
		});
		searchInput.value = 'arab';
		searchInput.dispatchEvent(new Event('keyup'));
		cardElements.forEach((card) => {
			const id = card.querySelector('.card-name h2').textContent;
			if (id === 'AED') expect(card.classList.contains('hidden')).toBeFalsy();
			else expect(card.classList.contains('hidden')).toBeTruthy();
		});
		searchInput.value = '0.9';
		searchInput.dispatchEvent(new Event('keyup'));
		cardElements.forEach((card) => {
			const id = card.querySelector('.card-name h2').textContent;
			if (id === 'ALL') expect(card.classList.contains('hidden')).toBeFalsy();
			else expect(card.classList.contains('hidden')).toBeTruthy();
		});
		expect.assertions(cardElements.length * 3);
	});
});

describe('#addInputConversionEvent', () => {
	const exchangeInput = document.querySelectorAll('div.exchange-box input');
	const exchangeSelector = document.querySelectorAll('div.exchange-box select');
	beforeEach(() => {
		convertValueOfExchangeInput.mockClear();
		showValueInExchangeInput.mockClear();
		getExchangeRates.mockClear();
		updatesavedExchange.mockClear();
	});
	afterAll(() => {
		exchangeInput.forEach((input) => {
			input.value = '';
		});
		exchangeSelector.forEach((selector) => {
			selector.innerHTML = '';
		});
	});
	it('should call getExchangeRates if the selectors doesn\'t have the same currency', async () => {
		await EventManager.addInputConversionEvent({
			selectorsWithSameCurrency: false,
			savedExchange0: 'PYG',
		});
		expect(getExchangeRates).toHaveBeenCalledTimes(1);
		expect(getExchangeRates).toHaveBeenCalledWith('PYG');
	});
	describe('should call convertValueOfExchangeInput and showValueInExchangeInput', () => {
		let mockExchangeRates;
		beforeAll(async () => {
			exchangeInput.forEach((input) => input.replaceWith(input.cloneNode(true)));
			exchangeSelector.forEach((selector) => selector.replaceWith(selector.cloneNode(true)));
			mockExchangeRates = await RequestHandler.getExchangeRates();
			EventManager.addInputConversionEvent({
				selectorsWithSameCurrency: true,
				exchangeRates: mockExchangeRates,
			});
		});
		it('on keyup and change event of exchangeInput 0', () => {
			exchangeInput[0].value = '0.1';
			['keyup', 'change'].forEach((eventType, index) => {
				exchangeSelector[1].innerHTML = '<option value="RUB">RUB</option>';
				exchangeInput[0].dispatchEvent(new Event(eventType));
				expect(convertValueOfExchangeInput).toHaveBeenCalledTimes(index + 1);
				expect(convertValueOfExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
					ofInputNumber: 0,
					withValue: '0.1',
					referenceExchangeRate: mockExchangeRates.RUB,
				}));
				expect(showValueInExchangeInput).toHaveBeenCalledTimes(index + 1);
				expect(showValueInExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
					showInInputNumber: 1,
				}));
			});
		});
		it('on keyup and change event of exchangeInput 1', () => {
			exchangeSelector[1].innerHTML = '<option value="INR">INR</option>';
			exchangeInput[1].value = '10.5';
			['keyup', 'change'].forEach((eventType, index) => {
				exchangeInput[1].dispatchEvent(new Event(eventType));
				expect(convertValueOfExchangeInput).toHaveBeenCalledTimes(index + 1);
				expect(convertValueOfExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
					ofInputNumber: 1,
					withValue: '10.5',
					referenceExchangeRate: mockExchangeRates.INR,
				}));
				expect(showValueInExchangeInput).toHaveBeenCalledTimes(index + 1);
				expect(showValueInExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
					showInInputNumber: 0,
				}));
			});
		});
		it('on change event of exchangeSelector 0. And also call updatesavedExchange and getExchangeRates', async () => {
			exchangeSelector[0].innerHTML = '<option value="BRL">BRL</option>';
			exchangeSelector[1].innerHTML = '<option value="MXN">MXN</option>';
			await exchangeSelector[0].dispatchEvent(new Event('change'));
			expect(updatesavedExchange).toHaveBeenCalledTimes(1);
			expect(updatesavedExchange).toHaveBeenCalledWith({
				exchangeNumber: 0,
				updateTo: 'BRL',
			});
			expect(getExchangeRates).toHaveBeenCalledTimes(1);
			expect(getExchangeRates).toHaveBeenCalledWith('BRL');
			expect(convertValueOfExchangeInput).toHaveBeenCalledTimes(1);
			expect(convertValueOfExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
				ofInputNumber: 0,
				referenceExchangeRate: mockExchangeRates.MXN,
			}));
			expect(showValueInExchangeInput).toHaveBeenCalledTimes(1);
			expect(showValueInExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
				showInInputNumber: 1,
			}));
		});
		it('on change event of exchangeSelector 1. And also call updatesavedExchange', () => {
			exchangeSelector[1].innerHTML = '<option value="RUB">RUB</option>';
			exchangeSelector[1].dispatchEvent(new Event('change'));
			expect(updatesavedExchange).toHaveBeenCalledTimes(1);
			expect(updatesavedExchange).toHaveBeenCalledWith({
				exchangeNumber: 1,
				updateTo: 'RUB',
			});
			expect(convertValueOfExchangeInput).toHaveBeenCalledTimes(1);
			expect(convertValueOfExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
				ofInputNumber: 0,
				referenceExchangeRate: mockExchangeRates.RUB,
			}));
			expect(showValueInExchangeInput).toHaveBeenCalledTimes(1);
			expect(showValueInExchangeInput).toHaveBeenCalledWith(expect.objectContaining({
				showInInputNumber: 1,
			}));
		});
	});
});

describe('#addBaseSelectorEvent', () => {
	const baseSelector = document.querySelector('div.base-bar select');
	beforeEach(() => {
		getExchangeRates.mockClear();
		toBase.mockClear();
	});
	afterAll(() => {
		baseSelector.innerHTML = '';
	});
	it(`should call updatesavedBase and getExchangeRates, then update the prices in
	currencyList with Conversor.toBase and then call updateCardPrices`, async () => {
		const mockCurrencyList = new CurrencyList();
		EventManager.addBaseSelectorEvent(mockCurrencyList);
		baseSelector.innerHTML = '<option value="CAD">CAD</option>';
		await baseSelector.dispatchEvent(new Event('change'));
		expect(updatesavedBase).toHaveBeenCalledTimes(1);
		expect(updatesavedBase).toHaveBeenCalledWith('CAD');
		expect(getExchangeRates).toHaveBeenCalledTimes(1);
		expect(getExchangeRates).toHaveBeenCalledWith('CAD');
		const currencyListLength = Object.keys(mockCurrencyList.currencies).length;
		expect(toBase).toHaveBeenCalledTimes(currencyListLength);
		Object.values(mockCurrencyList.currencies).forEach((currency) => {
			expect(currency.price.base).toBe('CAD');
		});
		expect.assertions(5 + currencyListLength);
	});
});
