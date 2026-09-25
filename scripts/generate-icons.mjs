/**
 * Builds every icon + the social-share image from the vector logo.
 *   npm run icons
 * Output → public/ (favicon.svg, favicon.ico, favicon-32.png, apple-touch-icon.png,
 *                   icon-192.png, icon-512.png, og-image.png, site.webmanifest)
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { MARK_COLORS, MARK_PANELS } from '../src/components/brand/geometry.ts'

const root = path.resolve(import.meta.dirname, '..')
const pub = path.join(root, 'public')
const WORDMARK = (await fs.readFile(path.join(root, 'src/components/brand/wordmark.txt'), 'utf8')).trim()

const MARK_W = 792
const MARK_H = 870
const WORD_W = 1299
const WORD_H = 223
const INK = '#030a1c'
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

await fs.mkdir(pub, { recursive: true })

/** The H at a given height, top-left at (x, y). */
function mark({ x, y, height, tone = 'dark', opacity = 1 }) {
  const s = height / MARK_H
  const c = MARK_COLORS[tone]
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${opacity}">
    <polygon points="${MARK_PANELS.pillar}" fill="${c.pillar}"/>
    <polygon points="${MARK_PANELS.bar}" fill="${c.bar}"/>
    <polygon points="${MARK_PANELS.fold}" fill="${c.fold}"/>
    <polygon points="${MARK_PANELS.right}" fill="${c.right}"/>
  </g>`
}

function wordmark({ x, y, height, fill = '#fff' }) {
  const s = height / WORD_H
  return `<path transform="translate(${x} ${y}) scale(${s})" d="${WORDMARK}" fill="${fill}"/>`
}

const png = (svg, file) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(pub, file))

/* ── favicon.svg: original colours, switches to the reversed logo on dark browser tabs ── */
await fs.writeFile(
  path.join(pub, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-59 -20 910 910">
  <style>.p,.f{fill:#03204f}@media (prefers-color-scheme:dark){.p{fill:#fff}.f{fill:#3d9bff}}</style>
  <polygon class="p" points="${MARK_PANELS.pillar}"/>
  <polygon fill="#0077fc" points="${MARK_PANELS.bar}"/>
  <polygon class="f" points="${MARK_PANELS.fold}"/>
  <polygon fill="#0077fc" points="${MARK_PANELS.right}"/>
</svg>
`,
)

/* ── app icons: light tile with the original-colour H ── */
function appIcon(size, { markScale, radius = 0 }) {
  const h = size * markScale
  const w = (h * MARK_W) / MARK_H
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9f1fc"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#0077fc" stop-opacity="0.14"/><stop offset="1" stop-color="#0077fc" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#glow)"/>
  ${mark({ x: (size - w) / 2, y: (size - h) / 2, height: h, tone: 'light' })}
</svg>`
}

await png(appIcon(32, { markScale: 0.74, radius: 7 }), 'favicon-32.png')
await png(appIcon(180, { markScale: 0.58 }), 'apple-touch-icon.png')
// full-bleed tiles with the mark inside the 80% "maskable" safe zone
await png(appIcon(192, { markScale: 0.5 }), 'icon-192.png')
await png(appIcon(512, { markScale: 0.5 }), 'icon-512.png')

/* ── favicon.ico (PNG-in-ICO, 16/32/48) for crawlers that ask for /favicon.ico ── */
{
  const sizes = [16, 32, 48]
  const images = await Promise.all(
    sizes.map((s) => sharp(Buffer.from(appIcon(s, { markScale: 0.76, radius: Math.round(s * 0.2) }))).png().toBuffer()),
  )
  const header = Buffer.alloc(6 + 16 * sizes.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(sizes.length, 4)
  let offset = header.length
  sizes.forEach((s, i) => {
    const e = 6 + i * 16
    header.writeUInt8(s, e)
    header.writeUInt8(s, e + 1)
    header.writeUInt16LE(1, e + 4) // colour planes
    header.writeUInt16LE(32, e + 6) // bits per pixel
    header.writeUInt32LE(images[i].length, e + 8)
    header.writeUInt32LE(offset, e + 12)
    offset += images[i].length
  })
  await fs.writeFile(path.join(pub, 'favicon.ico'), Buffer.concat([header, ...images]))
}

/* ── og-image.png: what people see when the link is shared on WhatsApp, LinkedIn, X … ── */
{
  const W = 1200
  const H = 630
  const lockH = 104
  const lockW = (lockH * MARK_W) / MARK_H
  const wordH = 40
  const bigH = 480

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#081735" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
    <radialGradient id="fade" cx="0.72" cy="0.3" r="0.75">
      <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="gridMask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
    <radialGradient id="glowR" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#0077fc" stop-opacity="0.18"/><stop offset="0.55" stop-color="#0077fc" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#0077fc" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowL" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#b0833f" stop-opacity="0.14"/><stop offset="1" stop-color="#b0833f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hl" x1="96" y1="0" x2="720" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#03204f"/><stop offset="0.45" stop-color="#0077fc"/><stop offset="1" stop-color="#3d9bff"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0077fc"/><stop offset="1" stop-color="#a9d2ff"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" mask="url(#gridMask)"/>
  <circle cx="-40" cy="470" r="380" fill="url(#glowL)"/>
  <circle cx="1000" cy="300" r="440" fill="url(#glowR)"/>

  ${mark({ x: 812, y: (H - bigH) / 2, height: bigH, tone: 'light' })}

  <g>
    ${mark({ x: 96, y: 82, height: lockH, tone: 'light' })}
    ${wordmark({ x: 96 + lockW + 26, y: 82 + (lockH - wordH) / 2, height: wordH, fill: '#03204f' })}
  </g>

  <text x="96" y="318" font-family="${FONT}" font-weight="600" font-size="62" letter-spacing="-2" fill="#081735">Engineering the</text>
  <text x="96" y="394" xml:space="preserve" font-family="${FONT}" font-weight="600" font-size="62" letter-spacing="-2" fill="url(#hl)">digital future<tspan fill="#081735"> from Dubai.</tspan></text>

  <rect x="96" y="452" width="56" height="4" rx="2" fill="url(#bar)"/>
  <text x="96" y="504" font-family="${FONT}" font-weight="600" font-size="25" fill="#0077fc">Software · Web Apps · Websites · Games</text>
  <text x="96" y="544" font-family="${FONT}" font-weight="600" font-size="25" fill="#5a6985">IT Support · Infrastructure · Cyber Security · Marketing</text>
</svg>`

  await png(svg, 'og-image.png')
}

/* ── brand/: clean vector logos to reuse in documents, email signatures, social profiles ── */
{
  const dir = path.join(pub, 'brand')
  await fs.mkdir(dir, { recursive: true })
  const gap = 150
  const wordH = 223
  const markH = 440
  const markW = (markH * MARK_W) / MARK_H
  const lockW = Math.ceil(markW + gap + WORD_W)
  const lockup = (tone, text) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockW} ${markH}">
  ${mark({ x: 0, y: 0, height: markH, tone })}
  ${wordmark({ x: markW + gap, y: (markH - wordH) / 2, height: wordH, fill: text })}
</svg>
`
  await fs.writeFile(path.join(dir, 'hizarc-logo.svg'), lockup('light', '#03204f'))
  await fs.writeFile(path.join(dir, 'hizarc-logo-white.svg'), lockup('dark', '#ffffff'))
  await fs.writeFile(
    path.join(dir, 'hizarc-mark.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}">
  ${mark({ x: 0, y: 0, height: MARK_H, tone: 'light' })}
</svg>
`,
  )
}

/* ── PWA manifest (lets phones "Add to Home Screen" with the HIZARC icon) ── */
await fs.writeFile(
  path.join(pub, 'site.webmanifest'),
  `${JSON.stringify(
    {
      name: 'HIZARC — IT & Software Solutions',
      short_name: 'HIZARC',
      description: 'Dubai-based IT company: custom software, web apps, websites, games, IT support, infrastructure, cyber security and online marketing.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  )}\n`,
)

console.log('✓ icons, og-image and manifest written to public/')
