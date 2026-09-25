import { motion } from 'motion/react'
import { Clock, MapPin } from 'lucide-react'
import { site } from '../../config/site'
import { useI18n, useOffice } from '../../i18n'
import { useDubaiTime } from '../../hooks/useDubaiTime'
import { EASE, itemVariants, Reveal, SectionHeading, Stagger } from '../ui/motion'

/* Stylised Dubai skyline, left → right: Dubai Frame, Burj Al Arab, Emirates Towers,
   Burj Khalifa, Museum of the Future, Cayan Tower, Ain Dubai. */
const SKYLINE = [
  'M24 320V232h46v88',
  'M84 320V196h34v124',
  'M136 320V148h84v172M152 320V168h52v152',
  'M238 320V150h38v170M257 150v-22',
  'M288 320V186h28v134',
  'M342 320V92M342 104c50 24 82 110 76 216M342 150h44M342 204h62',
  'M452 320V122l32-32v230M500 320V152l28-26v194',
  'M548 320V168h34v152M594 320V206h30v114',
  'M676 320v-48h10v-46h9v-42h8v-40h7v-38h5V70h3V40l2-36 2 36v30h3v36h5v38h7v40h8v42h9v46h10v48',
  'M790 320V150l34-22v192M838 320V190h26v130',
  'M878 320v-10h100v10M888 256a40 52 0 1 0 80 0a40 52 0 1 0-80 0ZM918 250a16 26 0 1 0 32 0a16 26 0 1 0-32 0Z',
  'M1000 320c4-70-6-150 2-246h24c8 96-2 176 2 246',
  'M1046 320V176h36v144M1092 320V214h28v106',
  'M1140 188a96 96 0 1 0 192 0a96 96 0 1 0-192 0ZM1140 188h192M1236 92v192M1168.1 120.1l135.8 135.8M1168.1 255.9l135.8-135.8M1196 320l40-132 40 132',
  'M1352 320V240h40v80M1400 320V268h32v52',
]
const LIGHTS = [
  [720, 150], [712, 232], [728, 196], [470, 196], [512, 244], [1014, 150], [257, 206], [1236, 92],
  [1332, 188], [1140, 188], [178, 158], [100, 240], [806, 210], [560, 230], [1062, 240], [370, 250],
] as const

function Skyline() {
  const { t } = useI18n()
  return (
    <div className="relative mt-16 h-[190px] sm:mt-20 sm:h-[240px] lg:h-auto">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[140%] bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,rgb(176_131_63/0.16),rgb(0_119_252/0.06)_45%,transparent_75%)]" />
      <svg
        viewBox="0 0 1440 322"
        preserveAspectRatio="xMidYMax slice"
        className="relative size-full lg:h-auto"
        role="img"
        aria-label={t.dubai.skyline}
      >
        <defs>
          <linearGradient id="skyline-stroke" x1="0" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#03204f" />
            <stop offset="0.55" stopColor="#0077fc" />
            <stop offset="1" stopColor="#b0833f" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#skyline-stroke)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          {SKYLINE.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 2.2, delay: 0.1 + Math.abs(i - 8) * 0.12, ease: EASE }}
            />
          ))}
          <path d="M0 320H1440" vectorEffect="non-scaling-stroke" strokeOpacity="0.5" />
        </g>
        {LIGHTS.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.2"
            className="animate-twinkle"
            fill={i % 3 === 0 ? '#b0833f' : '#0077fc'}
            style={{ animationDelay: `${(i * 0.37) % 3}s` }}
          />
        ))}
        {/* aircraft warning light on the Burj Khalifa */}
        <circle cx="720" cy="5" r="3" fill="#ff4d4d" className="animate-twinkle [animation-duration:1.4s]" />
      </svg>
    </div>
  )
}

export function Dubai() {
  const { time, isOpen } = useDubaiTime()
  const { t, lang } = useI18n()
  const office = useOffice()
  const { accent } = t.dubai

  return (
    <section id="dubai" aria-labelledby="dubai-title" className="relative overflow-hidden pt-24 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-sand-soft to-sand-soft" />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <SectionHeading
              id="dubai-title"
              index="04"
              eyebrow={t.dubai.eyebrow}
              title={t.dubai.title}
              highlight={t.dubai.highlight}
            />
            <Reveal delay={0.1}>
              {/* the same line in the other language */}
              <p
                lang={accent.lang}
                dir={accent.dir}
                className={`mt-6 font-sans text-2xl font-semibold text-sand/90 sm:text-3xl ${lang === 'ar' ? 'text-right' : 'text-right lg:text-left'}`}
              >
                {accent.text}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t.dubai.lead}</p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-2 gap-3">
            <motion.div
              variants={itemVariants}
              className="col-span-2 rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-6"
            >
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-ink/50">
                <span className="flex items-center gap-2">
                  <Clock className="size-3.5" /> {t.dubai.time}
                </span>
                <span dir="ltr">UTC+4</span>
              </div>
              <p dir="ltr" className="mt-3 font-display text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl rtl:text-right" aria-live="off">
                {time}
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink/70">
                <span
                  className={`size-2 rounded-full ${
                    isOpen === null ? 'bg-ink/20' : isOpen ? 'animate-pulse-dot bg-success' : 'bg-sand'
                  }`}
                />
                {isOpen === null ? t.dubai.checking : isOpen ? t.dubai.open : t.dubai.closed}
              </p>
            </motion.div>
            <motion.a
              variants={itemVariants}
              href={site.contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl border border-line bg-white p-5 transition-colors hover:border-brand/40 sm:p-6"
            >
              <MapPin className="size-5 text-brand" />
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-ink/50">{t.dubai.coordinatesLabel}</p>
              <p dir="ltr" className="mt-1 font-display text-sm font-medium sm:text-base rtl:text-right">
                {t.dubai.coordinates}
              </p>
            </motion.a>
            <motion.div variants={itemVariants} className="rounded-3xl border border-line bg-white p-5 sm:p-6">
              <Clock className="size-5 text-brand" />
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-ink/50">{t.dubai.hoursLabel}</p>
              <p className="mt-1 font-display text-sm font-medium sm:text-base">{office.hours}</p>
            </motion.div>
          </Stagger>
        </div>

        <Stagger as="ul" className="mt-12 flex flex-wrap gap-2">
          <motion.li variants={itemVariants} className="me-2 flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
            {t.dubai.serving}
          </motion.li>
          {t.dubai.regions.map((r) => (
            <motion.li
              key={r}
              variants={itemVariants}
              className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] text-ink/75"
            >
              {r}
            </motion.li>
          ))}
        </Stagger>
      </div>

      <Skyline />
    </section>
  )
}
