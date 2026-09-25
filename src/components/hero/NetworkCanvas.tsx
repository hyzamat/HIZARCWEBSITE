import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number; vx: number; vy: number; r: number }

/**
 * Lightweight animated "network" of connected nodes that reacts to cursor / touch.
 * Scales node count to screen size, caps pixel ratio on phones and pauses when off-screen.
 */
export function NetworkCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dots: Dot[] = []
    let raf = 0
    let visible = true
    const pointer = { x: -1e4, y: -1e4 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(120, Math.max(30, (w * h) / 12000)))
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.3 + 0.5,
      }))
    }

    const frame = () => {
      const link = w < 768 ? 92 : 135
      const link2 = link * link
      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < -10) d.x = w + 10
        else if (d.x > w + 10) d.x = -10
        if (d.y < -10) d.y = h + 10
        else if (d.y > h + 10) d.y = -10
        // gentle pull towards the pointer
        const px = pointer.x - d.x
        const py = pointer.y - d.y
        const pd = px * px + py * py
        if (pd < 32000) {
          d.x += px * 0.004
          d.y += py * 0.004
        }
      }

      ctx.lineWidth = 0.7
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i]
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = dx * dx + dy * dy
          if (dist < link2) {
            ctx.strokeStyle = `rgba(0,119,252,${(1 - Math.sqrt(dist) / link) * 0.22})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const px = pointer.x - a.x
        const py = pointer.y - a.y
        const pd = Math.sqrt(px * px + py * py)
        if (pd < 190) {
          ctx.strokeStyle = `rgba(0,119,252,${(1 - pd / 190) * 0.45})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }
      }

      for (const d of dots) {
        ctx.fillStyle = 'rgba(3,32,79,0.35)'
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduce && visible) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(frame)
    }

    const setPointer = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = x - rect.left
      pointer.y = y - rect.top
    }
    const onPointer = (e: PointerEvent) => setPointer(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => e.touches[0] && setPointer(e.touches[0].clientX, e.touches[0].clientY)
    const clear = () => {
      pointer.x = -1e4
      pointer.y = -1e4
    }

    resize()
    start()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === 'visible'
      if (visible) start()
    })
    io.observe(canvas)
    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) start()
    }

    let resizeTimer = 0
    let lastWidth = window.innerWidth
    const onResize = () => {
      // ignore mobile address-bar height changes
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        resize()
        start()
      }, 150)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', clear, { passive: true })
    document.addEventListener('pointerleave', clear)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', clear)
      document.removeEventListener('pointerleave', clear)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden="true" />
}
