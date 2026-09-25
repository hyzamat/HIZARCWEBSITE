import { createContext, useContext, type ReactNode } from 'react'
import { motion, useTransform, type MotionValue, type Variants } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1] as const

/**
 * `useTransform` for scroll progress. Motion runs these as native scroll-driven animations,
 * where keyframes that don't reach 0 and 1 drift back to the element's base style outside
 * the range — so the range is padded out to 0–1 to hold the first/last values.
 */
export function useScrollRange(progress: MotionValue<number>, input: number[], output: number[]): MotionValue<number>
export function useScrollRange(progress: MotionValue<number>, input: number[], output: string[]): MotionValue<string>
export function useScrollRange(progress: MotionValue<number>, input: number[], output: (number | string)[]): MotionValue<any> {
  const i = [...input]
  const o = [...output]
  if (i[0] > 0) {
    i.unshift(0)
    o.unshift(o[0])
  }
  if (i[i.length - 1] < 1) {
    i.push(1)
    o.push(o[o.length - 1])
  }
  return useTransform(progress, i, o)
}

type Track = { x?: number[]; y?: number[]; s?: number[]; r?: number[]; o?: number[] }

/**
 * Moves an illustration piece through keyframes tied to scroll progress.
 * `at` are progress stops; x / y are in cqw (1% of the scene width), s = scale, r = degrees, o = opacity.
 */
export function useMove(progress: MotionValue<number>, at: number[], track: Track) {
  const fill = (v: number) => at.map(() => v)
  const x = useScrollRange(progress, at, track.x ?? fill(0))
  const y = useScrollRange(progress, at, track.y ?? fill(0))
  const s = useScrollRange(progress, at, track.s ?? fill(1))
  const r = useScrollRange(progress, at, track.r ?? fill(0))
  const opacity = useScrollRange(progress, at, track.o ?? fill(1))
  const transform = useTransform(
    () => `translate3d(${x.get()}cqw, ${y.get()}cqw, 0) scale(${s.get()}) rotate(${r.get()}deg)`,
  )
  return { opacity, transform }
}

/** true once the intro has finished — hero animations wait for it. */
export const IntroContext = createContext(false)
export const useIntroDone = () => useContext(IntroContext)

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

/** Staggers its `motion` children that use `itemVariants`. */
export function Stagger({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' }) {
  const Comp = as === 'ul' ? motion.ul : motion.div
  return (
    <Comp className={className} variants={listVariants} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </Comp>
  )
}

/** Headline that rises in word by word from behind a mask. */
export function SplitWords({
  text,
  highlight = '',
  className = '',
  play,
  delay = 0,
}: {
  text: string
  highlight?: string
  className?: string
  /** Controlled mode (e.g. hero). When omitted, plays on scroll into view. */
  play?: boolean
  delay?: number
}) {
  const hl = new Set(highlight.split(' ').filter(Boolean))
  const words = text.split(' ')
  const controlled = play !== undefined

  return (
    <motion.span
      // a new language re-plays the rise-in with the new words
      key={text}
      className={className}
      initial="hidden"
      {...(controlled ? { animate: play ? 'show' : 'hidden' } : { whileInView: 'show', viewport: VIEWPORT })}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${hl.has(word) ? 'text-gradient' : ''}`}
            variants={{
              hidden: { y: '110%', rotate: 4 },
              show: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  )
}

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  highlight,
  description,
  className = '',
  center = false,
  tone = 'light',
}: {
  id?: string
  index: string
  eyebrow: string
  title: string
  highlight?: string
  description?: string
  className?: string
  center?: boolean
  /** `navy` for headings on the dark-blue section */
  tone?: 'light' | 'navy'
}) {
  const navy = tone === 'navy'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Reveal>
        <p
          className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${navy ? 'text-[#6cc2ff]' : 'text-brand'} ${center ? 'justify-center' : ''}`}
        >
          <span className={`font-display ${navy ? 'text-white/50' : 'text-ink/50'}`}>{index}</span>
          <span className={`h-px w-8 ${navy ? 'bg-white/30' : 'bg-brand/40'}`} />
          {eyebrow}
        </p>
      </Reveal>
      <h2
        id={id}
        className={`mt-5 text-[2rem] font-semibold leading-[1.08] tracking-tight xs:text-[2.25rem] sm:text-5xl lg:text-6xl ${navy ? 'text-white' : 'text-ink'}`}
      >
        <SplitWords text={title} highlight={highlight} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p
            className={`mt-5 text-base leading-relaxed sm:text-lg ${navy ? 'text-white/70' : 'text-muted'} ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
