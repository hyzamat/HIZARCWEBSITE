import { technologies } from '../../data/content'
import { useI18n } from '../../i18n'

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items]
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <ul
        className={`flex shrink-0 items-center gap-3 pr-3 will-change-transform hover:[animation-play-state:paused] sm:gap-4 sm:pr-4 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {loop.map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/70 sm:px-5 sm:py-2.5 sm:text-[15px]"
          >
            <span className="h-2.5 w-1.5 skew-y-[-30deg] rounded-[1px] bg-brand" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Marquee() {
  const { t } = useI18n()
  const half = Math.ceil(technologies.length / 2)
  return (
    <section aria-label={t.marquee.label} className="relative border-y border-line bg-mist py-6 sm:py-8">
      <p className="container-x mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/55">
        {t.marquee.title}
      </p>
      {/* the names are English, so the belt keeps running left even on the Arabic page */}
      <div dir="ltr" className="flex flex-col gap-3 sm:gap-4">
        <Row items={technologies.slice(0, half)} />
        <Row items={technologies.slice(half)} reverse />
      </div>
    </section>
  )
}
