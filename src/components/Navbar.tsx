import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Mail, Phone } from 'lucide-react'
import { Logo } from './brand/Logo'
import { LangToggle } from './LangToggle'
import { Button } from './ui/Button'
import { EASE } from './ui/motion'
import { WhatsAppIcon } from './ui/icons'
import { navLinks } from '../data/content'
import { emailLink, site, telLink, whatsappLink } from '../config/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { useI18n, useOffice } from '../i18n'
import { lockScroll } from '../lib/scroll'

const sectionIds = navLinks.map((l) => l.href.slice(1))

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  const { t } = useI18n()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > prev && y > 480)
  })

  const wasOpen = useRef(false)
  useEffect(() => {
    // only touch the scroll lock when the menu actually opens/closes (the intro also uses it)
    if (open !== wasOpen.current) lockScroll(open)
    wasOpen.current = open
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r rtl:origin-right rtl:bg-gradient-to-l from-brand via-brand-2 to-sky"
        style={{ scaleX: progress }}
      />

      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? '-120%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="container-x pt-3">
          <nav
            aria-label={t.nav.main}
            className={`flex h-14 items-center justify-between rounded-2xl border pe-2 ps-4 transition-[background-color,border-color,box-shadow] duration-500 sm:h-16 sm:ps-5 ${
              scrolled || open
                ? 'glass border-line shadow-soft'
                : 'border-transparent bg-transparent'
            }`}
          >
            <a href="#top" aria-label={t.common.logoHome} className="relative z-10 -ms-1 rounded-lg p-1">
              <Logo tone="light" className="text-[14px] sm:text-[15px]" />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(1)
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-ink/[0.06]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      {t.nav.links[link.id]}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2">
              <LangToggle />
              <span className="hidden sm:block">
                <Button href="#contact" size="md">
                  {t.common.reachOut}
                </Button>
              </span>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t.nav.close : t.nav.open}
                className="relative z-10 grid size-11 place-items-center rounded-xl bg-ink/[0.05] transition-colors active:bg-ink/10 lg:hidden"
              >
                <span className="relative block h-3.5 w-5">
                  <motion.span
                    className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-ink"
                    animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                  <motion.span
                    className="absolute left-0 top-[6px] h-[2px] w-3.5 rounded-full bg-ink"
                    animate={{ opacity: open ? 0 : 1, x: open ? 8 : 0 }}
                    transition={{ duration: 0.25 }}
                  />
                  <motion.span
                    className="absolute left-0 top-[12px] h-[2px] w-5 rounded-full bg-ink"
                    animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  )
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  const firstLink = useRef<HTMLAnchorElement>(null)
  const { t, dir } = useI18n()
  const office = useOffice()
  // the menu grows out of the menu button's corner
  const corner = dir === 'rtl' ? '0% 0%' : '100% 0%'

  useEffect(() => {
    if (open) window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 350)
  }, [open])

  const links = [
    ...navLinks.map((l) => ({ label: t.nav.links[l.id], href: l.href })),
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-canvas lg:hidden"
          initial={{ clipPath: `circle(0% at ${corner})` }}
          animate={{ clipPath: `circle(150% at ${corner})` }}
          exit={{ clipPath: `circle(0% at ${corner})` }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)] rtl:[mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
          <div className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(0_119_252/0.18),transparent)]" />

          <nav aria-label={t.nav.mobile} className="container-x relative flex flex-1 flex-col pb-safe pt-24">
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE }}
                  className="border-b border-line"
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center justify-between py-3.5 active:opacity-70"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-xs text-brand">0{i + 1}</span>
                      <span
                        className={`font-display text-[2rem] font-semibold tracking-tight xs:text-4xl ${
                          active === link.href.slice(1) ? 'text-gradient' : 'text-ink'
                        }`}
                      >
                        {link.label}
                      </span>
                    </span>
                    <span className="text-2xl text-ink/25 transition-transform group-active:translate-x-1 rtl:-scale-x-100 rtl:group-active:-translate-x-1">→</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
              className="mt-auto pt-8"
            >
              <Button href="#contact" onClick={onClose} className="w-full">
                {t.common.startProject}
              </Button>
              <div className="mt-4 grid grid-cols-4 gap-2">
                <QuickAction href={whatsappLink(t.common.waHello)} label={t.common.whatsapp} external>
                  <WhatsAppIcon className="size-5 text-[#25D366]" />
                </QuickAction>
                {site.contact.phones.map((p) => (
                  <QuickAction key={p.number} href={telLink(p.number)} label={p.label} lang={p.lang} aria={t.common.call(p.number)}>
                    <Phone className="size-5 text-brand" />
                  </QuickAction>
                ))}
                <QuickAction href={emailLink} label={t.common.email}>
                  <Mail className="size-5 text-brand" />
                </QuickAction>
              </div>
              <p className="mt-6 text-center text-xs text-ink/60">{office.address}</p>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function QuickAction({
  href,
  label,
  lang,
  aria,
  external,
  children,
}: {
  href: string
  label: string
  lang?: string
  aria?: string
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={aria}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-white py-3.5 text-[11px] font-semibold text-ink/80 shadow-soft active:bg-mist"
    >
      {children}
      <span lang={lang}>{label}</span>
    </a>
  )
}
