export default class LocalSHandler {
	static loadStorage() {
		const saved = {
			savedBase: JSON.parse(localStorage.getItem('savedBase')) || 'ARS',
			savedExchange0: JSON.parse(localStorage.getItem('savedExchange0')) || 'ARS',
			savedExchange1: JSON.parse(localStorage.getItem('savedExchange1')) || 'USD',
			savedPushpins: JSON.parse(localStorage.getItem('savedPushpins')) || ['EUR', 'GBP', 'USD'],
		};
		Object.entries(saved).forEach(([itemName, itemValue]) => {
			if (!localStorage.getItem(itemName)) {
				localStorage.setItem(itemName, JSON.stringify(itemValue));
			}
		});
		return saved;
	}

	static updateSavedBase(base) {
		localStorage.setItem('savedBase', JSON.stringify(base));
	}

	static updateSavedExchange({ exchangeNumber, updateTo }) {
		localStorage.setItem(`savedExchange${exchangeNumber}`, JSON.stringify(updateTo));
	}

	static toggleSavedPushpin(id) {
		const savedPushpins = JSON.parse(localStorage.getItem('savedPushpins'));
		const idPosition = savedPushpins.indexOf(id);
		if (idPosition >= 0) savedPushpins.splice(idPosition, 1);
		else savedPushpins.push(id);
		localStorage.setItem('savedPushpins', JSON.stringify(savedPushpins));
	}
}
