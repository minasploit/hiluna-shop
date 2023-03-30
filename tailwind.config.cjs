/** @type {import('tailwindcss').Config} */

const config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/react-tailwindcss-select/dist/index.esm.js"
	],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		styled: true,
		themes: [
			{
				garden: {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					...require("daisyui/src/colors/themes")["[data-theme=garden]"],
					primary: "#163300",
				},
				halloween: {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					...require("daisyui/src/colors/themes")["[data-theme=halloween]"],
					primary: "#9FE870",
					"primary-focus": "#80e142"
				}
			},
		],
		darkTheme: "halloween"
	}
};

module.exports = config;
