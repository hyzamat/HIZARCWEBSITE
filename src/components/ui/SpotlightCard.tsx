import type { ReactNode } from 'react'

/** Card with a soft glow that follows the cursor — or your finger on touch screens. */
export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
    el.style.setProperty('--spot', '1')
  }
  const leave = (e: React.PointerEvent<HTMLDivElement>) => e.currentTarget.style.setProperty('--spot', '0')

  return (
    <div
      onPointerMove={move}
      onPointerDown={move}
      onPointerLeave={leave}
      onPointerUp={(e) => e.pointerType !== 'mouse' && leave(e)}
      className={`spotlight rounded-3xl border border-line bg-white shadow-soft transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-sky-2 hover:shadow-lift ${className}`}
    >
      {children}
    </div>
  )
}
