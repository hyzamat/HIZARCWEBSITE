/**
 * Runs after `vite build`: renders the page to static HTML so phones get a real page on the very
 * first byte (faster first paint, better Google ranking), then React takes over in the browser.
 * Also writes robots.txt + sitemap.xml and the schema.org data for search engines.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const entry = (await fs.readdir(ssrDir)).find((f) => /^entry-server\.m?js$/.test(f))
if (!entry) throw new Error('SSR bundle not found in dist-ssr/')
const { render, structuredData, site } = await import(pathToFileURL(path.join(ssrDir, entry)).href)

const indexPath = path.join(dist, 'index.html')
let html = await fs.readFile(indexPath, 'utf8')
if (!html.includes('<!--app-html-->')) throw new Error('dist/index.html is missing the <!--app-html--> placeholder')

const head = []

// Start downloading the headline font straight away
const assets = await fs.readdir(path.join(dist, 'assets'))
const font = assets.find((f) => /^sora-latin-wght-normal.*\.woff2$/.test(f))
if (font) head.push(`<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`)

for (const data of structuredData()) {
  head.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
}

html = html
  .replace('</head>', `  ${head.join('\n    ')}\n  </head>`)
  .replace('<!--app-html-->', render())

await fs.writeFile(indexPath, html)

const url = site.url.replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`)
await fs.writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
)

await fs.rm(ssrDir, { recursive: true, force: true })

const kb = (Buffer.byteLength(html) / 1024).toFixed(1)
console.log(`✓ pre-rendered dist/index.html (${kb} kB) · robots.txt · sitemap.xml`)
