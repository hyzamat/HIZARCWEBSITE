import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/sora'
import '@fontsource-variable/manrope'
// Arabic lettering — the browser only downloads it once Arabic text is on screen
import '@fontsource-variable/readex-pro/wght.css'
import 'lenis/dist/lenis.css'
import './index.css'
import { App } from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build ships the page pre-rendered (fast first paint + SEO); the dev server renders it fresh.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
