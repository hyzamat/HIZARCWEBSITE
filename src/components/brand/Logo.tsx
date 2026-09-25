import wordmarkPath from './wordmark.txt?raw'
import { MARK_COLORS, MARK_PANELS, MARK_VIEWBOX, WORDMARK_VIEWBOX } from './geometry'

export { MARK_COLORS, MARK_PANELS, MARK_VIEWBOX, WORDMARK_VIEWBOX }

type Tone = keyof typeof MARK_COLORS

export function Mark({ className, tone = 'dark', title }: { className?: string; tone?: Tone; title?: string }) {
  const c = MARK_COLORS[tone]
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <polygon points={MARK_PANELS.pillar} fill={c.pillar} />
      <polygon points={MARK_PANELS.bar} fill={c.bar} />
      <polygon points={MARK_PANELS.fold} fill={c.fold} />
      <polygon points={MARK_PANELS.right} fill={c.right} />
    </svg>
  )
}

export const WORDMARK_PATH = wordmarkPath.trim()

/** "HIZARC" lettering — inherits the text colour. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox={WORDMARK_VIEWBOX} className={className} fill="currentColor" aria-hidden="true">
      <path d={WORDMARK_PATH} />
    </svg>
  )
}

/** Horizontal lock-up: mark + wordmark, proportioned like the original logo. */
export function Logo({ className = '', tone = 'dark' }: { className?: string; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center gap-[0.55em] ${className}`}>
      <Mark tone={tone} className="h-[1.9em] w-auto shrink-0" />
      <Wordmark className={`h-[0.95em] w-auto ${tone === 'dark' ? 'text-white' : 'text-navy'}`} />
      <span className="sr-only">HIZARC</span>
    </span>
  )
}
