module.exports = {
	purge: [],
	darkMode: false,
	theme: {
		fontFamily: {
			sans: ['Noto Sans JP', 'sans-serif'],
		},
		extend: {
			colors: {
				violet: {
					50: '#F3E7FF',
					100: '#b498ff',
					200: '#BC6DFF',
					300: '#a861ff',
					400: '#7C43BD',
					700: '#4A148C',
					900: '#12005E',
				},
				gray: {
					50: '#D6D6D6',
					100: '#8d8d8d',
					200: '#8f8f8f',
					300: '#b6b6b6',
					400: '#b9b9b9',
					600: '#454545',
					700: '#434343',
				},
				lightblue: {
					100: '#2b88d9',
					200: '#207fdf',
				},
				pushpin: '#FFD644',
				overlay: 'rgba(0, 0, 0, .35)',
			},
			fontSize: {
				tiny: '0.5rem',
				'3.5xl': '2rem',
			},
			borderRadius: {
				inherit: 'inherit',
			},
			minHeight: {
				'max-content': 'max-content',
			},
			minWidth: {
				16: '4rem',
				28: '7rem',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
