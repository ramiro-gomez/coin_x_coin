const Tailwindcss = require('./node_modules/tailwindcss');
const PostcssPresetEnv = require('./node_modules/postcss-preset-env');

module.exports = {
	plugins: [
		new Tailwindcss(),
		new PostcssPresetEnv({
			features: { 'focus-within-pseudo-class': false },
		}),
	],
};
