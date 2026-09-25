import type Lenis from 'lenis'

let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

/**
 * Smoothly scroll to a `#section` (works even while the mobile menu has scrolling locked).
 * The gap left for the fixed navbar comes from `scroll-padding-top` in index.css — Lenis,
 * `scrollIntoView` and direct #links all respect it.
 */
export function scrollToHash(hash: string) {
  if (hash === '#top' || hash === '#') {
    if (lenis) {
      lenis.start()
      lenis.scrollTo(0, { force: true, duration: 1.4 })
    } else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.querySelector<HTMLElement>(hash)
  if (!el) return
  if (lenis) {
    lenis.start()
    lenis.scrollTo(el, { force: true, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  history.replaceState(null, '', hash)
}

/** Smoothly scroll to an exact page position. */
export function scrollToY(top: number) {
  if (lenis) {
    lenis.start()
    lenis.scrollTo(top, { force: true, duration: 1.2 })
  } else {
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export function lockScroll(locked: boolean) {
  if (locked) {
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = ''
    lenis?.start()
  }
}
