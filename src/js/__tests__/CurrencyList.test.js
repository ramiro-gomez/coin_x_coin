import CurrencyList from '../CurrencyList';
import RequestHandler from '../RequestHandler';
import Conversor from '../Conversor';

jest.mock('../RequestHandler');
jest.mock('../Conversor');
const toBase = jest.spyOn(Conversor, 'toBase').mockImplementation(() => 'mocked to base value');

describe('#constructor', () => {
	beforeEach(() => {
		toBase.mockClear();
	});
	it(`should create currencies with the id and name in currencyNames,
	price value in exchangeRate converted with Conversor.toBase,
	and price basis in the given base`, async () => {
		const mockCurrencyNames = await RequestHandler.getCurrencyNames();
		const mockExchageRates = await RequestHandler.getExchangeRates();
		const currencyList = new CurrencyList({
			currencyNames: mockCurrencyNames,
			exchangeRates: mockExchageRates,
			base: 'ARS',
		});
		const currenciesLenght = Object.keys(currencyList.currencies).length;
		expect(toBase).toHaveBeenCalledTimes(currenciesLenght);
		expect(toBase).toHaveBeenCalledWith(expect.anything());
		const mockObjCurrencyNames = mockCurrencyNames.reduce((acc, currency) => ({
			...acc,
			[currency.id]: {
				id: currency.id,
				name: currency.name,
			},
		}), {});
		Object.entries(currencyList.currencies).forEach(([id, currency]) => {
			expect(currency.id).toBe(mockObjCurrencyNames[id].id);
			expect(currency.name).toBe(mockObjCurrencyNames[id].name);
			expect(currency.price.value).toBe('mocked to base value');
			expect(currency.price.base).toBe('ARS');
		});
		expect.assertions(2 + (currenciesLenght * 4));
	});
});
