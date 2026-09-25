import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import { Atom, Check, Cloud, Handshake, Hexagon, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { MARK_COLORS, MARK_PANELS, MARK_VIEWBOX } from '../brand/geometry'
import { useMove, useScrollRange } from '../ui/motion'
import { useI18n } from '../../i18n'
import { Client, Consultant } from './Avatars'
import { AlertWindow, Bubble, card, ChartDown, Chip, InboxCard, MissedCalls, SheetWindow, StickyNote, TitleBar, Toast } from './parts'

/*
 * The story, as one illustration driven by scroll progress `p` (0 → 1):
 *   0.00 – 0.20  the challenge        0.68 – 0.84  launch
 *   0.20 – 0.42  meet HIZARC          0.84 – 1.00  delighted
 *   0.42 – 0.68  we build
 * Positions are % of the scene; sizes and moves are in cqw (1% of the scene width).
 */

type P = MotionValue<number>
type Pose = { x?: number; y?: number; s?: number; r?: number }
type Track = { x?: number[]; y?: number[]; s?: number[]; r?: number[]; o?: number[] }

const REST = { x: 0, y: 0, s: 1, r: 0 }

/** Enter during `enter` (coming from `from`); optionally leave during `exit` (heading to `to`). */
function span(enter: [number, number], exit?: [number, number], from: Pose = {}, to: Pose = from) {
  const f = { ...REST, ...from }
  const t = { ...REST, ...to }
  if (!exit) return { at: enter, track: { x: [f.x, 0], y: [f.y, 0], s: [f.s, 1], r: [f.r, 0], o: [0, 1] } }
  return {
    at: [...enter, ...exit],
    track: { x: [f.x, 0, 0, t.x], y: [f.y, 0, 0, t.y], s: [f.s, 1, 1, t.s], r: [f.r, 0, 0, t.r], o: [0, 1, 1, 0] },
  }
}

const box = (left: number, top: number, width: number, height?: number) => ({
  left: `${left}%`,
  top: `${top}%`,
  width: `${width}cqw`,
  ...(height ? { height: `${height}cqw` } : {}),
})

function Piece({
  p,
  at,
  track,
  style,
  className = '',
  children,
}: {
  p: P
  at: number[]
  track: Track
  style: React.CSSProperties
  className?: string
  children: ReactNode
}) {
  const { opacity, transform } = useMove(p, at, track)
  return (
    <motion.div className={`absolute ${className}`} style={{ ...style, opacity, transform }}>
      {children}
    </motion.div>
  )
}

/* ─────────────────────────── backdrop ─────────────────────────── */

function Stage({ p }: { p: P }) {
  const trouble = useScrollRange(p, [0.17, 0.26], [1, 0])
  const work = useScrollRange(p, [0.17, 0.26, 0.84, 0.9], [0, 1, 1, 0])
  const joy = useScrollRange(p, [0.84, 0.9], [0, 1])
  return (
    <div className="absolute inset-[2%] overflow-hidden rounded-[7cqw] border border-line bg-gradient-to-b from-mist to-white">
      <div className="dots absolute inset-0 opacity-70 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <motion.div style={{ opacity: trouble }} className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgb(240_68_56/0.13),transparent)]" />
      <motion.div style={{ opacity: work }} className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgb(0_119_252/0.15),transparent)]" />
      <motion.div
        style={{ opacity: joy }}
        className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_55%,rgb(18_183_106/0.14),rgb(176_131_63/0.08)_50%,transparent)]"
      />
    </div>
  )
}

/* ─────────────────────────── characters ─────────────────────────── */

function ClientActor({ p }: { p: P }) {
  const mood = useScrollRange(p, [0.16, 0.3, 0.4, 0.86, 0.93], [0, 0.45, 0.55, 0.6, 1])
  const { opacity, transform } = useMove(p, [0, 0.04, 0.2, 0.27, 0.4, 0.45, 0.85, 0.91], {
    x: [0, 0, 0, -26, -26, -60, -20, -20],
    y: [4, 0, 0, 0, 0, 6, 8, 5],
    s: [0.96, 1, 1, 1, 1, 0.9, 0.9, 1],
    o: [1, 1, 1, 1, 1, 0, 0, 1],
  })
  return (
    <motion.div className="absolute" style={{ ...box(30, 42, 40), opacity, transform }}>
      <Client mood={mood} className="w-full drop-shadow-[0_10px_18px_rgb(8_23_53/0.14)]" />
    </motion.div>
  )
}

function ConsultantActor({ p }: { p: P }) {
  const { opacity, transform } = useMove(p, [0.22, 0.28, 0.4, 0.45, 0.85, 0.91], {
    x: [36, 0, 0, 44, 44, -4],
    y: [0, 0, 0, 6, 8, 5],
    s: [1, 1, 1, 0.9, 0.9, 1],
    o: [0, 1, 1, 0, 0, 1],
  })
  return (
    <motion.div className="absolute" style={{ ...box(56, 42, 40), opacity, transform }}>
      <Consultant className="w-full drop-shadow-[0_10px_18px_rgb(8_23_53/0.14)]" />
    </motion.div>
  )
}

/* ─────────────────────────── act 2 ─────────────────────────── */

function MarkBuild({ p }: { p: P }) {
  const c = MARK_COLORS.light
  const pillarY = useScrollRange(p, [0.23, 0.275], [320, 0])
  const pillarO = useScrollRange(p, [0.23, 0.255], [0, 1])
  const rightY = useScrollRange(p, [0.245, 0.29], [-320, 0])
  const rightO = useScrollRange(p, [0.245, 0.27], [0, 1])
  const barS = useScrollRange(p, [0.27, 0.3], [0, 1])
  const foldX = useScrollRange(p, [0.29, 0.31], [-140, 0])
  const foldO = useScrollRange(p, [0.29, 0.305], [0, 1])
  const glow = useScrollRange(p, [0.28, 0.31], [0, 1])

  return (
    <div className="relative">
      <motion.div
        style={{ opacity: glow }}
        className="absolute inset-[-45%] rounded-full bg-[radial-gradient(closest-side,rgb(0_119_252/0.28),transparent)]"
      />
      <svg viewBox={MARK_VIEWBOX} className="relative w-full overflow-visible">
        <motion.polygon points={MARK_PANELS.pillar} fill={c.pillar} style={{ y: pillarY, opacity: pillarO }} />
        <motion.polygon points={MARK_PANELS.right} fill={c.right} style={{ y: rightY, opacity: rightO }} />
        <motion.polygon
          points={MARK_PANELS.bar}
          fill={c.bar}
          style={{ scaleX: barS, transformBox: 'fill-box', transformOrigin: '0% 50%' }}
        />
        <motion.polygon points={MARK_PANELS.fold} fill={c.fold} style={{ x: foldX, opacity: foldO }} />
      </svg>
    </div>
  )
}

function PlanRow({ p, at, children }: { p: P; at: number; children: ReactNode }) {
  const done = useScrollRange(p, [at, at + 0.008], [0, 1])
  const scale = useScrollRange(p, [at, at + 0.008], [0.4, 1])
  return (
    <li className="mt-[1.8cqw] flex items-center gap-[1.6cqw] text-[2.6cqw] font-semibold text-ink">
      <span className="relative grid size-[4cqw] shrink-0 place-items-center rounded-full bg-cloud">
        <motion.span style={{ opacity: done, scale }} className="absolute inset-0 grid place-items-center rounded-full bg-success text-white">
          <Check className="size-[2.6cqw]" strokeWidth={3.5} />
        </motion.span>
      </span>
      {children}
    </li>
  )
}

/* ─────────────────────────── act 3 – 4: the web app ─────────────────────────── */

function Block({ p, at, className = '', fill = '', children }: { p: P; at: [number, number]; className?: string; fill?: string; children?: ReactNode }) {
  const o = useScrollRange(p, at, [0, 1])
  return (
    <div className={`relative overflow-hidden rounded-[1.4cqw] bg-cloud ${className}`}>
      <motion.div style={{ opacity: o }} className={`absolute inset-0 ${fill}`}>
        {children}
      </motion.div>
    </div>
  )
}

function Count({ p, at, values, format }: { p: P; at: number[]; values: number[]; format: (n: number) => string }) {
  const v = useScrollRange(p, at, values)
  const text = useTransform(v, format)
  return <motion.span>{text}</motion.span>
}

const LINE_PATH = 'M0 30 L12 27 L24 28 L36 21 L48 22 L60 15 L72 13 L84 8 L100 3'

function AppWindow({ p }: { p: P }) {
  const { t } = useI18n()
  const s = t.story.scene
  const building = useScrollRange(p, [0.69, 0.71], [1, 0])
  const live = useScrollRange(p, [0.69, 0.71], [0, 1])
  const draw = useScrollRange(p, [0.61, 0.665, 0.72, 0.8], [0, 0.82, 0.82, 1])
  const area = useScrollRange(p, [0.63, 0.67], [0, 1])
  const kpi = 'flex h-full flex-col justify-center border border-line bg-white px-[1.4cqw]'
  const label = 'text-[1.8cqw] font-semibold text-muted'
  const value = 'font-display text-[3.2cqw] font-bold leading-tight text-ink'

  return (
    <div className={`flex h-full flex-col overflow-hidden ${card}`}>
      <TitleBar>
        <span className="mx-auto flex h-[3.8cqw] items-center gap-[0.8cqw] rounded-full bg-white px-[2cqw] text-[2cqw] font-semibold text-ink/50 ring-1 ring-line">
          <Lock className="size-[1.9cqw] text-success" strokeWidth={2.6} /> app.yourbusiness.ae
        </span>
        <span className="relative h-[3.8cqw] w-[12cqw] shrink-0">
          <motion.span style={{ opacity: building }} className="absolute inset-0 flex items-center justify-center gap-[0.8cqw] rounded-full bg-warn/15 text-[1.9cqw] font-bold text-[#b54708]">
            <span className="size-[1.2cqw] animate-pulse rounded-full bg-warn" /> {s.building}
          </motion.span>
          <motion.span style={{ opacity: live }} className="absolute inset-0 flex items-center justify-center gap-[0.8cqw] rounded-full bg-success/15 text-[1.9cqw] font-bold text-[#067647]">
            <span className="size-[1.2cqw] rounded-full bg-success" /> {s.live}
          </motion.span>
        </span>
      </TitleBar>

      <div className="flex min-h-0 flex-1">
        <Block p={p} at={[0.54, 0.57]} className="w-[15cqw] shrink-0 rounded-none" fill="bg-navy">
          <div className="flex flex-col gap-[1.6cqw] p-[1.8cqw]">
            <span className="mb-[0.6cqw] grid size-[5cqw] place-items-center rounded-[1.2cqw] bg-white/10">
              <svg viewBox={MARK_VIEWBOX} className="h-[3cqw]">
                {Object.entries(MARK_PANELS).map(([k, pts]) => (
                  <polygon key={k} points={pts} fill={MARK_COLORS.dark[k as keyof typeof MARK_PANELS]} />
                ))}
              </svg>
            </span>
            {[70, 55, 62, 48].map((w, i) => (
              <span key={i} className={`h-[1.3cqw] rounded-full ${i === 0 ? 'bg-brand-2' : 'bg-white/25'}`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </Block>

        <div className="flex min-w-0 flex-1 flex-col gap-[1.6cqw] p-[2.2cqw]">
          <div className="flex items-center justify-between gap-[2cqw]">
            <Block p={p} at={[0.55, 0.58]} className="h-[4cqw] w-[48%]" fill="flex items-center bg-white">
              <span className="font-display text-[2.8cqw] font-bold text-ink">{s.dashboard}</span>
            </Block>
            <Block p={p} at={[0.55, 0.58]} className="size-[4.4cqw] rounded-full" fill="bg-gradient-to-br from-brand-2 to-brand" />
          </div>

          <div className="grid h-[11cqw] shrink-0 grid-cols-3 gap-[1.4cqw]">
            <Block p={p} at={[0.56, 0.59]} fill={kpi}>
              <span className={label}>{s.orders}</span>
              <span className={value}>
                <Count p={p} at={[0.56, 0.64, 0.72, 0.82]} values={[0, 1284, 1284, 1540]} format={(n) => Math.round(n).toLocaleString('en-US')} />
              </span>
            </Block>
            <Block p={p} at={[0.575, 0.605]} fill={kpi}>
              <span className={label}>{s.revenue}</span>
              <span className={value}>
                <Count p={p} at={[0.575, 0.645, 0.72, 0.82]} values={[0, 182, 182, 231]} format={(n) => `${Math.round(n)}K`} />
              </span>
            </Block>
            <Block p={p} at={[0.59, 0.62]} fill={kpi}>
              <span className={label}>{s.automated}</span>
              <span className={`${value} text-success`}>
                <Count p={p} at={[0.59, 0.65, 0.72, 0.82]} values={[0, 72, 72, 96]} format={(n) => `${Math.round(n)}%`} />
              </span>
            </Block>
          </div>

          <Block p={p} at={[0.6, 0.62]} className="min-h-0 flex-1" fill="flex flex-col border border-line bg-white p-[1.6cqw]">
            <span className={label}>{s.sales}</span>
            <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="mt-[0.8cqw] min-h-0 w-full flex-1">
              <defs>
                <linearGradient id="story-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0077fc" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#0077fc" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path d={`${LINE_PATH} L100 34 L0 34 Z`} fill="url(#story-area)" style={{ opacity: area }} />
              <motion.path d={LINE_PATH} fill="none" stroke="#0077fc" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: draw }} />
            </svg>
          </Block>

          {s.feed.map((line, i) => (
            <Block key={i} p={p} at={[0.62 + i * 0.015, 0.65 + i * 0.015]} className="h-[3.6cqw] shrink-0" fill="flex items-center gap-[1cqw] border border-line bg-white px-[1.4cqw]">
              <span className="size-[1.4cqw] rounded-full bg-success" />
              <span className="truncate text-[1.9cqw] font-semibold text-ink/70">{line}</span>
            </Block>
          ))}
        </div>
      </div>
    </div>
  )
}

const CODE: [string, string][][] = [
  [['k', 'const '], ['t', 'app'], ['p', ' = '], ['f', 'hizarc.build'], ['p', '({']],
  [['p', '  client: '], ['s', "'Your business'"], ['p', ',']],
  [['p', '  modules: ['], ['s', "'sales'"], ['p', ', '], ['s', "'crm'"], ['p', '],']],
  [['p', '  secure: '], ['k', 'true'], ['p', ',']],
  [['p', '})']],
  [['f', 'app.deploy'], ['p', '() '], ['c', '// ✓ live']],
]
const TOKEN: Record<string, string> = {
  k: 'text-[#7c3aed]',
  t: 'text-ink',
  p: 'text-ink/60',
  f: 'text-brand',
  s: 'text-[#0f9f5a]',
  c: 'text-ink/35',
}

function CodeLine({ p, at, tokens }: { p: P; at: number; tokens: [string, string][] }) {
  const clip = useScrollRange(p, [at, at + 0.018], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  return (
    <motion.div style={{ clipPath: clip }} className="whitespace-pre">
      {tokens.map(([kind, text], i) => (
        <span key={i} className={TOKEN[kind]}>
          {text}
        </span>
      ))}
    </motion.div>
  )
}

function CodePanel({ p }: { p: P }) {
  return (
    <div className={`overflow-hidden ${card}`}>
      <TitleBar title="app.ts" />
      <div dir="ltr" className="p-[2cqw] font-mono text-[2.25cqw] leading-[1.75]">
        {CODE.map((tokens, i) => (
          <CodeLine key={i} p={p} at={0.49 + i * 0.02} tokens={tokens} />
        ))}
        <span className="inline-block h-[2.6cqw] w-[1cqw] translate-y-[0.4cqw] animate-blink bg-brand" />
      </div>
    </div>
  )
}

function BuildProgress({ p }: { p: P }) {
  const fill = useScrollRange(p, [0.48, 0.66], [0, 1])
  const { t } = useI18n()
  return (
    <div className={`px-[2.4cqw] py-[1.8cqw] ${card}`}>
      <div className="flex items-center justify-between text-[2.3cqw] font-bold text-ink">
        <span>{t.story.scene.buildingApp}</span>
        <span className="text-brand">
          <Count p={p} at={[0.48, 0.66]} values={[0, 100]} format={(n) => `${Math.round(n)}%`} />
        </span>
      </div>
      <div className="mt-[1.2cqw] h-[1.4cqw] overflow-hidden rounded-full bg-cloud">
        <motion.div style={{ scaleX: fill }} className="h-full origin-left rounded-full bg-gradient-to-r from-brand to-brand-2 rtl:origin-right rtl:bg-gradient-to-l" />
      </div>
    </div>
  )
}

function Phone() {
  const { t } = useI18n()
  const s = t.story.scene
  return (
    <div className="h-full rounded-[5cqw] bg-ink p-[1.2cqw] shadow-lift">
      <div className="flex h-full flex-col overflow-hidden rounded-[4cqw] bg-mist">
        <div className="bg-navy px-[2.4cqw] pb-[2.4cqw] pt-[3.4cqw]">
          <span className="mx-auto mb-[2cqw] block h-[1.4cqw] w-[9cqw] rounded-full bg-black/40" />
          <p className="text-[1.8cqw] font-semibold text-white/60">{s.today}</p>
          <p className="font-display text-[3.4cqw] font-bold text-white">{s.todayTotal}</p>
        </div>
        <div className="flex flex-1 flex-col gap-[1.4cqw] p-[1.8cqw]">
          <div className="grid grid-cols-2 gap-[1.2cqw]">
            {[s.orders, s.tasks].map((l, i) => (
              <div key={i} className="rounded-[1.4cqw] border border-line bg-white p-[1.2cqw]">
                <p className="text-[1.6cqw] font-semibold text-muted">{l}</p>
                <p className="text-[2.4cqw] font-bold text-ink">{i ? s.late : '+38'}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[1.4cqw] border border-line bg-white p-[1.2cqw]">
            <svg viewBox="0 0 100 34" className="w-full">
              <path d={LINE_PATH} fill="none" stroke="#0077fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-[1cqw] rounded-[1.2cqw] bg-white px-[1.2cqw] py-[1.1cqw]">
              <span className="size-[1.4cqw] rounded-full bg-success" />
              <span className="h-[1.1cqw] flex-1 rounded-full bg-cloud" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── act 5 ─────────────────────────── */

const CONFETTI_COLORS = ['#0077fc', '#3d9bff', '#12b76a', '#f5b400', '#b0833f', '#ff6b8b']
const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.35
  const dist = 20 + ((i * 37) % 19)
  return {
    dx: Math.round(Math.cos(angle) * dist * 10) / 10,
    dy: Math.round((Math.sin(angle) * dist * 0.75 - 6) * 10) / 10,
    rot: (i * 73) % 360,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    wide: i % 2 === 0,
  }
})

function Confetti({ p }: { p: P }) {
  return (
    <>
      {CONFETTI.map((c, i) => (
        <Piece
          key={i}
          p={p}
          at={[0.895, 0.93, 0.99]}
          track={{ x: [0, c.dx * 0.85, c.dx], y: [0, c.dy, c.dy + 12], r: [0, c.rot / 2, c.rot], s: [0.4, 1, 1], o: [0, 1, 0.85] }}
          style={box(49, 44, c.wide ? 2.4 : 1.5, c.wide ? 1.3 : 2.6)}
          className="rounded-[0.4cqw]"
        >
          <span className="block size-full rounded-[0.4cqw]" style={{ background: c.color }} />
        </Piece>
      ))}
    </>
  )
}

/* ─────────────────────────── the scene ─────────────────────────── */

export function Scene({ p, act }: { p: P; act: number }) {
  // the problems shake only while they are the story
  const shake = act === 0 ? 'animate-jitter' : ''
  const { t } = useI18n()
  const s = t.story.scene

  return (
    <div className="scene relative aspect-square w-full select-none" aria-hidden="true">
      <Stage p={p} />

      {/* ── 1 · the challenge ── */}
      <Piece p={p} {...span([0.005, 0.045], [0.2, 0.26], { y: 6, s: 0.85, r: -10 }, { x: 26, y: 30, s: 0.2, r: -30 })} style={box(2, 4, 47)}>
        <div className={shake} style={{ rotate: '-5deg' }}>
          <SheetWindow />
        </div>
      </Piece>
      <Piece p={p} {...span([0.025, 0.065], [0.205, 0.265], { y: 6, s: 0.85, r: 8 }, { x: -22, y: 34, s: 0.2, r: 30 })} style={box(58, 3, 38)}>
        <div className={shake} style={{ rotate: '4deg', animationDelay: '-0.8s' }}>
          <InboxCard />
        </div>
      </Piece>
      <Piece p={p} {...span([0.05, 0.09], [0.21, 0.27], { s: 0.6 }, { x: -20, y: -4, s: 0.2, r: 20 })} style={box(55, 47, 42)} className="z-10">
        <div className={shake} style={{ rotate: '3deg', animationDelay: '-1.4s' }}>
          <AlertWindow />
        </div>
      </Piece>
      <Piece p={p} {...span([0.075, 0.115], [0.2, 0.26], { y: 8, s: 0.8, r: -20 }, { x: 36, y: -18, s: 0.2, r: -40 })} style={box(3, 62, 25)}>
        <div style={{ rotate: '-8deg' }}>
          <StickyNote />
        </div>
      </Piece>
      <Piece p={p} {...span([0.1, 0.14], [0.21, 0.27], { x: -8 }, { x: 34, y: 4, s: 0.2 })} style={box(3, 39, 26)}>
        <div className={shake} style={{ animationDelay: '-0.4s' }}>
          <MissedCalls />
        </div>
      </Piece>
      <Piece p={p} {...span([0.12, 0.16], [0.21, 0.27], { y: 8 }, { x: -20, y: -30, s: 0.2 })} style={box(61, 77, 35)}>
        <ChartDown />
      </Piece>
      <Piece p={p} {...span([0.14, 0.165], [0.19, 0.215], { y: 4, s: 0.85 }, { y: -4, s: 0.9 })} style={box(27, 27, 46)} className="z-20">
        <Bubble>{s.betterWay}</Bubble>
      </Piece>

      {/* ── 2 · meet HIZARC ── */}
      <Piece
        p={p}
        at={[0.225, 0.25, 0.31, 0.335, 0.365, 0.39]}
        track={{ s: [0.7, 1, 1, 0.62, 0.62, 0.4], y: [4, 0, 0, -5, -5, -9], o: [0, 1, 1, 1, 1, 0] }}
        style={box(41, 7, 18)}
      >
        <MarkBuild p={p} />
      </Piece>
      <Piece p={p} {...span([0.315, 0.335], [0.365, 0.385], { y: 4, s: 0.9 }, { y: -3 })} style={box(3, 24, 44)} className="z-20">
        <Bubble>{s.drowning}</Bubble>
      </Piece>
      <Piece p={p} {...span([0.335, 0.355], [0.37, 0.39], { y: 4, s: 0.9 }, { y: -3 })} style={box(53, 24, 44)} className="z-20">
        <Bubble side="right" tone="brand">
          {s.mapIt}
        </Bubble>
      </Piece>
      <Piece p={p} {...span([0.38, 0.4], [0.42, 0.45], { y: 5, s: 0.9 }, { y: -5, s: 0.9 })} style={box(22, 12, 56)} className="z-20">
        <div className={`p-[2.8cqw] ${card}`}>
          <p className="text-[2.1cqw] font-bold uppercase tracking-[0.14em] text-brand">{s.plan}</p>
          <ul>
            {s.planSteps.map((step, i) => (
              <PlanRow key={i} p={p} at={0.392 + i * 0.01}>
                {step}
              </PlanRow>
            ))}
          </ul>
        </div>
      </Piece>

      {/* ── 3 · we build  ·  4 · launch ── */}
      <Piece
        p={p}
        at={[0.43, 0.47, 0.68, 0.73, 0.84, 0.89]}
        track={{ s: [0.86, 1, 1, 0.9, 0.9, 0.88], x: [0, 0, 0, -5, -5, -5], y: [8, 0, 0, -1, -1, -3], o: [0, 1, 1, 1, 1, 0.22] }}
        style={box(4, 7, 92, 64)}
      >
        <AppWindow p={p} />
      </Piece>
      <Piece p={p} {...span([0.46, 0.49], [0.645, 0.675], { y: 8, s: 0.92 })} style={box(42, 45, 55)} className="z-10">
        <CodePanel p={p} />
      </Piece>
      <Piece p={p} {...span([0.45, 0.48], [0.66, 0.69], { y: 6 })} style={box(4, 80, 92)}>
        <BuildProgress p={p} />
      </Piece>
      <Piece p={p} {...span([0.5, 0.515], [0.655, 0.68], { s: 0.3 })} style={box(72, 1.5, 22)} className="z-10">
        <Chip icon={<Atom className="size-[2.8cqw] text-[#149eca]" strokeWidth={2.2} />}>React</Chip>
      </Piece>
      <Piece p={p} {...span([0.525, 0.54], [0.655, 0.68], { s: 0.3 })} style={box(0, 30, 22)} className="z-10">
        <Chip icon={<Cloud className="size-[2.8cqw] text-brand" strokeWidth={2.2} />}>{s.cloud}</Chip>
      </Piece>
      <Piece p={p} {...span([0.55, 0.565], [0.655, 0.68], { s: 0.3 })} style={box(1, 58, 22)} className="z-10">
        <Chip icon={<Hexagon className="size-[2.8cqw] text-[#3c873a]" strokeWidth={2.2} />}>Node.js</Chip>
      </Piece>
      <Piece p={p} {...span([0.575, 0.59], [0.655, 0.68], { s: 0.3 })} style={box(26, 92, 22)} className="z-10">
        <Chip icon={<ShieldCheck className="size-[2.8cqw] text-success" strokeWidth={2.2} />}>{s.secure}</Chip>
      </Piece>

      <Piece
        p={p}
        at={[0.7, 0.76, 0.84, 0.89]}
        track={{ x: [34, 0, 0, 0], r: [10, 0, 0, 0], s: [1, 1, 1, 0.96], o: [0, 1, 1, 0.22] }}
        style={box(64, 22, 32, 62)}
        className="z-10"
      >
        <Phone />
      </Piece>
      <Piece p={p} {...span([0.75, 0.78], [0.83, 0.86], { s: 0.2, r: -30 })} style={box(88, 16, 8)} className="z-20 text-warn">
        <Sparkles className="size-full" strokeWidth={2} />
      </Piece>
      <Piece p={p} {...span([0.745, 0.77], [0.83, 0.86], { x: -10 })} style={box(3, 73, 56)} className="z-20">
        <Toast>{s.toasts[0]}</Toast>
      </Piece>
      <Piece p={p} {...span([0.77, 0.795], [0.83, 0.86], { x: -10 })} style={box(3, 84, 56)} className="z-20">
        <Toast>{s.toasts[1]}</Toast>
      </Piece>

      {/* ── the people (confetti flies behind them) ── */}
      <Confetti p={p} />
      <ClientActor p={p} />
      <ConsultantActor p={p} />

      {/* ── 5 · delighted ── */}
      <Piece p={p} {...span([0.895, 0.925], undefined, { y: -6, s: 0.8 })} style={box(24, 9, 52)} className="z-20">
        <div className="flex items-center justify-center gap-[1.6cqw] rounded-full bg-success px-[3cqw] py-[2cqw] text-[3cqw] font-bold text-white shadow-[0_12px_30px_-10px_rgb(18_183_106/0.7)]">
          <span className="grid size-[4.4cqw] place-items-center rounded-full bg-white/25">
            <Check className="size-[3cqw]" strokeWidth={3.5} />
          </span>
          {s.delivered}
        </div>
      </Piece>
      <Piece p={p} {...span([0.905, 0.935], undefined, { s: 0.3, r: -20 })} style={box(41, 63, 18, 18)} className="z-20">
        <div className="grid size-full place-items-center rounded-full border-[0.8cqw] border-white bg-brand text-white shadow-lift">
          <Handshake className="size-[55%]" strokeWidth={1.8} />
        </div>
      </Piece>
      <Piece p={p} {...span([0.925, 0.955], undefined, { y: 4, s: 0.85 })} style={box(4, 28, 50)} className="z-20">
        <Bubble>{s.wow}</Bubble>
      </Piece>
    </div>
  )
}
