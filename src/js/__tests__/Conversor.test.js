import Conversor from '../Conversor';

const twoDecimals = jest.spyOn(Conversor, 'twoDecimals');

describe('#twoDecimals', () => {
	it('should keep the numbers without decimals equal', () => {
		expect(Conversor.twoDecimals(1)).toBe(1);
	});
	it('should round the numbers to two decimals places', () => {
		expect(Conversor.twoDecimals(1.2255)).toBe(1.23);
	});
	it('should return the first two non-zero decimal places for numbers less than 1', () => {
		expect(Conversor.twoDecimals(0.0000446)).toBe(0.000045);
		expect(Conversor.twoDecimals(0.00008009)).toBe(0.00008);
	});
});

describe('#toBase', () => {
	beforeEach(() => {
		twoDecimals.mockClear();
	});
	it('should divide 1 by the value and round the result with twoDecimals', () => {
		expect(Conversor.toBase(0.015)).toBe(66.67); // 1 / 0.015 = 66.66666
		expect(twoDecimals).toHaveBeenCalledTimes(1);
		expect(twoDecimals).toHaveBeenCalledWith(expect.anything());
		expect(Conversor.toBase(3.6731)).toBe(0.27); // 1 / 3.6731 = 0,272249
		expect(twoDecimals).toHaveBeenCalledTimes(2);
		expect(twoDecimals).toHaveBeenCalledWith(expect.anything());
	});
});

describe('#convertValueOfExchangeInput', () => {
	beforeEach(() => {
		twoDecimals.mockClear();
	});
	it('should multiply the value of input 0 by the referenceExchangeRate and round the result with twoDecimals', () => {
		expect(Conversor.convertValueOfExchangeInput({
			ofInputNumber: 0,
			withValue: 2,
			referenceExchangeRate: 3,
		})).toBe(6);
		expect(twoDecimals).toHaveBeenCalledTimes(1);
		expect(twoDecimals).toHaveBeenCalledWith(expect.anything());
	});
	it('should divide the value of input 1 by the referenceExchangeRate and round the result with twoDecimals', () => {
		expect(Conversor.convertValueOfExchangeInput({
			ofInputNumber: 1,
			withValue: 6,
			referenceExchangeRate: 2,
		})).toBe(3);
		expect(twoDecimals).toHaveBeenCalledTimes(1);
		expect(twoDecimals).toHaveBeenCalledWith(expect.anything());
	});
	it('should return null if the value is an empty string', () => {
		expect(Conversor.convertValueOfExchangeInput({ withValue: '' })).toBeNull();
	});
	it('should return 0 if the value is 0', () => {
		expect(Conversor.convertValueOfExchangeInput({ withValue: 0 })).toBe(0);
	});
});
