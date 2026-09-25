import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MARK_COLORS, MARK_PANELS, MARK_VIEWBOX, WORDMARK_PATH, WORDMARK_VIEWBOX } from './brand/Logo'
import { EASE } from './ui/motion'
import { lockScroll } from '../lib/scroll'

const c = MARK_COLORS.light
const INTRO_MS = 1750

/** Brand intro: the four panels of the H assemble, then the curtain lifts. Plays once per session. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    let seen = false
    try {
      seen = !!sessionStorage.getItem('hz-intro')
    } catch {
      /* private mode */
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || reduce) {
      setShow(false)
      onDone()
      return
    }

    lockScroll(true)
    const t1 = window.setTimeout(() => {
      setShow(false)
      lockScroll(false)
      try {
        sessionStorage.setItem('hz-intro', '1')
      } catch {
        /* ignore */
      }
    }, INTRO_MS)
    const t2 = window.setTimeout(onDone, INTRO_MS + 250)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      lockScroll(false)
    }
  }, [onDone])

  const panel = (delay: number, from: Record<string, number | string>) => ({
    initial: { opacity: 0, ...from },
    animate: { opacity: 1, x: 0, y: 0, scaleX: 1 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[100] grid place-items-center bg-canvas"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(0_119_252/0.12),transparent_55%)]" />
          <div className="relative flex flex-col items-center gap-7">
            <svg viewBox={MARK_VIEWBOX} className="h-24 w-auto overflow-visible sm:h-28">
              <motion.polygon points={MARK_PANELS.pillar} fill={c.pillar} {...panel(0, { y: 90 })} />
              <motion.polygon points={MARK_PANELS.right} fill={c.right} {...panel(0.12, { y: -90 })} />
              <motion.polygon
                points={MARK_PANELS.bar}
                fill={c.bar}
                style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}
                {...panel(0.42, { scaleX: 0 })}
              />
              <motion.polygon points={MARK_PANELS.fold} fill={c.fold} {...panel(0.7, { x: -30 })} />
            </svg>
            <motion.svg
              viewBox={WORDMARK_VIEWBOX}
              className="h-5 w-auto text-navy sm:h-6"
              initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            >
              <path d={WORDMARK_PATH} fill="currentColor" />
            </motion.svg>
            <div className="h-px w-40 overflow-hidden bg-ink/10">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-navy to-brand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: INTRO_MS / 1000 - 0.2, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
