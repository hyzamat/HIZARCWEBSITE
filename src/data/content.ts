import {
  AppWindow,
  Building2,
  Cpu,
  Gamepad2,
  GraduationCap,
  Headset,
  HeartPulse,
  Hotel,
  Landmark,
  Layers,
  Lock,
  MonitorSmartphone,
  Network,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Truck,
  Handshake,
  Zap,
} from 'lucide-react'

/*
 * The order and icons of each list. The words themselves live in
 * src/i18n/en.ts (English) and src/i18n/ar.ts (Arabic).
 */

export const navLinks = [
  { id: 'story', href: '#story' },
  { id: 'services', href: '#services' },
  { id: 'why', href: '#why' },
  { id: 'dubai', href: '#dubai' },
  { id: 'faq', href: '#faq' },
] as const

export const services = [
  { id: 'web-apps', icon: AppWindow },
  { id: 'software', icon: Cpu },
  { id: 'websites', icon: MonitorSmartphone },
  { id: 'it-support', icon: Headset },
  { id: 'marketing', icon: TrendingUp },
  { id: 'games', icon: Gamepad2 },
  { id: 'infrastructure', icon: Network },
  { id: 'security', icon: ShieldCheck },
] as const

export type ServiceId = (typeof services)[number]['id']

export const technologies = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'Python', '.NET', 'Flutter', 'Swift', 'Kotlin', 'Laravel',
  'Unity', 'Unreal Engine', 'AWS', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Cisco',
  'Fortinet', 'Microsoft 365', 'Shopify', 'WordPress', 'Figma', 'Google Ads', 'Meta Ads', 'PostgreSQL',
]

/** Commitments shown as big numbers — edit to match your own service levels (labels are in the i18n files). */
export const stats = [{ value: 24 }, { value: 1 }, { value: 100 }, { value: 8 }]

export const reasons = [
  { id: 'partner', icon: Layers },
  { id: 'speed', icon: Zap },
  { id: 'secure', icon: Lock },
  { id: 'local', icon: Handshake },
] as const

export const industries = [
  { id: 'realEstate', icon: Building2 },
  { id: 'hospitality', icon: Hotel },
  { id: 'retail', icon: ShoppingBag },
  { id: 'logistics', icon: Truck },
  { id: 'healthcare', icon: HeartPulse },
  { id: 'finance', icon: Landmark },
  { id: 'education', icon: GraduationCap },
  { id: 'startups', icon: Rocket },
] as const
