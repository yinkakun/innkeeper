/** @typedef  {import("prettier").Config} PrettierConfig */

import baseConfig from 'prettier-config';

/** @type { PrettierConfig  } */
export default {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
};
