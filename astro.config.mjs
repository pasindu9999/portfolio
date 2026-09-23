// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The canonical public address of the site. Astro does not use this to
  // deploy anywhere -- it is stamped into the generated HTML: every
  // <link rel="canonical">, every og:image / og:url, and every <loc> in
  // sitemap-index.xml. If it does not match the address people actually visit,
  // Google is told the real pages live somewhere else.
  // Change this the day a custom domain is added.
  site: 'https://udara-kurukulasooriya-portolio.netlify.app',
  output: 'static',

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  // Astro's built-in font pipeline: downloads, subsets and self-hosts, and
  // generates fallback metrics so there is no CLS on swap. Replaces the old
  // render-blocking Google Fonts @import that pulled all 18 Poppins weights.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bricolage Grotesque',
      cssVariable: '--face-display',
      weights: ['200 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--face-body',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--face-mono',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
