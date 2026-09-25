import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { Dock } from './components/Dock'
import { Footer } from './components/Footer'
import { Hero } from './components/hero/Hero'
import { Story } from './components/story/Story'
import { Marquee } from './components/sections/Marquee'
import { About } from './components/sections/About'
import { Services } from './components/sections/Services'
import { WhyUs } from './components/sections/WhyUs'
import { Dubai } from './components/sections/Dubai'
import { FAQ } from './components/sections/FAQ'
import { Contact } from './components/sections/Contact'
import { IntroContext } from './components/ui/motion'
import { LanguageProvider, useI18n } from './i18n'
import { scrollToHash, setLenis } from './lib/scroll'

/** Buttery scrolling with the mouse wheel; phones keep their native (momentum) scrolling. */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])
}

/** Every in-page link (#services, #contact …) glides to its section instead of jumping. */
function useAnchorLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]')
      const hash = link?.getAttribute('href')
      if (!hash) return
      e.preventDefault()
      scrollToHash(hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

function SkipLink() {
  const { t } = useI18n()
  return (
    <a
      href="#main"
      className="sr-only z-[110] rounded-full bg-white px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {t.common.skip}
    </a>
  )
}

export function App() {
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])

  useSmoothScroll()
  useAnchorLinks()

  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <IntroContext value={introDone}>
          <Preloader onDone={finishIntro} />
          <SkipLink />
          <Navbar />
          <main id="main">
            <Hero />
            <Story />
            <About />
            <Marquee />
            <Services />
            <WhyUs />
            <Dubai />
            <FAQ />
            <Contact />
          </main>
          <Footer />
          <Dock />
        </IntroContext>
      </MotionConfig>
    </LanguageProvider>
  )
}
