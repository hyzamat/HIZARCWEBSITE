import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Phone } from 'lucide-react'
import { WhatsAppIcon } from './ui/icons'
import { EASE } from './ui/motion'
import { site, telLink, whatsappLink } from '../config/site'
import { useI18n } from '../i18n'

/**
 * Mobile: a thumb-reachable action bar (quote · WhatsApp · call) once you scroll past the hero.
 * Desktop: a floating WhatsApp button. Both step aside during the story (it has its own call to action)
 * and when the contact form is on screen.
 */
export function Dock() {
  const { scrollY } = useScroll()
  const [pastHero, setPastHero] = useState(false)
  const [covered, setCovered] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  useMotionValueEvent(scrollY, 'change', (y) => setPastHero(y > window.innerHeight * 0.75))

  useEffect(() => {
    const targets = ['story', 'contact', 'site-footer'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const visible = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)
        setCovered(visible.size > 0)
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const show = pastHero && !covered

  // the number picker closes when the bar hides or on a tap anywhere else
  useEffect(() => {
    if (!show) setCallOpen(false)
  }, [show])
  useEffect(() => {
    if (!callOpen) return
    const close = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setCallOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [callOpen])

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="dock"
            initial={{ y: '120%' }}
            animate={{ y: '0%' }}
            exit={{ y: '120%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-30 px-3 pb-safe lg:hidden"
          >
            <div ref={bar} className="glass relative mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-line p-2 shadow-lift">
              <AnimatePresence>
                {callOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute bottom-full end-0 mb-2 w-64 origin-bottom-right rounded-2xl rtl:origin-bottom-left border border-line bg-white p-2 shadow-lift"
                  >
                    <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">{t.dock.callUs}</p>
                    {site.contact.phones.map((p) => (
                      <a
                        key={p.number}
                        href={telLink(p.number)}
                        onClick={() => setCallOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 active:bg-mist"
                      >
                        <span className="flex items-center gap-2.5 font-semibold text-ink">
                          <Phone className="size-4 text-brand" />
                          <span dir="ltr">{p.number}</span>
                        </span>
                        <span lang={p.lang} className="rounded-full bg-sky px-2 py-0.5 text-[11px] font-semibold text-brand">
                          {p.label}
                        </span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <a
                href="#contact"
                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-brand text-[15px] font-semibold text-white shadow-brand active:scale-[0.98]"
              >
                {t.dock.quote}
              </a>
              <a
                href={whatsappLink(t.common.waHello)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.dock.whatsapp}
                className="grid size-12 place-items-center rounded-xl bg-[#25D366]/15 text-[#1da851] active:bg-[#25D366]/25"
              >
                <WhatsAppIcon className="size-6" />
              </a>
              <button
                type="button"
                onClick={() => setCallOpen((o) => !o)}
                aria-label={t.dock.call}
                aria-expanded={callOpen}
                className={`grid size-12 place-items-center rounded-xl text-brand transition-colors ${callOpen ? 'bg-sky-2' : 'bg-sky active:bg-sky-2'}`}
              >
                <Phone className="size-5" />
              </button>
            </div>
          </motion.div>

          <motion.a
            key="wa-desktop"
            href={whatsappLink(t.common.waHello)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.dock.whatsappDesktop}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="group fixed bottom-6 right-6 z-30 hidden size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.6)] lg:grid"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
            <WhatsAppIcon className="relative size-7" />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
              {t.dock.chat}
            </span>
          </motion.a>
        </>
      )}
    </AnimatePresence>
  )
}
