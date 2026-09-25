import { useEffect } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { MARK_PANELS, MARK_VIEWBOX } from '../brand/Logo'
import { EASE } from '../ui/motion'

const layers = [
  { id: 'right', points: MARK_PANELS.right, z: 10, from: '#3d9bff', to: '#0066dd', dx: 70, dy: -20 },
  { id: 'pillar', points: MARK_PANELS.pillar, z: 45, from: '#0b3474', to: '#03204f', dx: -70, dy: 20 },
  { id: 'fold', points: MARK_PANELS.fold, z: 60, from: '#062a66', to: '#03204f', dx: 30, dy: 40 },
  { id: 'bar', points: MARK_PANELS.bar, z: 95, from: '#4aa3ff', to: '#0077fc', dx: -10, dy: 60 },
] as const

/**
 * The HIZARC "H" as floating 3D layers.
 * Desktop: tilts towards the cursor. Touch: gently sways by itself.
 * Scrolling the hero pulls the layers apart.
 */
export function HeroMark({ play, spread }: { play: boolean; spread: MotionValue<number> }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 60, damping: 16 })
  const rotateY = useSpring(ry, { stiffness: 60, damping: 16 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const onMove = (e: PointerEvent) => {
        ry.set((e.clientX / window.innerWidth - 0.5) * 30)
        rx.set((e.clientY / window.innerHeight - 0.5) * -20)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    }
    const a = animate(ry, [-16, 16], { duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    const b = animate(rx, [10, -8], { duration: 5.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    return () => {
      a.stop()
      b.stop()
    }
  }, [rx, ry])

  return (
    <motion.div
      className="relative aspect-[792/870] w-full [perspective:1100px]"
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={play ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
    >
      {/* glow */}
      <div className="absolute inset-[-35%] rounded-full bg-[radial-gradient(closest-side,rgb(0_119_252/0.22),rgb(0_119_252/0.05)_55%,transparent)]" />

      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX, rotateY }}>
        {/* orbit rings */}
        <div className="absolute inset-[-14%] [transform-style:preserve-3d] [transform:rotateX(74deg)_translateZ(-40px)]">
          <div className="absolute inset-0 animate-spin rounded-full border border-brand/25 [animation-duration:22s]">
            <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_14px_3px_rgb(0_119_252/0.5)]" />
          </div>
        </div>
        <div className="absolute inset-[-2%] [transform-style:preserve-3d] [transform:rotateX(74deg)_rotateY(18deg)_translateZ(-20px)]">
          <div className="absolute inset-0 animate-spin rounded-full border border-dashed border-navy/15 [animation-direction:reverse] [animation-duration:30s]">
            <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-navy shadow-[0_0_10px_2px_rgb(3_32_79/0.35)]" />
          </div>
        </div>

        {layers.map((l) => (
          <Layer key={l.id} layer={l} spread={spread} />
        ))}
      </motion.div>
    </motion.div>
  )
}

function Layer({ layer, spread }: { layer: (typeof layers)[number]; spread: MotionValue<number> }) {
  const x = useTransform(spread, [0, 1], [0, layer.dx])
  const y = useTransform(spread, [0, 1], [0, layer.dy])
  const z = useTransform(spread, [0, 1], [layer.z, layer.z * 2.2])
  const gid = `hm-${layer.id}`

  return (
    <motion.svg
      viewBox={MARK_VIEWBOX}
      className="absolute inset-0 size-full overflow-visible"
      style={{ x, y, z }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={layer.from} />
          <stop offset="1" stopColor={layer.to} />
        </linearGradient>
      </defs>
      <polygon points={layer.points} fill={`url(#${gid})`} />
    </motion.svg>
  )
}
