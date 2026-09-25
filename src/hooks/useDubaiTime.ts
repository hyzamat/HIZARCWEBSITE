import { useEffect, useState } from 'react'

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Dubai',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})
const partsFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dubai', weekday: 'short', hour: 'numeric', hour12: false })

/** Live Dubai (GST, UTC+4) clock. `null` until mounted so server and client markup match. */
export function useDubaiTime() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (!now) return { time: '--:--:--', isOpen: null as boolean | null }

  const parts = partsFmt.formatToParts(now)
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? ''
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24
  // UAE working week: Monday – Friday
  const isOpen = !['Sat', 'Sun'].includes(weekday) && hour >= 9 && hour < 18

  return { time: timeFmt.format(now), isOpen }
}
