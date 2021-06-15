export default class Currency {
	#id;
	#name;
	#price;

	constructor({ id, name, price: { value, base } }) {
		this.#id = id;
		this.#name = name;
		this.#price = {
			value,
			base,
		};
	}

	get id() {
		return this.#id;
	}
	get name() {
		return this.#name;
	}
	get price() {
		return this.#price;
	}
	set updatePrice({ value, base }) {
		this.#price = {
			value,
			base,
		};
	}
}
