import LocalSHandler from '../LocalSHandler';

describe('#loadDefaults', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should return the defaults: base, bases of exchange and pushpins in localStorage', () => {
		localStorage.setItem('defaultBase', JSON.stringify('BRL'));
		localStorage.setItem('defaultExchange0', JSON.stringify('CLP'));
		localStorage.setItem('defaultExchange1', JSON.stringify('MXN'));
		localStorage.setItem('defaultPushpins', JSON.stringify(['UYU', 'PEN', 'BOB']));
		const {
			defaultBase, defaultExchange0, defaultExchange1, defaultPushpins,
		} = LocalSHandler.loadDefaults();
		expect(defaultBase).toBe('BRL');
		expect(defaultExchange0).toBe('CLP');
		expect(defaultExchange1).toBe('MXN');
		expect(defaultPushpins).toStrictEqual(['UYU', 'PEN', 'BOB']);
	});
	it('should set defaults in localStorage if there are no defaults saved', () => {
		const {
			defaultBase, defaultExchange0, defaultExchange1, defaultPushpins,
		} = LocalSHandler.loadDefaults();
		expect(typeof defaultBase).toBe('string');
		expect(typeof defaultExchange0).toBe('string');
		expect(typeof defaultExchange1).toBe('string');
		expect(Array.isArray(defaultPushpins)).toBeTruthy();
		expect(JSON.parse(localStorage.getItem('defaultBase'))).toBe(defaultBase);
		expect(JSON.parse(localStorage.getItem('defaultExchange0'))).toBe(defaultExchange0);
		expect(JSON.parse(localStorage.getItem('defaultExchange1'))).toBe(defaultExchange1);
		expect(JSON.parse(localStorage.getItem('defaultPushpins'))).toStrictEqual(defaultPushpins);
	});
});

describe('#updateDefaultBase', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should update defaultBase in localStorage', () => {
		LocalSHandler.updateDefaultBase('COP');
		expect(JSON.parse(localStorage.getItem('defaultBase'))).toBe('COP');
	});
});

describe('#updateDefaultExchange', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should update defaultExchange0 in localStorage', () => {
		localStorage.setItem('defaultExchange0', JSON.stringify('ARS'));
		LocalSHandler.updateDefaultExchange({
			exchangeNumber: 0,
			updateTo: 'BOB',
		});
		expect(JSON.parse(localStorage.getItem('defaultExchange0'))).toBe('BOB');
	});
	it('should update defaultExchange1 in localStorage', () => {
		localStorage.setItem('defaultExchange1', JSON.stringify('ARS'));
		LocalSHandler.updateDefaultExchange({
			exchangeNumber: 1,
			updateTo: 'VES',
		});
		expect(JSON.parse(localStorage.getItem('defaultExchange1'))).toBe('VES');
	});
});

describe('#toggleDefaultPushpin', () => {
	beforeEach(() => {
		localStorage.clear();
	});
	it('should remove the pushpin from localStorage if it was previously saved in defaultsPushpins', () => {
		localStorage.setItem('defaultPushpins', JSON.stringify(['GBP', 'CHF']));
		LocalSHandler.toggleDefaultPushpin('GBP');
		expect(JSON.parse(localStorage.getItem('defaultPushpins'))).toStrictEqual(['CHF']);
		LocalSHandler.toggleDefaultPushpin('CHF');
		expect(JSON.parse(localStorage.getItem('defaultPushpins'))).toStrictEqual([]);
	});
	it('should save the pushpin in localStorage if it was not previously saved in defaultsPushpins', () => {
		localStorage.setItem('defaultPushpins', JSON.stringify([]));
		LocalSHandler.toggleDefaultPushpin('GBP');
		expect(JSON.parse(localStorage.getItem('defaultPushpins'))).toStrictEqual(['GBP']);
		LocalSHandler.toggleDefaultPushpin('CHF');
		expect(JSON.parse(localStorage.getItem('defaultPushpins'))).toStrictEqual(['GBP', 'CHF']);
	});
});
