import type { Config } from 'tailwindcss';
import baseConfig from 'tailwind-config';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [baseConfig],
} satisfies Config;
