// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Host-agnostic: the GitHub Pages workflow passes SITE_URL and BASE_PATH.
// Netlify sets URL and Cloudflare Pages sets CF_PAGES_URL, so the same
// build works there with no changes. Once a custom domain is live,
// BASE_PATH comes through empty and the site serves from "/".
const site =
  process.env.SITE_URL || process.env.URL || process.env.CF_PAGES_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/styleguide') && !page.includes('/404'),
    }),
  ],
});
