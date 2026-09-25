import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { NetworkCanvas } from './NetworkCanvas'
import { HeroMark } from './HeroMark'
import { Button } from '../ui/Button'
import { EASE, SplitWords, useIntroDone, useScrollRange } from '../ui/motion'
import { UAEFlag } from '../ui/icons'
import { useI18n } from '../../i18n'

export function Hero() {
  const play = useIntroDone()
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useScrollRange(scrollYProgress, [0, 0.65], [1, 0])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease: EASE },
  })

  return (
    <section
      id="top"
      ref={ref}
      aria-label={t.hero.label}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-14 pt-28 sm:pb-20 sm:pt-32"
    >
      {/* background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_90%_60%_at_65%_25%,black,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky/60 via-white to-white" />
        <div className="absolute -left-48 top-1/3 size-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(176_131_63/0.12),transparent)]" />
        <div className="absolute -right-32 -top-40 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(0_119_252/0.16),transparent)]" />
        <NetworkCanvas className="absolute inset-0 size-full" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10">
          <motion.p
            {...fadeUp(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/80 py-1.5 pe-4 ps-2 text-xs font-semibold text-ink/75 shadow-soft backdrop-blur sm:text-[13px]"
          >
            <UAEFlag className="h-3 w-6 rounded-[3px]" />
            {t.hero.place}
            <span className="h-3 w-px bg-ink/15" />
            <span className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-brand" />
              {t.hero.kind}
            </span>
          </motion.p>

          <h1 className="mt-6 text-[clamp(2.35rem,10.5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:mt-8 sm:text-7xl lg:text-[4.6rem] xl:text-[5.4rem]">
            <SplitWords text={t.hero.title} highlight={t.hero.highlight} play={play} delay={0.1} />
          </h1>

          <motion.p {...fadeUp(0.45)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:mt-7 sm:text-lg">
            {t.hero.lead}
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
            <Button href="#contact" className="sm:flex-none">
              {t.hero.cta}
            </Button>
            <Button href="#story" variant="ghost" icon={<ArrowDown className="size-4" />}>
              {t.hero.how}
            </Button>
          </motion.div>

          <motion.dl {...fadeUp(0.75)} className="mt-10 grid max-w-md grid-cols-3 divide-x divide-line sm:mt-14">
            {t.hero.highlights.map((h) => (
              <div key={h.value} className="px-3 first:ps-0 sm:px-5">
                <dt className="sr-only">{h.label}</dt>
                <dd className="font-display text-lg font-semibold text-ink sm:text-2xl">{h.value}</dd>
                <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60 sm:text-xs">{h.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* On phones the mark floats behind the copy; on desktop it gets its own column */}
        <div className="pointer-events-none absolute end-[-26%] top-[9%] w-[78vw] max-w-[420px] opacity-[0.13] sm:end-[-8%] sm:w-[52vw] sm:opacity-30 lg:pointer-events-auto lg:relative lg:end-auto lg:top-auto lg:w-full lg:max-w-[440px] lg:justify-self-end lg:opacity-100">
          <HeroMark play={play} spread={scrollYProgress} />
        </div>
      </div>

      <motion.a
        href="#story"
        aria-label={t.hero.scrollLabel}
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/55 md:flex"
      >
        {t.hero.scroll}
        <span className="relative h-10 w-px overflow-hidden bg-ink/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-brand"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}
