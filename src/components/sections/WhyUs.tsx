import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'motion/react'
import { industries, reasons, stats } from '../../data/content'
import { EASE, itemVariants, Reveal, SectionHeading, Stagger } from '../ui/motion'
import { SpotlightCard } from '../ui/SpotlightCard'
import { useI18n } from '../../i18n'

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{to}</span>
}

function Reasons() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { t } = useI18n()

  const onScroll = () => {
    const el = scroller.current
    const card = el?.querySelector<HTMLElement>('[data-card]')
    if (!el || !card) return
    const step = card.offsetWidth + 12
    // scrollLeft counts down from 0 on right-to-left pages
    setActive(Math.min(reasons.length - 1, Math.round(Math.abs(el.scrollLeft) / step)))
  }

  const goTo = (i: number) => {
    const card = scroller.current?.querySelectorAll<HTMLElement>('[data-card]')[i]
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <div className="mt-3 sm:mt-4">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="-mx-5 snap-x snap-mandatory scroll-px-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 md:mx-0 md:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <Stagger className="flex w-max gap-3 px-5 sm:px-8 md:grid md:w-auto md:grid-cols-2 md:gap-4 md:px-0 lg:grid-cols-4">
          {reasons.map((r) => {
            const Icon = r.icon
            const text = t.why.reasons[r.id]
            return (
              <motion.div
                key={r.id}
                data-card
                variants={itemVariants}
                className="w-[78vw] max-w-[330px] shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <SpotlightCard className="h-full p-6 sm:p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-sky text-brand">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink sm:text-xl">{text.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{text.text}</p>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </Stagger>
      </div>

      <div className="mt-5 flex items-center justify-center gap-1 md:hidden">
        {reasons.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={t.why.show(t.why.reasons[r.id].title)}
            aria-current={active === i}
            className="grid h-8 place-items-center px-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ease-out-expo ${
                active === i ? 'w-6 bg-brand' : 'w-1.5 bg-ink/20'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function WhyUs() {
  const { t } = useI18n()
  return (
    <section id="why" aria-labelledby="why-title" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-20 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(0_119_252/0.08),transparent)]" />

      <div className="container-x relative">
        <SectionHeading
          id="why-title"
          index="03"
          eyebrow={t.why.eyebrow}
          title={t.why.title}
          highlight={t.why.highlight}
          description={t.why.description}
        />

        {/* commitments */}
        <Stagger className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const text = t.why.stats[i]
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7"
              >
                <div className="pointer-events-none absolute -end-10 -top-10 size-32 rounded-full bg-[radial-gradient(closest-side,rgb(0_119_252/0.12),transparent)]" />
                {/* numbers always read left → right, e.g. "<1hr" */}
                <p dir="ltr" className="font-display text-[2.5rem] font-semibold leading-none tracking-tight text-ink sm:text-6xl rtl:text-right">
                  <span className="text-ink/55">{text.prefix}</span>
                  <CountUp to={s.value} />
                  <span className="text-brand">{text.suffix}</span>
                </p>
                <p className="mt-3 text-[13px] leading-snug text-muted sm:text-[15px]">{text.label}</p>
              </motion.div>
            )
          })}
        </Stagger>

        {/* reasons — a swipeable carousel on phones, a grid from tablet up */}
        <Reasons />

        {/* industries */}
        <div className="mt-20 sm:mt-28">
          <Reveal>
            <h3 className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">
              {t.why.industriesTitle}
            </h3>
          </Reveal>
          <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {industries.map((ind) => {
              const Icon = ind.icon
              return (
                <motion.li
                  key={ind.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-4 shadow-soft transition-colors hover:border-sky-2 hover:bg-sky/50 sm:px-5 sm:py-5"
                >
                  <Icon className="size-5 shrink-0 text-brand transition-transform duration-500 group-hover:scale-110" strokeWidth={1.6} />
                  <span className="text-[13px] font-medium leading-tight text-ink/85 sm:text-[15px]">{t.why.industries[ind.id]}</span>
                </motion.li>
              )
            })}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
