import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/config/site.ts'

// Fills the SEO tags in index.html from src/config/site.ts
function siteMeta(): Plugin {
  return {
    name: 'hizarc-site-meta',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', site.url.replace(/\/$/, '')),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
  // one pre-rendered page: React + Motion in a single ~160 kB (gzip) bundle is expected
  build: { chunkSizeWarningLimit: 700 },
})
