import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { mailLink, site, telLink, whatsappLink } from '../../config/site'
import { WhatsAppIcon } from '../ui/icons'
import { itemVariants, Reveal, SectionHeading, Stagger } from '../ui/motion'
import { ContactForm } from './ContactForm'
import { useI18n, useOffice } from '../../i18n'

/** `ltr`: numbers and emails keep their left-to-right order on the Arabic page */
type DetailLink = { text: string; href: string; tag?: string; tagLang?: string; external?: boolean; ltr?: boolean }
type Detail = { label: string; icon: ReactNode; links: DetailLink[] }

/** Dark-blue enquiry section: a short intro + contact details beside a compact form. */
export function Contact() {
  const { t } = useI18n()
  const office = useOffice()

  const details: Detail[] = [
    {
      label: t.contact.call,
      icon: <Phone className="size-5" />,
      links: site.contact.phones.map((p) => ({ text: p.number, href: telLink(p.number), tag: p.label, tagLang: p.lang, ltr: true })),
    },
    {
      label: t.contact.email,
      icon: <Mail className="size-5" />,
      links: site.contact.emails.map((e) => ({ text: e, href: mailLink(e), ltr: true })),
    },
    {
      label: t.contact.whatsapp,
      icon: <WhatsAppIcon className="size-5" />,
      links: [{ text: t.contact.whatsappText, href: whatsappLink(t.common.waHello), external: true }],
    },
    {
      label: t.contact.office,
      icon: <MapPin className="size-5" />,
      links: [{ text: office.address, href: site.contact.mapUrl, external: true }],
    },
  ]

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-navy relative isolate overflow-clip bg-gradient-to-b from-navy to-[#021638] py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_70%_20%,black,transparent)]" />
        <div className="absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(0_119_252/0.35),transparent)]" />
        <div className="absolute -bottom-48 -left-40 size-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(34_184_255/0.14),transparent)]" />
      </div>

      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            tone="navy"
            id="contact-title"
            index="06"
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            highlight={t.contact.highlight}
            description={t.contact.description}
          />

          <Stagger as="ul" className="mt-8 grid gap-4 sm:mt-10">
            {details.map((d, i) => (
              <motion.li key={i} variants={itemVariants} className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-[#4db0ff] ring-1 ring-white/10">
                  {d.icon}
                </span>
                <div className="min-w-0">
                  <span className="sr-only">{d.label}: </span>
                  {d.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex flex-wrap items-center gap-x-2.5 py-0.5 text-[15px] font-semibold leading-snug text-white/85 transition-colors [overflow-wrap:anywhere] hover:text-white sm:text-base"
                    >
                      <span dir={l.ltr ? 'ltr' : undefined}>{l.text}</span>
                      {l.tag && (
                        <span lang={l.tagLang} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/70">
                          {l.tag}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </motion.li>
            ))}
          </Stagger>
        </div>

        <Reveal y={30}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
