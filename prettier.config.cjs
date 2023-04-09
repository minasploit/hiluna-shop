/** @type {import("prettier").Config} */
const config = {
  arrowParens: "always",
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 4,
  useTabs: true,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
