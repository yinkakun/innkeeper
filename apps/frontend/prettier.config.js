/** @typedef  {import("prettier").Config} PrettierConfig */

import baseConfig from 'prettier-config';

/** @type { PrettierConfig  } */
export default {
  ...baseConfig,
  tailwindFunctions: ['clsx', 'cn'],
  plugins: ['prettier-plugin-tailwindcss'],
};
