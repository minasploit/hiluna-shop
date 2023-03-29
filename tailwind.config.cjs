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
					...require("daisyui/src/colors/themes")["[data-theme=garden]"],
					primary: "#026002d4",
				},
				halloween: {
					...require("daisyui/src/colors/themes")["[data-theme=halloween]"],
					primary: "#9FE973",
				}
			},
		],
		darkTheme: "halloween"
	}
};

module.exports = config;
