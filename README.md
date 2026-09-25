# HIZARC — company website

Light, animated, mobile-first one-page site for HIZARC (Dubai IT company), built around a scroll-driven story:
a Dubai business facing challenges → meets HIZARC → we build their web application → a delighted client.
React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Motion (Framer Motion) · Lenis smooth scroll.
The production build is **pre-rendered to static HTML**, so phones show the full page on first load and Google can read every word.

---

## Quick start

**Easiest:** double-click **`run-website.bat`** — it installs everything on first run, starts the site and opens it in your browser. Keep the window open while you use the site; close it to stop.

Or from a terminal:

```bash
npm install
npm run dev        # http://localhost:5173 — also prints a Network URL to open on your phone (same Wi-Fi)
npm run build      # type-check → build → pre-render → dist/
npm run preview    # serve dist/ locally to check the real production site
```

## Change your details — `src/config/site.ts`

Everything you'll normally edit lives in **one file**:

| Setting | What it does |
| --- | --- |
| `url` | Your live domain (used for Google & social-share tags, sitemap) |
| `contact.emails` | Shown on the site; website enquiries are addressed to all of them |
| `contact.phones` | Each number with its language label (English / العربية) — shown in the contact section, footer, phone menu and the call picker |
| `contact.whatsapp / address / hours / mapUrl` | WhatsApp buttons, office address, hours and map link |
| `contact.addressAr / hoursAr` | The same address and hours, shown on the Arabic version |
| `googleFormUrl` | Where enquiries go — see below |
| `social.linkedin / instagram / x / facebook` | Leave `''` to hide an icon |

> WhatsApp buttons open a chat with the English line (+971 52 137 4423). Change `whatsapp` to use another number.

## English ⇄ Arabic — `src/i18n/`

The **EN | عربي** switch in the top bar flips the whole site to Arabic instantly (right-to-left layout, Arabic lettering), without reloading. The site remembers each visitor's choice, and you can share a link that opens straight in Arabic: `https://hizarc.com/?lang=ar`.

| File | What's in it |
| --- | --- |
| `en.ts` | Every word on the site in English — headlines, services, FAQs, form messages, the words inside the illustrations |
| `ar.ts` | The same text in Arabic, in exactly the same order |

To change a sentence, edit it in **both** files. If a line is missing from `ar.ts`, `npm run build` stops and tells you which one.
The order and icons of services, reasons and industries, and the big numbers, are in `src/data/content.ts`.

## The scroll story — `src/components/story/`

The "How we work" section is one illustration that plays as visitors scroll (forwards and backwards), with the words for each chapter fading in beside it. It is drawn in code (no video), so it stays sharp and light on phones.

| File | What's in it |
| --- | --- |
| `Story.tsx` | The chapter layout, the step bar, and `ACTS` — where each chapter starts/ends in the scroll (the words are in `src/i18n/`) |
| `Scene.tsx` | The choreography: when each piece enters, moves and leaves (numbers are scroll progress 0 → 1) |
| `parts.tsx` | The artwork pieces — spreadsheet, alerts, chat bubbles, toasts, chips |
| `Avatars.tsx` | The client (face goes from stressed to delighted) and the HIZARC consultant |

To make the story longer or shorter to scroll through, change `h-[560vh]` (phones) / `lg:h-[620vh]` (desktop) in `Story.tsx`.

---

## Connecting the "Reach out" form to Google Forms

Until `googleFormUrl` is filled in, the form opens the visitor's email app with their enquiry addressed to every address in `contact.emails`.

### Option A — quick (Google's own form shown on the site)

1. Open your Google Form → **Send** → link icon → copy the link.
2. Paste it into `googleFormUrl`. The site embeds your form inside the Contact section.

### Option B — recommended (HIZARC-branded form, answers land in Google Forms / Sheets)

Visitors keep using the animated HIZARC form; every answer is delivered into your Google Form.

1. Create a Google Form with these questions. Use **Short answer** (or **Paragraph** for the message), not multiple choice:
   Name · Email · Contact number · Message
2. In the form's **Settings**:
   - **Collect email addresses** → *Do not collect*
   - **Restrict to users in your organisation** → *off*, and no sign-in required
3. Click **⋮ (More)** → **Get pre-filled link**.
4. Type these exact words into the matching questions:
   `name`, `email`, `phone`, `message`
5. Click **Get link** → **Copy link**, and paste it into `googleFormUrl`.
6. Rebuild, then **send one test enquiry** and check it appears under **Responses** (tip: *Link to Sheets* for a live spreadsheet, and turn on email notifications for new responses).

If you skip the Contact number question, the number is added to the end of the message, so nothing gets lost.

---

## Deploying

`npm run build` produces a fully static site in `dist/`. Upload it to any static host, for example:

- **Netlify / Cloudflare Pages / Vercel** — build command `npm run build`, output folder `dist`
- **Any cPanel / shared hosting** — upload the contents of `dist/` to `public_html`

After going live, submit `https://your-domain/sitemap.xml` in Google Search Console, and create a Google Business Profile for local "IT company Dubai" searches.

## Logo & icons

- `public/brand/` — vector logos to reuse anywhere: `hizarc-logo.svg` (light backgrounds), `hizarc-logo-white.svg` (dark), `hizarc-mark.svg`
- Favicons, app icons and the social-share image (`og-image.png`) are generated from the vector logo:

```bash
npm run icons
```

## Project layout

```
src/
  config/site.ts          ← your details & Google Form link
  i18n/en.ts, ar.ts       ← all page text, English & Arabic
  data/content.ts         ← order & icons of services, reasons, industries
  App.tsx                 ← page sections in order
  components/
    Preloader, Navbar, Dock (mobile action bar), Footer
    hero/                 ← headline, 3D logo, interactive network background
    story/                ← the scroll-driven "How we work" story
    sections/             ← About, Services, WhyUs, Dubai, FAQ, Contact (+ ContactForm)
    brand/                ← logo geometry & components
  lib/googleForm.ts       ← Google Form connection
scripts/
  prerender.mjs           ← static HTML + robots.txt + sitemap.xml + schema.org data
  generate-icons.mjs      ← favicons, app icons, og-image, brand SVGs
```
