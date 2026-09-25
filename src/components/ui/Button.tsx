import { useRef, type ReactNode } from 'react'
import { motion, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 }

type Props = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'light'
  size?: 'md' | 'lg'
  icon?: ReactNode | false
  className?: string
  external?: boolean
  onClick?: () => void
}

const styles = {
  primary:
    'bg-brand text-white shadow-brand hover:bg-[#0069e0] hover:shadow-[0_16px_40px_-10px_rgb(0_119_252/0.6)]',
  ghost: 'border border-line bg-white text-ink shadow-soft hover:border-sky-2 hover:bg-sky/60',
  light: 'bg-white text-ink shadow-soft hover:bg-sky',
}

/** Pill button with a magnetic pull on desktop and a press effect on touch. */
export function Button({ href, children, variant = 'primary', size = 'lg', icon, className = '', external, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.22)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const iconEl =
    icon === false ? null : (
      <span
        className={`relative grid size-7 place-items-center overflow-hidden rounded-full rtl:-scale-x-100 ${
          variant === 'primary' ? 'bg-white/20' : 'bg-sky text-brand'
        }`}
      >
        {icon ?? (
          <>
            <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-6 group-hover:translate-x-6" />
            <ArrowUpRight className="absolute size-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
          </>
        )}
      </span>
    )

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex select-none items-center justify-center gap-3 overflow-hidden rounded-full font-semibold transition-[background-color,border-color,box-shadow] duration-300 ${
        size === 'lg' ? 'h-14 pe-3.5 ps-6 text-[15px]' : 'h-11 pe-2.5 ps-5 text-sm'
      } ${icon === false ? (size === 'lg' ? 'pe-6' : 'pe-5') : ''} ${styles[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full" />
      )}
      <span className="relative">{children}</span>
      {iconEl}
    </motion.a>
  )
}
