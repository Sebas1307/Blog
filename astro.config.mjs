// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://sebastianpatino-blog.netlify.app',
  integrations: [mdx(), sitemap(), react()],
  adapter: node({ mode: 'standalone' }),

  vite: {
    plugins: [tailwindcss()]
  }
})