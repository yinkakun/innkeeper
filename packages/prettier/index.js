/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig  } */
export default {
  semi: true,
  tabWidth: 2,
  printWidth: 140,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
};
