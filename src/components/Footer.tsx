import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { Logo, WORDMARK_PATH, WORDMARK_VIEWBOX } from './brand/Logo'
import { FacebookIcon, InstagramIcon, LinkedInIcon, UAEFlag, XIcon } from './ui/icons'
import { useScrollRange } from './ui/motion'
import { navLinks, services } from '../data/content'
import { mailLink, site, telLink, whatsappLink } from '../config/site'
import { useI18n, useOffice } from '../i18n'

const socials = [
  { label: 'LinkedIn', href: site.social.linkedin, Icon: LinkedInIcon },
  { label: 'Instagram', href: site.social.instagram, Icon: InstagramIcon },
  { label: 'X', href: site.social.x, Icon: XIcon },
  { label: 'Facebook', href: site.social.facebook, Icon: FacebookIcon },
].filter((s) => s.href)

const linkCls = 'text-[15px] text-ink/60 transition-colors hover:text-brand active:text-brand'

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">{title}</h2>
      <ul className="mt-5 grid gap-3">{children}</ul>
    </div>
  )
}

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const markY = useScrollRange(scrollYProgress, [0.35, 1], ['45%', '0%'])
  const markOpacity = useScrollRange(scrollYProgress, [0.35, 0.9], [0, 1])
  const year = new Date().getFullYear()
  const { t } = useI18n()
  const office = useOffice()

  return (
    <footer id="site-footer" ref={ref} className="relative overflow-hidden bg-mist">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgb(0_119_252/0.1),transparent)]" />

      {/* link columns */}
      <div className="container-x relative grid gap-12 pb-14 pt-16 sm:pb-16 sm:pt-20 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <a href="#top" aria-label={t.common.logoHome} className="inline-block rounded-lg">
            <Logo tone="light" className="text-[17px]" />
          </a>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/60">{t.footer.blurb}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.footer.social(label)}
                    className="grid size-11 place-items-center rounded-xl border border-line bg-white text-ink/70 transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
          <Column title={t.footer.services}>
            {services.map((s) => (
              <li key={s.id}>
                <a href="#services" className={linkCls}>
                  {t.services.items[s.id].short}
                </a>
              </li>
            ))}
          </Column>
          <Column title={t.footer.company}>
            {[
              { label: t.nav.about, href: '#about' },
              ...navLinks.map((l) => ({ label: t.nav.links[l.id], href: l.href })),
              { label: t.nav.contact, href: '#contact' },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkCls}>
                  {l.label}
                </a>
              </li>
            ))}
          </Column>
          <div className="col-span-2 sm:col-span-1">
            <Column title={t.footer.touch}>
              {site.contact.phones.map((p) => (
                <li key={p.number}>
                  <a href={telLink(p.number)} className={`${linkCls} inline-flex flex-wrap items-center gap-2`}>
                    <span dir="ltr">{p.number}</span>
                    <span lang={p.lang} className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-semibold text-ink/60">
                      {p.label}
                    </span>
                  </a>
                </li>
              ))}
              {site.contact.emails.map((e) => (
                <li key={e}>
                  <a href={mailLink(e)} className={`${linkCls} break-all`}>
                    {e}
                  </a>
                </li>
              ))}
              <li>
                <a href={whatsappLink(t.common.waHello)} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {t.common.whatsapp}
                </a>
              </li>
              <li className="text-[15px] leading-relaxed text-ink/60">{office.address}</li>
            </Column>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="container-x relative">
        <div className="flex flex-col gap-4 border-t border-line py-6 text-[13px] text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.rights(year, site.name)}</p>
          <div className="flex items-center justify-between gap-6">
            <p className="flex items-center gap-2">
              <UAEFlag className="h-2.5 w-5 rounded-[2px]" /> {t.footer.proudly}
            </p>
            <a
              href="#top"
              aria-label={t.common.backToTop}
              className="grid size-11 place-items-center rounded-full border border-line text-ink/70 transition-colors hover:border-sky-2 hover:text-brand"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* oversized wordmark rising from the bottom edge */}
      <motion.div
        aria-hidden="true"
        style={{ y: markY, opacity: markOpacity }}
        className="pointer-events-none relative -mb-[2%] select-none px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
      >
        <svg viewBox={WORDMARK_VIEWBOX} className="h-auto w-full">
          <defs>
            <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0077fc" stopOpacity="0.14" />
              <stop offset="1" stopColor="#03204f" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={WORDMARK_PATH} fill="url(#footer-wordmark)" />
        </svg>
      </motion.div>
    </footer>
  )
}
