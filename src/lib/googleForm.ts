/**
 * Connects the Contact form to a Google Form.
 * See `googleFormUrl` in src/config/site.ts and README.md for setup.
 */

export const FORM_FIELDS = ['name', 'email', 'phone', 'message'] as const
export type FormField = (typeof FORM_FIELDS)[number]
export type FormValues = Record<FormField, string>

export type FormMode =
  /** Branded on-site form → answers posted straight into the Google Form */
  | { kind: 'native'; action: string; entries: Partial<Record<FormField, string>> }
  /** Plain Google Form link → embed the form itself */
  | { kind: 'embed'; src: string; href: string }
  /** Any other link (e.g. forms.gle short link) → open it in a new tab */
  | { kind: 'link'; href: string }
  /** Nothing configured yet → open the visitor's email app */
  | { kind: 'email' }

export function resolveFormMode(raw: string): FormMode {
  const value = raw.trim()
  if (!value) return { kind: 'email' }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return { kind: 'email' }
  }

  const isGoogleForm = url.hostname === 'docs.google.com' && url.pathname.startsWith('/forms/')
  if (!isGoogleForm) return { kind: 'link', href: value }

  // The words typed into a "pre-filled link" tell us which question is which.
  const entries: Partial<Record<FormField, string>> = {}
  for (const [key, val] of url.searchParams) {
    if (!key.startsWith('entry.')) continue
    const field = val.trim().toLowerCase() as FormField
    if (FORM_FIELDS.includes(field)) entries[field] = key
  }

  const base = `${url.origin}${url.pathname.replace(/\/(viewform|formResponse|edit)\/?$/, '').replace(/\/$/, '')}`

  if (Object.keys(entries).length > 0) return { kind: 'native', action: `${base}/formResponse`, entries }
  return { kind: 'embed', src: `${base}/viewform?embedded=true`, href: `${base}/viewform` }
}

const LABELS: Record<FormField, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Contact number',
  message: 'Message',
}

export async function submitToGoogleForm(mode: Extract<FormMode, { kind: 'native' }>, values: FormValues) {
  const body = new URLSearchParams()

  // Anything without a matching question is appended to the message so nothing is lost.
  const extras = FORM_FIELDS.filter((f) => f !== 'message' && values[f] && !mode.entries[f]).map(
    (f) => `${LABELS[f]}: ${values[f]}`,
  )

  for (const field of FORM_FIELDS) {
    const entry = mode.entries[field]
    if (!entry) continue
    let v = values[field]
    if (field === 'message' && extras.length) v = `${v}\n\n${extras.join('\n')}`
    if (v) body.append(entry, v)
  }

  // Google Forms doesn't send CORS headers; an opaque response still means it was received.
  await fetch(mode.action, { method: 'POST', mode: 'no-cors', body })
}

export function buildMailto(email: string, values: FormValues) {
  const subject = `New project enquiry — ${values.name || 'Website'}`
  const lines = FORM_FIELDS.filter((f) => values[f]).map((f) =>
    f === 'message' ? `\n${values.message}` : `${LABELS[f]}: ${values[f]}`,
  )
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}
