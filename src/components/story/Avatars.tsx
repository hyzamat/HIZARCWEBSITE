import { motion, useTransform, type MotionValue } from 'motion/react'
import { MARK_COLORS, MARK_PANELS, MARK_VIEWBOX } from '../brand/geometry'

const EYE = '#1b1f2a'
const LINE = '#d5deea'

/** Brows, mouth, sweat and blush all follow `mood`: 0 = stressed, 1 = delighted. */
function useFace(mood: MotionValue<number>) {
  return {
    mouth: useTransform(mood, [0, 0.5, 1], ['M53 74.5 Q60 69.5 67 74.5', 'M53.5 72.5 Q60 73.5 66.5 72.5', 'M51.5 70.5 Q60 80 68.5 70.5']),
    browL: useTransform(mood, [0, 1], ['M45.5 51.5 Q51 49.5 56 46', 'M46 48.5 Q51 45.5 56 47.5']),
    browR: useTransform(mood, [0, 1], ['M64 46 Q69 49.5 74.5 51.5', 'M64 47.5 Q69 45.5 74 48.5']),
    sweat: useTransform(mood, [0, 0.35], [1, 0]),
    blush: useTransform(mood, [0.55, 1], [0, 0.5]),
  }
}

/** Dubai business owner in kandura and ghutra. */
export function Client({ mood, className }: { mood: MotionValue<number>; className?: string }) {
  const f = useFace(mood)
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      {/* ghutra falling to the shoulders */}
      <path
        d="M31 50 C31 25 45 15 60 15 C75 15 89 25 89 50 L97 108 C86 101 78 98 73 96 L47 96 C42 98 34 101 23 108 Z"
        fill="#fff"
        stroke={LINE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* kandura */}
      <path d="M6 140 C9 114 28 101 60 100 C92 101 111 114 114 140 Z" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <path d="M51 82 H69 V99 Q60 104 51 99 Z" fill="#b57651" />
      <path d="M60 103 V128" stroke="#e3e9f2" strokeWidth="3" strokeLinecap="round" />
      {/* face */}
      <ellipse cx="60" cy="59" rx="19" ry="23" fill="#c98b5f" />
      <path d="M41.5 62 C43 80 51 88 60 88 C69 88 77 80 78.5 62 C76 73 70 79 60 79 C50 79 44 73 41.5 62 Z" fill="#2b1e16" />
      <path d="M53 68.8 Q60 65.6 67 68.8 Q60 70.4 53 68.8 Z" fill="#2b1e16" />
      <circle cx="52.5" cy="57" r="2.3" fill={EYE} />
      <circle cx="67.5" cy="57" r="2.3" fill={EYE} />
      <motion.circle cx="46" cy="66" r="3.6" fill="#ff7b6b" style={{ opacity: f.blush }} />
      <motion.circle cx="74" cy="66" r="3.6" fill="#ff7b6b" style={{ opacity: f.blush }} />
      <motion.path d={f.browL} stroke="#2b1e16" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <motion.path d={f.browR} stroke="#2b1e16" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <motion.path d={f.mouth} stroke="#6b2d1f" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      {/* ghutra over the forehead + agal */}
      <path
        d="M38.5 52 C37 29 47 20 60 20 C73 20 83 29 81.5 52 C77 41 70 36.5 60 36.5 C50 36.5 43 41 38.5 52 Z"
        fill="#fff"
        stroke={LINE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M41 33 C47 25.5 73 25.5 79 33" stroke={EYE} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M43 28.5 C49 21.5 71 21.5 77 28.5" stroke={EYE} strokeWidth="3" fill="none" strokeLinecap="round" />
      <motion.path d="M84 38 C87 43 87 46 84 47.5 C81 46 81 43 84 38 Z" fill="#6cb8ff" style={{ opacity: f.sweat }} />
    </svg>
  )
}

/** HIZARC consultant — always glad to help. */
export function Consultant({ className }: { className?: string }) {
  const c = MARK_COLORS.light
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <path d="M35 60 C33 31 46 18 61 18 C77 18 88 31 86 60 C85 74 83 84 79 90 L42 90 C38 84 35.5 73 35 60 Z" fill="#3a2317" />
      {/* blazer + shirt */}
      <path d="M8 140 C10 114 30 102 60 101 C90 102 110 114 112 140 Z" fill="#0a2a66" />
      <path d="M49 101 L60 122 L71 101 Z" fill="#fff" />
      <path d="M49 101 L57 119 L51 124 L43 105 Z" fill="#061d4d" />
      <path d="M71 101 L63 119 L69 124 L77 105 Z" fill="#061d4d" />
      <path d="M52 83 H68 V100 Q60 105 52 100 Z" fill="#d9a07c" />
      {/* face */}
      <ellipse cx="60" cy="59" rx="18" ry="22" fill="#eab896" />
      <circle cx="52.5" cy="58" r="2.2" fill={EYE} />
      <circle cx="67.5" cy="58" r="2.2" fill={EYE} />
      <circle cx="47" cy="66.5" r="3.4" fill="#ff8a7a" opacity="0.45" />
      <circle cx="73" cy="66.5" r="3.4" fill="#ff8a7a" opacity="0.45" />
      <path d="M47 50 Q51.5 47 56 49" stroke="#3a2317" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M64 49 Q68.5 47 73 50" stroke="#3a2317" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M52.5 70.5 Q60 78.5 67.5 70.5" stroke="#9c3d33" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M40.5 55 C39 34 50 25 62 25 C75 25 83 35 80.5 52 C74 41 64 37 54 41.5 C48 44 43.5 49 40.5 55 Z" fill="#3a2317" />
      {/* lanyard + HIZARC badge */}
      <path d="M53 102 L73 117 M67 102 L77 116" stroke="#0077fc" strokeWidth="2" strokeLinecap="round" />
      <rect x="68" y="114" width="20" height="15" rx="3" fill="#fff" />
      <svg x="73" y="116" width="10" height="11" viewBox={MARK_VIEWBOX}>
        <polygon points={MARK_PANELS.pillar} fill={c.pillar} />
        <polygon points={MARK_PANELS.bar} fill={c.bar} />
        <polygon points={MARK_PANELS.fold} fill={c.fold} />
        <polygon points={MARK_PANELS.right} fill={c.right} />
      </svg>
    </svg>
  )
}
