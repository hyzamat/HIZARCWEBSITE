import type { ReactNode } from 'react'
import { Mail, PhoneMissed, TrendingDown, TriangleAlert } from 'lucide-react'
import { useI18n } from '../../i18n'

/* Static artwork for the story scene. Every size is in cqw (1% of the scene width). */

export const card = 'rounded-[2.4cqw] border border-line bg-white shadow-lift'

export function TitleBar({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="flex h-[6.5cqw] items-center gap-[1cqw] border-b border-line bg-mist px-[2cqw]">
      <span className="size-[1.4cqw] rounded-full bg-[#ff6159]" />
      <span className="size-[1.4cqw] rounded-full bg-[#ffbd2e]" />
      <span className="size-[1.4cqw] rounded-full bg-[#28c941]" />
      {title && <span className="ms-[1cqw] truncate text-[2.2cqw] font-semibold text-ink/60">{title}</span>}
      {children}
    </div>
  )
}

export function SheetWindow() {
  const { t } = useI18n()
  const rows = t.story.scene.sheet
  return (
    <div className={`overflow-hidden ${card}`}>
      <TitleBar title="sales_FINAL_v7 (2).xlsx" />
      <div className="grid grid-cols-4 gap-px bg-line text-[2.1cqw] leading-none">
        {rows.flat().map((cell, i) => {
          const bad = /REF|ERR|\?\?|SUM|—/.test(cell)
          return (
            <span
              key={i}
              className={`truncate px-[1.2cqw] py-[1.3cqw] ${
                i < 4 ? 'bg-cloud font-bold text-ink/70' : bad ? 'bg-danger/10 font-semibold text-danger' : 'bg-white text-ink/70'
              }`}
            >
              {cell}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function AlertWindow() {
  const { t } = useI18n()
  const s = t.story.scene
  return (
    <div className={`p-[2.6cqw] ${card}`}>
      <div className="flex items-center gap-[1.6cqw]">
        <span className="grid size-[6cqw] place-items-center rounded-full bg-warn/15 text-warn">
          <TriangleAlert className="size-[3.4cqw]" strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <p className="text-[2.7cqw] font-bold text-ink">{s.notResponding}</p>
          <p className="text-[2.1cqw] text-muted">{s.invoiceDown}</p>
        </div>
      </div>
      <div className="mt-[2cqw] flex justify-end gap-[1.2cqw] text-[2cqw] font-semibold">
        <span className="rounded-[1cqw] bg-cloud px-[2cqw] py-[0.9cqw] text-ink/60">{s.wait}</span>
        <span className="rounded-[1cqw] bg-danger px-[2cqw] py-[0.9cqw] text-white">{s.close}</span>
      </div>
    </div>
  )
}

export function InboxCard() {
  const { t } = useI18n()
  const s = t.story.scene
  return (
    <div className={`p-[2.2cqw] ${card}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-[1.2cqw] text-[2.5cqw] font-bold text-ink">
          <Mail className="size-[3.2cqw] text-brand" strokeWidth={2.2} /> {s.inbox}
        </span>
        <span className="rounded-full bg-danger px-[1.4cqw] py-[0.3cqw] text-[2.1cqw] font-bold text-white">148</span>
      </div>
      {s.emails.map((line) => (
        <p key={line} className="mt-[1.3cqw] flex items-center gap-[1cqw] truncate text-[2cqw] font-semibold text-ink/70">
          <span className="size-[1.1cqw] shrink-0 rounded-full bg-brand" />
          {line}
        </p>
      ))}
    </div>
  )
}

export function StickyNote() {
  const { t } = useI18n()
  const [first, second] = t.story.scene.note
  return (
    <div className="rounded-[1cqw] bg-[#ffe98a] p-[2.2cqw] shadow-soft">
      <p className="font-display text-[2.5cqw] font-semibold italic leading-snug text-[#6b5400]">
        {first}
        <br />
        {second}
      </p>
    </div>
  )
}

export function MissedCalls() {
  const { t } = useI18n()
  const [count, calls] = t.story.scene.missed
  return (
    <div className={`flex items-center gap-[1.4cqw] p-[1.8cqw] ${card}`}>
      <span className="grid size-[5cqw] shrink-0 place-items-center rounded-full bg-danger/10 text-danger">
        <PhoneMissed className="size-[2.8cqw]" strokeWidth={2.4} />
      </span>
      <span className="text-[2.3cqw] font-bold leading-tight text-ink">
        {count}
        <br />
        <span className="font-semibold text-muted">{calls}</span>
      </span>
    </div>
  )
}

export function ChartDown() {
  const { t } = useI18n()
  return (
    <div className={`p-[2.2cqw] ${card}`}>
      <div className="flex items-center justify-between text-[2.2cqw] font-bold">
        <span className="text-ink/70">{t.story.scene.orders}</span>
        <span className="flex items-center gap-[0.6cqw] text-danger">
          <TrendingDown className="size-[2.8cqw]" strokeWidth={2.6} /> 18%
        </span>
      </div>
      <svg viewBox="0 0 100 34" className="mt-[1cqw] w-full">
        <path d="M0 6 L14 9 L26 7 L38 15 L52 13 L64 22 L78 20 L100 31" fill="none" stroke="#f04438" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function Bubble({ children, side = 'left', tone = 'light' }: { children: ReactNode; side?: 'left' | 'right'; tone?: 'light' | 'brand' }) {
  const brand = tone === 'brand'
  return (
    <div
      className={`relative rounded-[3cqw] px-[3cqw] py-[2.2cqw] text-[3cqw] font-semibold leading-snug shadow-lift ${
        brand ? 'bg-brand text-white' : 'border border-line bg-white text-ink'
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-[1.4cqw] size-[3cqw] rotate-45 ${side === 'left' ? 'left-[5cqw]' : 'right-[5cqw]'} ${
          brand ? 'bg-brand' : 'border-b border-r border-line bg-white'
        }`}
      />
    </div>
  )
}

export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className={`flex items-center gap-[1.6cqw] px-[2.2cqw] py-[1.8cqw] ${card}`}>
      <span className="grid size-[4.4cqw] shrink-0 place-items-center rounded-full bg-success text-[2.4cqw] font-bold text-white">✓</span>
      <span className="text-[2.4cqw] font-semibold leading-tight text-ink">{children}</span>
    </div>
  )
}

export function Chip({ icon, children, className = '' }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[1cqw] whitespace-nowrap rounded-full border border-line bg-white px-[2cqw] py-[1.1cqw] text-[2.3cqw] font-bold text-ink shadow-soft ${className}`}>
      {icon}
      {children}
    </span>
  )
}
