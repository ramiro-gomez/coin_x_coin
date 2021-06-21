import LocalSHandler from '../LocalSHandler';

describe('#loadStorage', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should return the saved: base, bases of exchange and pushpins in localStorage', () => {
		localStorage.setItem('savedBase', JSON.stringify('BRL'));
		localStorage.setItem('savedExchange0', JSON.stringify('CLP'));
		localStorage.setItem('savedExchange1', JSON.stringify('MXN'));
		localStorage.setItem('savedPushpins', JSON.stringify(['UYU', 'PEN', 'BOB']));
		const {
			savedBase, savedExchange0, savedExchange1, savedPushpins,
		} = LocalSHandler.loadStorage();
		expect(savedBase).toBe('BRL');
		expect(savedExchange0).toBe('CLP');
		expect(savedExchange1).toBe('MXN');
		expect(savedPushpins).toStrictEqual(['UYU', 'PEN', 'BOB']);
	});
	it('should set default values localStorage if there are no saved', () => {
		const {
			savedBase, savedExchange0, savedExchange1, savedPushpins,
		} = LocalSHandler.loadStorage();
		expect(typeof savedBase).toBe('string');
		expect(typeof savedExchange0).toBe('string');
		expect(typeof savedExchange1).toBe('string');
		expect(Array.isArray(savedPushpins)).toBeTruthy();
		expect(JSON.parse(localStorage.getItem('savedBase'))).toBe(savedBase);
		expect(JSON.parse(localStorage.getItem('savedExchange0'))).toBe(savedExchange0);
		expect(JSON.parse(localStorage.getItem('savedExchange1'))).toBe(savedExchange1);
		expect(JSON.parse(localStorage.getItem('savedPushpins'))).toStrictEqual(savedPushpins);
	});
});

describe('#updatesavedBase', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should update savedBase in localStorage', () => {
		LocalSHandler.updateSavedBase('COP');
		expect(JSON.parse(localStorage.getItem('savedBase'))).toBe('COP');
	});
});

describe('#updatesavedExchange', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should update savedExchange0 in localStorage', () => {
		localStorage.setItem('savedExchange0', JSON.stringify('ARS'));
		LocalSHandler.updateSavedExchange({
			exchangeNumber: 0,
			updateTo: 'BOB',
		});
		expect(JSON.parse(localStorage.getItem('savedExchange0'))).toBe('BOB');
	});
	it('should update savedExchange1 in localStorage', () => {
		localStorage.setItem('savedExchange1', JSON.stringify('ARS'));
		LocalSHandler.updateSavedExchange({
			exchangeNumber: 1,
			updateTo: 'VES',
		});
		expect(JSON.parse(localStorage.getItem('savedExchange1'))).toBe('VES');
	});
});

describe('#toggleSavedPushpin', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should remove the pushpin from localStorage if it was previously saved in savedPushpins', () => {
		localStorage.setItem('savedPushpins', JSON.stringify(['GBP', 'CHF']));
		LocalSHandler.toggleSavedPushpin('GBP');
		expect(JSON.parse(localStorage.getItem('savedPushpins'))).toStrictEqual(['CHF']);
		LocalSHandler.toggleSavedPushpin('CHF');
		expect(JSON.parse(localStorage.getItem('savedPushpins'))).toStrictEqual([]);
	});
	it('should save the pushpin in localStorage if it was not previously saved in savedPushpins', () => {
		localStorage.setItem('savedPushpins', JSON.stringify([]));
		LocalSHandler.toggleSavedPushpin('GBP');
		expect(JSON.parse(localStorage.getItem('savedPushpins'))).toStrictEqual(['GBP']);
		LocalSHandler.toggleSavedPushpin('CHF');
		expect(JSON.parse(localStorage.getItem('savedPushpins'))).toStrictEqual(['GBP', 'CHF']);
	});
});
