export default class LocalSHandler {
	static loadDefaults() {
		const defaults = {
			defaultBase: JSON.parse(localStorage.getItem('defaultBase')) || 'ARS',
			defaultExchange0: JSON.parse(localStorage.getItem('defaultExchange0')) || 'ARS',
			defaultExchange1: JSON.parse(localStorage.getItem('defaultExchange1')) || 'USD',
			defaultPushpins: JSON.parse(localStorage.getItem('defaultPushpins')) || ['EUR', 'GBP', 'USD'],
		};
		Object.entries(defaults).forEach(([itemName, itemValue]) => {
			if (!localStorage.getItem(itemName)) {
				localStorage.setItem(itemName, JSON.stringify(itemValue));
			}
		});
		return defaults;
	}

	static updateDefaultBase(base) {
		localStorage.setItem('defaultBase', JSON.stringify(base));
	}

	static updateDefaultExchange({ exchangeNumber, updateTo }) {
		localStorage.setItem(`defaultExchange${exchangeNumber}`, JSON.stringify(updateTo));
	}

	static toggleDefaultPushpin(id) {
		const defaultPushpins = JSON.parse(localStorage.getItem('defaultPushpins'));
		const idPosition = defaultPushpins.indexOf(id);
		if (idPosition >= 0) defaultPushpins.splice(idPosition, 1);
		else defaultPushpins.push(id);
		localStorage.setItem('defaultPushpins', JSON.stringify(defaultPushpins));
	}
}
