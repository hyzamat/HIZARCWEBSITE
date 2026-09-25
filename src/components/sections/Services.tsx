import { useRef } from 'react'
import { motion, useScroll, type MotionValue } from 'motion/react'
import { ArrowUpRight, Check } from 'lucide-react'
import { services } from '../../data/content'
import { useI18n } from '../../i18n'
import { SectionHeading, useScrollRange } from '../ui/motion'
import { SERVICE_TINTS, ServiceVisual } from './ServiceVisuals'

export const SERVICE_EVENT = 'hz:select-service'

export function Services() {
  const deck = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: deck, offset: ['start start', 'end end'] })
  const { t } = useI18n()

  return (
    <section id="services" aria-labelledby="services-title" className="relative pb-20 sm:pb-28">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          index="02"
          eyebrow={t.services.eyebrow}
          title={t.services.title}
          highlight={t.services.highlight}
          description={t.services.description}
        />

        <div ref={deck} className="relative mt-12 sm:mt-16">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} total={services.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  total,
  progress,
}: {
  service: (typeof services)[number]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const isLast = index === total - 1
  const scale = useScrollRange(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.03])
  // offsets must stay within 0–1 (the last card would otherwise end past 1)
  const dim = useScrollRange(
    progress,
    [Math.min((index + 0.4) / total, 0.99), Math.min((index + 1.2) / total, 1)],
    [0, isLast ? 0 : 0.6],
  )
  const Icon = service.icon
  const { t } = useI18n()
  const text = t.services.items[service.id]
  const tint = SERVICE_TINTS[service.id] ?? SERVICE_TINTS['web-apps']
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      className="stack-card top-[calc(4.75rem+var(--i)*10px)] mb-5 last:mb-0 sm:top-[calc(6.5rem+var(--i)*16px)] sm:mb-8"
      style={{ '--i': index } as React.CSSProperties}
    >
      <motion.article
        style={{ scale, background: `linear-gradient(135deg, #ffffff 30%, ${tint.from} 70%, ${tint.to} 130%)` }}
        className="group relative origin-top overflow-hidden rounded-[1.75rem] border border-line p-3 shadow-[0_-18px_50px_-24px_rgb(8_23_53/0.22)] sm:rounded-[2rem] sm:p-5 lg:p-6"
        aria-labelledby={`svc-${service.id}`}
      >
        <div className="relative grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center md:gap-8 lg:gap-12">
          {/* the picture — first on phones, on the right from tablet up */}
          <div className="md:order-2">
            <ServiceVisual id={service.id} />
          </div>

          <div className="flex flex-col px-2 pb-3 sm:px-3 md:order-1 md:py-4 lg:ps-6">
            <div className="flex items-center justify-between">
              <span
                className="hidden size-12 place-items-center rounded-2xl text-white shadow-soft md:grid"
                style={{ background: `linear-gradient(135deg, ${tint.accent}, #03204f)` }}
              >
                <Icon className="size-6" strokeWidth={1.7} />
              </span>
              <span className="font-display text-xs font-medium tracking-wider text-ink/60 md:text-sm">
                {num} <span className="text-ink/35">/ {String(total).padStart(2, '0')}</span>
              </span>
            </div>
            <h3 id={`svc-${service.id}`} className="mt-1.5 text-[1.6rem] font-semibold leading-tight tracking-tight sm:text-4xl md:mt-5 lg:text-[2.6rem]">
              {text.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted sm:mt-4 sm:text-lg">{text.description}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
              {text.capabilities.map((cap) => (
                <li
                  key={cap}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-2.5 py-1 text-[12.5px] text-ink/75 sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  <Check className="size-3.5 shrink-0" style={{ color: tint.accent }} strokeWidth={2.5} />
                  {cap}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => window.dispatchEvent(new CustomEvent(SERVICE_EVENT, { detail: text.title }))}
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full py-1 text-sm font-semibold text-brand transition-colors hover:text-navy sm:mt-6"
            >
              {t.services.discuss(text.short)}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </a>
          </div>
        </div>

        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-mist" />
      </motion.article>
    </div>
  )
}
