import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'motion/react'
import {
  Box,
  Braces,
  ChevronRight,
  Cloud,
  CreditCard,
  DatabaseBackup,
  Gamepad2,
  Headset,
  Heart,
  Megaphone,
  MessageCircle,
  Router,
  Server,
  ShieldCheck,
  ShoppingBag,
  Wifi,
} from 'lucide-react'
import { MARK_COLORS, MARK_PANELS, MARK_VIEWBOX } from '../brand/geometry'
import { card, Chip, TitleBar, Toast } from '../story/parts'
import { EASE } from '../ui/motion'
import { useI18n } from '../../i18n'

/*
 * One illustration per service. Each panel is 4:3 and sized in cqw (1% of its width),
 * so every picture scales like an image on phones and desktops alike.
 */

type Tint = { from: string; to: string; glow: string; accent: string }

export const SERVICE_TINTS: Record<string, Tint> = {
  'web-apps': { from: '#eef5ff', to: '#d3e5ff', glow: 'rgb(0 119 252 / 0.28)', accent: '#0077fc' },
  software: { from: '#f4f0ff', to: '#ddd3ff', glow: 'rgb(124 92 255 / 0.28)', accent: '#7c5cff' },
  websites: { from: '#eafbf8', to: '#c6f0e8', glow: 'rgb(13 148 136 / 0.26)', accent: '#0d9488' },
  'it-support': { from: '#ebf8ff', to: '#cdebff', glow: 'rgb(2 132 199 / 0.26)', accent: '#0284c7' },
  marketing: { from: '#fff7ec', to: '#ffe2c2', glow: 'rgb(234 88 12 / 0.22)', accent: '#ea580c' },
  games: { from: '#fcf0ff', to: '#efd5ff', glow: 'rgb(192 38 211 / 0.24)', accent: '#a21caf' },
  infrastructure: { from: '#f1f5fa', to: '#d8e2ef', glow: 'rgb(51 65 85 / 0.2)', accent: '#334155' },
  security: { from: '#ecfbf3', to: '#caf1dc', glow: 'rgb(18 183 106 / 0.26)', accent: '#079455' },
}

const at = (left: number, top: number, width: number, height?: number): CSSProperties => ({
  left: `${left}%`,
  top: `${top}%`,
  width: `${width}cqw`,
  ...(height ? { height: `${height}cqw` } : {}),
})

const VIEW = { once: true, margin: '0px 0px -12% 0px' } as const

/** A piece of the picture that rises in when the card scrolls into view (and optionally keeps floating). */
function Pop({ style, delay = 0, bob = false, className = '', children }: { style: CSSProperties; delay?: number; bob?: boolean; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={style}
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEW}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      <div className={`h-full ${bob ? 'animate-float' : ''}`} style={bob ? { animationDelay: `${-delay * 4}s` } : undefined}>
        {children}
      </div>
    </motion.div>
  )
}

function Panel({ tint, children }: { tint: Tint; children: ReactNode }) {
  return (
    <div
      className="scene relative aspect-[4/3] w-full select-none overflow-hidden rounded-[1.25rem] ring-1 ring-black/[0.04] sm:rounded-[1.5rem]"
      style={{ background: `linear-gradient(145deg, ${tint.from}, ${tint.to})` }}
      aria-hidden="true"
    >
      <div className="dots absolute inset-0 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="absolute -right-[18%] -top-[28%] size-[70%] rounded-full" style={{ background: `radial-gradient(closest-side, ${tint.glow}, transparent)` }} />
      <div className="absolute -bottom-[30%] -left-[16%] size-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.8),transparent)]" />
      {children}
    </div>
  )
}

const label = 'text-[1.8cqw] font-semibold text-muted'
const value = 'font-display text-[3.2cqw] font-bold leading-tight text-ink'
const pill = 'rounded-full px-[1.4cqw] py-[0.4cqw] text-[1.7cqw] font-bold'

function Dot({ color }: { color: string }) {
  return <span className="size-[1.3cqw] shrink-0 rounded-full" style={{ background: color }} />
}

/* ─────────────────────── 01 · custom web applications ─────────────────────── */

function WebApps({ tint }: { tint: Tint }) {
  const bars = [38, 52, 46, 68, 60, 86]
  const { t } = useI18n()
  const v = t.services.visuals
  return (
    <>
      <Pop style={at(5, 9, 70, 52)}>
        <div className={`flex h-full flex-col overflow-hidden ${card}`}>
          <TitleBar>
            <span className="mx-auto rounded-full bg-white px-[2cqw] py-[0.5cqw] text-[1.9cqw] font-semibold text-ink/50 ring-1 ring-line">
              portal.yourbrand.ae
            </span>
          </TitleBar>
          <div className="flex min-h-0 flex-1">
            <div className="flex w-[12cqw] flex-col gap-[1.4cqw] bg-navy p-[1.6cqw]">
              <span className="mb-[0.6cqw] grid size-[5cqw] place-items-center rounded-[1.2cqw] bg-white/10">
                <svg viewBox={MARK_VIEWBOX} className="h-[2.8cqw]">
                  {Object.entries(MARK_PANELS).map(([k, pts]) => (
                    <polygon key={k} points={pts} fill={MARK_COLORS.dark[k as keyof typeof MARK_PANELS]} />
                  ))}
                </svg>
              </span>
              {[80, 60, 70, 50].map((w, i) => (
                <span key={i} className={`h-[1.2cqw] rounded-full ${i === 0 ? 'bg-brand-2' : 'bg-white/25'}`} style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[1.6cqw] p-[2cqw]">
              <div className="grid grid-cols-3 gap-[1.2cqw]">
                {[
                  [v.bookings, '312'],
                  [v.clients, '1.2K'],
                  [v.revenue, '86K'],
                ].map(([l, n]) => (
                  <div key={n} className="rounded-[1.2cqw] border border-line bg-white px-[1.2cqw] py-[1cqw]">
                    <p className={`${label} truncate`}>{l}</p>
                    <p className={value}>{n}</p>
                  </div>
                ))}
              </div>
              <div className="flex min-h-0 flex-1 items-end gap-[1.4cqw] rounded-[1.2cqw] border border-line bg-white p-[1.6cqw]">
                {bars.map((h, i) => (
                  <motion.span
                    key={i}
                    className="flex-1 origin-bottom rounded-t-[0.8cqw]"
                    style={{ height: `${h}%`, background: i === bars.length - 1 ? tint.accent : 'rgb(0 119 252 / 0.28)' }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={VIEW}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.07, ease: EASE }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Pop>
      <Pop style={at(55, 4, 41)} delay={0.25} bob>
        <Toast>{v.bookingConfirmed}</Toast>
      </Pop>
      <Pop style={at(47, 67, 48)} delay={0.4} bob>
        <div className={`flex items-center gap-[1.8cqw] p-[2cqw] ${card}`}>
          <span className="grid size-[6cqw] shrink-0 place-items-center rounded-full bg-success/15 text-success">
            <CreditCard className="size-[3.2cqw]" strokeWidth={2.2} />
          </span>
          <div>
            <p className={label}>{v.paymentReceived}</p>
            <p className={value}>{v.payment}</p>
          </div>
        </div>
      </Pop>
      <Pop style={at(4, 70, 19)} delay={0.5}>
        <Chip icon={<Braces className="size-[2.6cqw] text-brand" strokeWidth={2.4} />}>API</Chip>
      </Pop>
    </>
  )
}

/* ─────────────────────── 02 · software development ─────────────────────── */

function Software({ tint }: { tint: Tint }) {
  const { t } = useI18n()
  const v = t.services.visuals
  const colors = ['#12b76a', tint.accent, '#12b76a', '#94a3b8']
  const rows = v.jobs.map(([task, state], i) => [task, state, colors[i]])
  return (
    <>
      <Pop style={at(5, 8, 60, 46)}>
        <div className={`flex h-full flex-col overflow-hidden ${card}`}>
          <TitleBar title={v.operations} />
          <div className="flex flex-1 flex-col justify-around px-[2.2cqw] py-[1cqw]">
            {rows.map(([t, s, c]) => (
              <div key={t} className="flex items-center gap-[1.4cqw]">
                <Dot color={c} />
                <span className="flex-1 truncate text-[2.1cqw] font-semibold text-ink/75">{t}</span>
                <span className={pill} style={{ color: c, background: `${c}1f` }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Pop>
      <Pop style={at(66, 9, 27, 56)} delay={0.2} bob>
        <div className="h-full rounded-[4.5cqw] bg-ink p-[1cqw] shadow-lift">
          <div className="flex h-full flex-col overflow-hidden rounded-[3.6cqw] bg-white">
            <div className="px-[2cqw] pb-[1.6cqw] pt-[3cqw] text-white" style={{ background: tint.accent }}>
              <p className="text-[1.7cqw] font-semibold text-white/70">{v.today}</p>
              <p className="font-display text-[3cqw] font-bold">{v.tasks}</p>
            </div>
            <div className="flex flex-1 flex-col gap-[1.2cqw] p-[1.6cqw]">
              {[true, true, false, false].map((done, i) => (
                <div key={i} className="flex items-center gap-[1cqw] rounded-[1cqw] bg-mist px-[1.2cqw] py-[1.1cqw]">
                  <span
                    className="grid size-[2.4cqw] place-items-center rounded-[0.6cqw] text-[1.6cqw] font-bold text-white"
                    style={{ background: done ? '#12b76a' : '#cbd5e1' }}
                  >
                    {done ? '✓' : ''}
                  </span>
                  <span className="h-[1cqw] flex-1 rounded-full bg-cloud" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Pop>
      <Pop style={at(4, 68, 60)} delay={0.4}>
        <div className={`px-[2cqw] py-[1.8cqw] ${card}`}>
          <p className="text-[1.7cqw] font-bold uppercase tracking-[0.14em]" style={{ color: tint.accent }}>
            {v.automation}
          </p>
          <div className="mt-[1.2cqw] flex items-center gap-[0.8cqw] text-[2cqw] font-semibold text-ink">
            <span className="rounded-[1cqw] bg-mist px-[1.4cqw] py-[0.8cqw]">{v.flow[0]}</span>
            <ChevronRight className="size-[2.4cqw] shrink-0 text-ink/40 rtl:-scale-x-100" />
            <span className="rounded-[1cqw] bg-mist px-[1.4cqw] py-[0.8cqw]">{v.flow[1]}</span>
            <ChevronRight className="size-[2.4cqw] shrink-0 text-ink/40 rtl:-scale-x-100" />
            <span className="rounded-[1cqw] bg-success/15 px-[1.4cqw] py-[0.8cqw] text-[#067647]">{v.flow[2]}</span>
          </div>
        </div>
      </Pop>
    </>
  )
}

/* ─────────────────────── 03 · websites & e-commerce ─────────────────────── */

function Websites({ tint }: { tint: Tint }) {
  const products = ['#9be7d8', '#ffd1a8', '#c7d2fe']
  const { t } = useI18n()
  const v = t.services.visuals
  return (
    <>
      <Pop style={at(5, 8, 67, 60)}>
        <div className={`flex h-full flex-col overflow-hidden ${card}`}>
          <TitleBar>
            <span className="mx-auto rounded-full bg-white px-[2cqw] py-[0.5cqw] text-[1.9cqw] font-semibold text-ink/50 ring-1 ring-line">
              shop.yourbrand.ae
            </span>
          </TitleBar>
          <div className="flex flex-1 flex-col gap-[1.6cqw] p-[2cqw]">
            <div className="flex items-center justify-between">
              <span className="h-[2cqw] w-[12cqw] rounded-full" style={{ background: tint.accent }} />
              <span className="flex items-center gap-[1.4cqw]">
                <span className="rounded-full bg-mist px-[1.2cqw] py-[0.3cqw] text-[1.7cqw] font-bold text-ink/70">
                  EN | <span lang="ar">ع</span>
                </span>
                <span className="relative text-ink/70">
                  <ShoppingBag className="size-[3cqw]" strokeWidth={2.2} />
                  <span className="absolute -right-[1cqw] -top-[0.8cqw] grid size-[2.2cqw] place-items-center rounded-full bg-danger text-[1.4cqw] font-bold text-white">
                    2
                  </span>
                </span>
              </span>
            </div>
            <div
              className="flex h-[14cqw] flex-col justify-center rounded-[1.4cqw] px-[2.4cqw] text-white"
              style={{ background: `linear-gradient(120deg, ${tint.accent}, #0077fc)` }}
            >
              <p className="font-display text-[3cqw] font-bold">{v.newSeason}</p>
              <span className="mt-[0.8cqw] w-fit rounded-full bg-white px-[1.6cqw] py-[0.4cqw] text-[1.7cqw] font-bold text-ink">{v.shopNow}</span>
            </div>
            <div className="grid grid-cols-3 gap-[1.4cqw]">
              {products.map((c, i) => (
                <div key={c} className="rounded-[1.2cqw] border border-line p-[0.9cqw]">
                  <div className="h-[7cqw] rounded-[0.9cqw]" style={{ background: c }} />
                  <p className="mt-[0.8cqw] text-[1.7cqw] font-bold text-ink">{v.price([149, 89, 229][i])}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Pop>
      <Pop style={at(75, 5, 21)} delay={0.25} bob>
        <div className={`flex flex-col items-center p-[1.6cqw] ${card}`}>
          <svg viewBox="0 0 36 36" className="w-[12cqw]">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f2" strokeWidth="3.5" />
            <motion.circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#12b76a"
              strokeWidth="3.5"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 0.98 }}
              viewport={VIEW}
              transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
            />
            <text x="18" y="21.5" textAnchor="middle" className="fill-ink font-display text-[10px] font-bold">
              98
            </text>
          </svg>
          <p className="mt-[0.6cqw] text-[1.7cqw] font-bold text-ink/70">{v.speed}</p>
        </div>
      </Pop>
      <Pop style={at(75, 38, 20, 36)} delay={0.4} bob>
        <div className="h-full rounded-[3.4cqw] bg-ink p-[0.8cqw] shadow-lift">
          <div className="flex h-full flex-col gap-[1cqw] overflow-hidden rounded-[2.8cqw] bg-white p-[1.2cqw] pt-[2.4cqw]">
            <span className="h-[1.2cqw] w-[8cqw] rounded-full" style={{ background: tint.accent }} />
            <div className="h-[9cqw] rounded-[1cqw]" style={{ background: `linear-gradient(120deg, ${tint.accent}, #0077fc)` }} />
            <div className="grid grid-cols-2 gap-[0.8cqw]">
              {products.slice(0, 2).map((c) => (
                <div key={c} className="h-[6cqw] rounded-[0.8cqw]" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      </Pop>
    </>
  )
}

/* ─────────────────────── 04 · IT services & support ─────────────────────── */

function Support({ tint }: { tint: Tint }) {
  const { t } = useI18n()
  const v = t.services.visuals
  const colors = ['#12b76a', tint.accent, '#12b76a']
  const tickets = v.tickets.map(([issue, state], i) => [issue, state, colors[i]])
  return (
    <>
      <Pop style={at(5, 9, 58)}>
        <div className={`overflow-hidden ${card}`}>
          <TitleBar title={v.helpdesk} />
          <div className="flex flex-col gap-[1.6cqw] p-[2.2cqw]">
            {tickets.map(([t, s, c]) => (
              <div key={t} className="flex items-center gap-[1.4cqw] rounded-[1.2cqw] border border-line px-[1.6cqw] py-[1.4cqw]">
                <Dot color={c} />
                <span className="flex-1 truncate text-[2.1cqw] font-semibold text-ink/80">{t}</span>
                <span className={pill} style={{ color: c, background: `${c}1f` }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Pop>
      <Pop style={at(65, 8, 31)} delay={0.2} bob>
        <div className={`flex flex-col items-center p-[2cqw] text-center ${card}`}>
          <span className="relative grid size-[10cqw] place-items-center rounded-full text-white" style={{ background: tint.accent }}>
            <Headset className="size-[5cqw]" strokeWidth={1.8} />
            <span className="absolute bottom-[0.4cqw] end-[0.4cqw] size-[2.4cqw] rounded-full border-[0.5cqw] border-white bg-success" />
          </span>
          <p className="mt-[1.2cqw] text-[2.2cqw] font-bold text-ink">{v.supportTeam}</p>
          <p className="text-[1.8cqw] font-semibold text-success">{v.onlineNow}</p>
        </div>
      </Pop>
      <Pop style={at(71, 50, 21, 21)} delay={0.35} bob>
        <div className="grid size-full place-items-center rounded-full bg-navy text-center text-white shadow-lift">
          <div>
            <p className="font-display text-[4.6cqw] font-bold leading-none">24/7</p>
            <p className="mt-[0.4cqw] text-[1.6cqw] font-semibold text-white/70">{v.support}</p>
          </div>
        </div>
      </Pop>
      <Pop style={at(5, 72, 52)} delay={0.45}>
        <div className={`flex items-center justify-between gap-[2cqw] px-[2.2cqw] py-[1.8cqw] ${card}`}>
          <div>
            <p className={label}>{v.uptime}</p>
            <p className={value}>99.9%</p>
          </div>
          <svg viewBox="0 0 60 20" className="w-[18cqw]">
            <path d="M0 14 L10 12 L20 13 L30 8 L40 9 L50 5 L60 4" fill="none" stroke="#12b76a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Pop>
    </>
  )
}

/* ─────────────────────── 05 · online marketing ─────────────────────── */

function Marketing({ tint }: { tint: Tint }) {
  const { t } = useI18n()
  const v = t.services.visuals
  return (
    <>
      <Pop style={at(5, 8, 56)}>
        <div className={`p-[2.4cqw] ${card}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={label}>{v.leads}</p>
              <p className="font-display text-[4.4cqw] font-bold leading-tight text-ink">1,240</p>
            </div>
            <span className={`${pill} bg-success/15 text-[#067647]`}>▲ 38%</span>
          </div>
          <svg viewBox="0 0 100 40" className="mt-[1cqw] w-full">
            <defs>
              <linearGradient id="mkt-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={tint.accent} stopOpacity="0.25" />
                <stop offset="1" stopColor={tint.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 34 L14 30 L28 31 L42 22 L56 24 L70 14 L84 12 L100 4 L100 40 L0 40 Z" fill="url(#mkt-area)" />
            <motion.path
              d="M0 34 L14 30 L28 31 L42 22 L56 24 L70 14 L84 12 L100 4"
              fill="none"
              stroke={tint.accent}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={VIEW}
              transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
            />
          </svg>
        </div>
      </Pop>
      <Pop style={at(65, 6, 30)} delay={0.2} bob>
        <div className={`overflow-hidden ${card}`}>
          <div className="h-[14cqw]" style={{ background: `linear-gradient(135deg, ${tint.accent}, #f5b400)` }} />
          <div className="flex items-center gap-[2cqw] px-[1.8cqw] py-[1.4cqw] text-[1.9cqw] font-bold text-ink/70">
            <span className="flex items-center gap-[0.6cqw]">
              <Heart className="size-[2.4cqw] fill-danger text-danger" /> 2.4K
            </span>
            <span className="flex items-center gap-[0.6cqw]">
              <MessageCircle className="size-[2.4cqw]" /> 318
            </span>
          </div>
        </div>
      </Pop>
      <Pop style={at(27, 60, 68)} delay={0.4} bob>
        <div className={`flex items-center gap-[2cqw] p-[2cqw] ${card}`}>
          <span className="grid size-[8cqw] shrink-0 place-items-center rounded-full font-display text-[3.4cqw] font-bold text-white" style={{ background: tint.accent }}>
            #1
          </span>
          <div className="min-w-0">
            <p className="text-[1.6cqw] font-bold text-ink/50">{v.sponsored}</p>
            <p className="truncate text-[2.4cqw] font-bold text-[#1a56db]">{v.adTitle}</p>
            <span className="mt-[0.6cqw] block h-[1cqw] w-[80%] rounded-full bg-cloud" />
          </div>
        </div>
      </Pop>
      <Pop style={at(4, 66, 20)} delay={0.5}>
        <Chip icon={<Megaphone className="size-[2.6cqw]" style={{ color: tint.accent }} strokeWidth={2.2} />}>{v.ads}</Chip>
      </Pop>
    </>
  )
}

/* ─────────────────────── 06 · custom game development ─────────────────────── */

function Games({ tint }: { tint: Tint }) {
  const { t } = useI18n()
  const v = t.services.visuals
  return (
    <>
      <Pop style={at(5, 8, 68, 54)}>
        <div className={`relative h-full overflow-hidden ${card}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#bfe3ff] via-[#e9e4ff] to-[#ffe1f1]" />
          <span className="absolute right-[10%] top-[18%] size-[7cqw] rounded-full bg-[#ffd166] shadow-[0_0_30px_rgb(255_209_102/0.8)]" />
          <span className="absolute left-[14%] top-[22%] h-[3cqw] w-[11cqw] rounded-full bg-white/90" />
          <span className="absolute left-[42%] top-[14%] h-[2.4cqw] w-[8cqw] rounded-full bg-white/80" />
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[45%] w-full">
            <path d="M0 22 Q20 8 40 20 T80 16 T100 20 V40 H0 Z" fill="#7ad7a0" />
            <path d="M0 30 Q25 20 50 28 T100 26 V40 H0 Z" fill="#43b77a" />
          </svg>
          <span className="absolute bottom-[34%] left-[52%] h-[3cqw] w-[16cqw] rounded-[0.8cqw] bg-[#8b5e3c]" />
          {[58, 64, 70].map((l, i) => (
            <span
              key={l}
              className="absolute size-[3cqw] animate-float rounded-full border-[0.5cqw] border-[#f5b400] bg-[#ffd166]"
              style={{ left: `${l}%`, bottom: '46%', animationDelay: `${-i * 0.6}s` }}
            />
          ))}
          <span className="absolute bottom-[26%] left-[26%] grid h-[8cqw] w-[8cqw] animate-float place-items-center rounded-[2cqw]" style={{ background: tint.accent }}>
            <span className="flex gap-[1cqw]">
              <span className="size-[1.4cqw] rounded-full bg-white" />
              <span className="size-[1.4cqw] rounded-full bg-white" />
            </span>
          </span>
          <div className="absolute inset-x-[3%] top-[5%] flex items-center justify-between text-[1.9cqw] font-bold text-ink">
            <span className="flex gap-[0.6cqw]">
              {[0, 1, 2].map((i) => (
                <Heart key={i} className="size-[2.6cqw] fill-danger text-danger" />
              ))}
            </span>
            <span className="rounded-full bg-white/80 px-[1.4cqw] py-[0.3cqw]">{v.score}</span>
            <span className="rounded-full bg-white/80 px-[1.4cqw] py-[0.3cqw]">{v.level}</span>
          </div>
        </div>
      </Pop>
      <Pop style={at(66, 58, 30)} delay={0.25} bob>
        <div className={`grid place-items-center py-[2cqw] ${card}`}>
          <Gamepad2 className="size-[12cqw]" style={{ color: tint.accent }} strokeWidth={1.5} />
        </div>
      </Pop>
      <Pop style={at(4, 70, 20)} delay={0.4}>
        <Chip icon={<Box className="size-[2.6cqw]" style={{ color: tint.accent }} strokeWidth={2.2} />}>Unity</Chip>
      </Pop>
      <Pop style={at(28, 80, 22)} delay={0.5}>
        <Chip icon={<Box className="size-[2.6cqw] text-ink" strokeWidth={2.2} />}>Unreal</Chip>
      </Pop>
    </>
  )
}

/* ─────────────────────── 07 · infrastructure design ─────────────────────── */

/** Network node centred on (x, y) — the wrapper centres it so the entrance animation can own `transform`. */
function Node({ x, y, icon, name, color, delay }: { x: number; y: number; icon: ReactNode; name: string; color: string; delay: number }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={at(x, y, 22)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEW}
        transition={{ duration: 0.7, delay, ease: EASE }}
        className={`flex items-center gap-[1.2cqw] px-[1.4cqw] py-[1.2cqw] ${card}`}
      >
        <span className="grid size-[5cqw] shrink-0 place-items-center rounded-[1.2cqw] text-white" style={{ background: color }}>
          {icon}
        </span>
        <span className="text-[1.9cqw] font-bold leading-tight text-ink">{name}</span>
      </motion.div>
    </div>
  )
}

function Infrastructure({ tint }: { tint: Tint }) {
  // node centres in % of the panel — the SVG uses the same space (viewBox 100 × 75)
  const cloud = [50, 15]
  const core = [50, 44]
  const leaves = [
    [18, 76],
    [50, 80],
    [82, 76],
  ]
  const toView = ([x, y]: number[]) => [x, y * 0.75]
  const ic = 'size-[2.8cqw]'
  const { t } = useI18n()
  const v = t.services.visuals
  return (
    <>
      <svg viewBox="0 0 100 75" className="absolute inset-0 size-full" fill="none">
        {[[cloud, core], ...leaves.map((l) => [core, l])].map(([a, b], i) => {
          const [x1, y1] = toView(a)
          const [x2, y2] = toView(b)
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tint.accent} strokeOpacity="0.18" strokeWidth="1.4" />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0077fc" strokeWidth="0.9" strokeDasharray="2 3" strokeLinecap="round" className="animate-dash" />
            </g>
          )
        })}
      </svg>
      <Node x={cloud[0]} y={cloud[1]} icon={<Cloud className={ic} />} name={v.cloud} color="#0077fc" delay={0} />
      <Node x={core[0]} y={core[1]} icon={<Router className={ic} />} name={v.coreSwitch} color={tint.accent} delay={0.15} />
      <Node x={leaves[0][0]} y={leaves[0][1]} icon={<Server className={ic} />} name={v.servers} color="#03204f" delay={0.3} />
      <Node x={leaves[1][0]} y={leaves[1][1]} icon={<DatabaseBackup className={ic} />} name={v.backup} color="#12b76a" delay={0.4} />
      <Node x={leaves[2][0]} y={leaves[2][1]} icon={<Wifi className={ic} />} name={v.wifi} color="#0284c7" delay={0.5} />
      <Pop style={at(4, 6, 24)} delay={0.6} bob>
        <Chip icon={<span className="size-[1.4cqw] rounded-full bg-success" />}>{v.latency}</Chip>
      </Pop>
      <Pop style={at(74, 6, 22)} delay={0.7} bob>
        <Chip icon={<span className="text-success">✓</span>}>{v.backedUp}</Chip>
      </Pop>
    </>
  )
}

/* ─────────────────────── 08 · cyber security ─────────────────────── */

function Security({ tint }: { tint: Tint }) {
  const { t } = useI18n()
  const v = t.services.visuals
  const colors = ['#f04438', '#f79009', '#f04438']
  const log = v.threatLog.map(([threat, state], i) => [threat, state, colors[i]])
  return (
    <>
      <Pop style={at(4, 9, 52)}>
        <div className={`overflow-hidden ${card}`}>
          <TitleBar title={v.threats} />
          <div className="flex flex-col gap-[1.4cqw] p-[2cqw]">
            {log.map(([t, s, c]) => (
              <div key={t} className="flex items-center gap-[1.2cqw]">
                <Dot color={c} />
                <span className="flex-1 truncate text-[2cqw] font-semibold text-ink/80">{t}</span>
                <span className={pill} style={{ color: c, background: `${c}1a` }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Pop>
      <Pop style={at(57, 8, 40, 40)} delay={0.2}>
        <div className="relative size-full">
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute rounded-full border" style={{ inset: `${i * 16}%`, borderColor: `${tint.accent}40` }} />
          ))}
          <span
            className="absolute inset-0 animate-spin rounded-full [animation-duration:3.5s]"
            style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${tint.accent}55 60deg, transparent 61deg)` }}
          />
          <span className="absolute inset-[30%] animate-ping rounded-full [animation-duration:2.4s]" style={{ background: `${tint.accent}30` }} />
          <span className="absolute inset-[28%] grid place-items-center rounded-full bg-white shadow-lift">
            <ShieldCheck className="size-[55%]" style={{ color: tint.accent }} strokeWidth={1.8} />
          </span>
        </div>
      </Pop>
      <Pop style={at(5, 64, 20)} delay={0.4} bob>
        <Chip icon={<span style={{ color: tint.accent }}>✓</span>}>VAPT</Chip>
      </Pop>
      <Pop style={at(28, 74, 26)} delay={0.5} bob>
        <Chip icon={<ShieldCheck className="size-[2.6cqw]" style={{ color: tint.accent }} />}>ISO 27001</Chip>
      </Pop>
      <Pop style={at(60, 66, 36)} delay={0.6} bob>
        <Chip icon={<span className="size-[1.4cqw] animate-pulse rounded-full bg-success" />}>{v.monitoring}</Chip>
      </Pop>
    </>
  )
}

const VISUALS: Record<string, (props: { tint: Tint }) => ReactNode> = {
  'web-apps': WebApps,
  software: Software,
  websites: Websites,
  'it-support': Support,
  marketing: Marketing,
  games: Games,
  infrastructure: Infrastructure,
  security: Security,
}

export function ServiceVisual({ id }: { id: string }) {
  const tint = SERVICE_TINTS[id] ?? SERVICE_TINTS['web-apps']
  const Visual = VISUALS[id] ?? WebApps
  return (
    <Panel tint={tint}>
      <Visual tint={tint} />
    </Panel>
  )
}
