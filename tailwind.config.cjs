/** @type {import('tailwindcss').Config} */

const config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/react-tailwindcss-select/dist/index.esm.js"
	],
	theme: {
		extend: {
			colors: {
				wisegreen: "#9FE870"
			}
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		styled: true,
		themes: [
			{
				garden: {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					...require("daisyui/src/colors/themes")["[data-theme=garden]"],
					primary: "#7BA8D4",
					// "primary-content": "#163300",
					"base-100": "#fff"
				},
				halloween: {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					...require("daisyui/src/colors/themes")["[data-theme=halloween]"],
					primary: "#7BA8D4",
					// "primary-content": "#163300",
					// secondary: "#163300"
				}
			},
		],
		darkTheme: "halloween"
	}
};

module.exports = config;
