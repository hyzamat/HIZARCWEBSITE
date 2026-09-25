import { useRef } from 'react'
import { motion, useScroll, type MotionValue } from 'motion/react'
import { Reveal, useScrollRange } from '../ui/motion'
import { useI18n } from '../../i18n'

function Word({ word, strong, range, progress }: { word: string; strong: boolean; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useScrollRange(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className={strong ? 'text-brand' : undefined}>
      {word}{' '}
    </motion.span>
  )
}

/** Manifesto that lights up word by word as you scroll. */
export function About() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const { t } = useI18n()
  const words = t.about.statement.split(' ')
  const emphasis = new Set(t.about.emphasis)

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <Reveal>
          <p
            id="about-title"
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand"
          >
            <span className="font-display text-ink/60">01</span>
            <span className="h-px w-8 bg-brand-2/50" />
            {t.about.eyebrow}
          </p>
        </Reveal>
        <p
          ref={ref}
          className="mt-8 max-w-5xl font-display text-[1.65rem] font-medium leading-[1.25] tracking-tight xs:text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.18]"
        >
          {words.map((w, i) => (
            <Word key={i} word={w} strong={emphasis.has(w)} range={[i / words.length, (i + 1) / words.length]} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  )
}
