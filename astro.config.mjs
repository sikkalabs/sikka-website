// @ts-check
import { defineConfig } from 'astro/config';

// SIKKA website — static build deployed to GitHub Pages (sikkalabs.com).
// Sitemap is hand-maintained at public/sitemap.xml because the page set is
// fixed and Astro's sitemap integration emits non-.html URLs.
export default defineConfig({
  site: 'https://sikkalabs.com',
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});