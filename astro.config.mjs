// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  build: {
    out: './dist', // output folder
  },
  site: 'https://davidgonzalezfx.github.io',
  base: '/prompt-library/',
});
