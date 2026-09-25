import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { useScrollRange } from '../ui/motion'
import { scrollToY } from '../../lib/scroll'
import { useI18n } from '../../i18n'
import { Scene } from './Scene'

/** Where each chapter starts / ends in the scroll (0 → 1). Keep in sync with Scene.tsx. Names are in the i18n files (story.acts). */
export const ACTS = [
  { from: 0, to: 0.2 },
  { from: 0.2, to: 0.42 },
  { from: 0.42, to: 0.68 },
  { from: 0.68, to: 0.84 },
  { from: 0.84, to: 1 },
]

const actAt = (v: number) => {
  const i = ACTS.findIndex((a) => v < a.to)
  return i === -1 ? ACTS.length - 1 : i
}

function Chapter({ p, index, children }: { p: MotionValue<number>; index: number; children: ReactNode }) {
  const { from, to } = ACTS[index]
  const first = index === 0
  const last = index === ACTS.length - 1
  const fade = 0.025
  const input = first ? [to - fade, to] : last ? [from, from + fade] : [from, from + fade, to - fade, to]
  const opacity = useScrollRange(p, input, first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0])
  const y = useScrollRange(p, input, first ? [0, -32] : last ? [32, 0] : [32, 0, 0, -32])
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? 'auto' : 'none'))
  const { t } = useI18n()

  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="[grid-area:1/1]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
        {String(index + 1).padStart(2, '0')} — {t.story.acts[index]}
      </p>
      {children}
    </motion.div>
  )
}

const title = 'mt-3 font-display text-[1.6rem] font-semibold leading-[1.1] tracking-tight text-ink xs:text-[1.75rem] sm:text-4xl lg:mt-4 lg:text-5xl'
const body = 'mt-3 max-w-lg text-[15px] leading-relaxed text-muted sm:text-lg lg:mt-5'

function Rail({ p, act, onJump }: { p: MotionValue<number>; act: number; onJump: (i: number) => void }) {
  const { t } = useI18n()
  return (
    <div>
      <div className="flex gap-1.5">
        {ACTS.map((_, i) => (
          <RailStep key={i} p={p} index={i} onJump={onJump} />
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between text-xs font-semibold text-muted">
        <span>
          {t.story.step(act + 1, ACTS.length)} · <span className="text-ink">{t.story.acts[act]}</span>
        </span>
        <a href="#about" className="flex items-center gap-1 rounded-full py-1 ps-2 text-muted transition-colors hover:text-brand">
          {t.story.skip} <ChevronDown className="size-3.5" />
        </a>
      </div>
    </div>
  )
}

function RailStep({ p, index, onJump }: { p: MotionValue<number>; index: number; onJump: (i: number) => void }) {
  const { from, to } = ACTS[index]
  const fill = useScrollRange(p, [from, to], [0, 1])
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={() => onJump(index)}
      aria-label={t.story.jump(t.story.acts[index])}
      className="group flex h-7 flex-1 items-center"
    >
      <span className="h-1.5 w-full overflow-hidden rounded-full bg-cloud transition-colors group-hover:bg-sky-2">
        <motion.span
          style={{ scaleX: fill }}
          className="block h-full origin-left rounded-full bg-gradient-to-r from-brand to-brand-2 rtl:origin-right rtl:bg-gradient-to-l"
        />
      </span>
    </button>
  )
}

/**
 * "How HIZARC works" told as one scroll-driven animation: the screen stays pinned while
 * scrolling plays the story forwards (or backwards) and each chapter's words appear.
 */
export function Story() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [act, setAct] = useState(() => actAt(p.get()))
  useMotionValueEvent(p, 'change', (v) => setAct(actAt(v)))
  const hint = useScrollRange(p, [0, 0.04], [1, 0])
  const { t } = useI18n()
  const ch = t.story.chapters

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    scrollToY(top + travel * (ACTS[i].from + (i === 0 ? 0 : 0.03)))
  }

  return (
    <section id="story" ref={ref} aria-labelledby="story-title" className="relative h-[560vh] lg:h-[620vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-mist to-white" />

        <div className="container-x flex h-full flex-col pb-4 pt-[4.5rem] lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14 lg:pb-8 lg:pt-24">
          {/* the animation */}
          <div className="flex min-h-0 flex-1 items-center justify-center lg:order-2 lg:h-full">
            <div className="w-[min(100%,44svh)] lg:w-[min(100%,76svh)]">
              <Scene p={p} act={act} />
            </div>
          </div>

          {/* the words */}
          <div className="relative shrink-0 lg:order-1">
            <h2 id="story-title" className="mb-3 hidden text-sm font-semibold text-ink/50 lg:block">
              {t.story.heading}
            </h2>
            <Rail p={p} act={act} onJump={jump} />

            <div className="mt-3 grid min-h-[13.5rem] xs:min-h-[12.5rem] sm:min-h-[15rem] lg:mt-10 lg:min-h-[22rem]">
              <Chapter p={p} index={0}>
                <h3 className={title}>{ch[0].title}</h3>
                <p className={body}>{ch[0].body}</p>
                <motion.p style={{ opacity: hint }} className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand">
                  <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
                    <ChevronDown className="size-4" />
                  </motion.span>
                  {t.story.keepScrolling}
                </motion.p>
              </Chapter>
              {[1, 2, 3].map((i) => (
                <Chapter key={i} p={p} index={i}>
                  <h3 className={title}>{ch[i].title}</h3>
                  <p className={body}>{ch[i].body}</p>
                </Chapter>
              ))}
              <Chapter p={p} index={4}>
                <h3 className={title}>{ch[4].title}</h3>
                <p className={body}>{ch[4].body}</p>
                <Button href="#contact" size="md" className="mt-5 lg:mt-7">
                  {t.common.startProject}
                </Button>
              </Chapter>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
