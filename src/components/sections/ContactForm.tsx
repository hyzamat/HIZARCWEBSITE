import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, LoaderCircle, Send } from 'lucide-react'
import { site, whatsappLink } from '../../config/site'
import { buildMailto, resolveFormMode, submitToGoogleForm, type FormValues } from '../../lib/googleForm'
import { SERVICE_EVENT } from './Services'
import { Button } from '../ui/Button'
import { EASE } from '../ui/motion'
import { WhatsAppIcon } from '../ui/icons'
import { useI18n } from '../../i18n'

const mode = resolveFormMode(site.googleFormUrl)
const EMPTY: FormValues = { name: '', email: '', phone: '', message: '' }

/** Which fields need fixing — the message itself comes from the current language. */
type Errors = Partial<Record<'name' | 'email' | 'message', boolean>>

export function ContactForm() {
  if (mode.kind === 'embed') return <EmbeddedForm src={mode.src} href={mode.href} />
  if (mode.kind === 'link') return <LinkCard href={mode.href} />
  return <EnquiryForm />
}

/** Frosted card on the navy section. */
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] backdrop-blur-sm xs:p-6 sm:rounded-[2rem] sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[radial-gradient(closest-side,rgb(61_155_255/0.25),transparent)]" />
      <div className="relative">{children}</div>
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-base text-white outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-white/45 hover:border-white/20 focus:border-[#4db0ff] focus:bg-white/[0.09] focus:ring-4 focus:ring-[#4db0ff]/20 aria-[invalid=true]:border-red-400/70'

function Field({ label, htmlFor, error, children, className = '' }: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="sr-only">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${htmlFor}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 ps-1 text-[13px] font-medium text-red-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function EnquiryForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useI18n()
  const f = t.form

  // "Discuss this service" buttons start the message for the visitor
  useEffect(() => {
    const onPick = (e: Event) => {
      const title = (e as CustomEvent<string>).detail
      setValues((v) => (v.message.trim() ? v : { ...v, message: t.services.interested(title) }))
    }
    window.addEventListener(SERVICE_EVENT, onPick)
    return () => window.removeEventListener(SERVICE_EVENT, onPick)
  }, [t])

  const set = (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key as keyof Errors]) setErrors((er) => ({ ...er, [key]: false }))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (values.name.trim().length < 2) e.name = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = true
    if (values.message.trim().length < 5) e.message = true
    return e
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    const firstInvalid = (['name', 'email', 'message'] as const).find((k) => found[k])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#cf-${firstInvalid}`)?.focus()
      return
    }

    const payload: FormValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    }

    if (mode.kind === 'native') {
      setStatus('sending')
      try {
        await submitToGoogleForm(mode, payload)
        setStatus('sent')
      } catch {
        setStatus('error')
      }
    } else {
      window.location.href = buildMailto(site.contact.emails.join(','), payload)
      setStatus('sent')
    }
  }

  const reset = () => {
    setValues(EMPTY)
    setStatus('idle')
  }

  return (
    <Card>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <Success key="done" name={values.name.split(' ')[0]} onReset={reset} />
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
            aria-label={f.label}
            className="grid gap-3.5 sm:grid-cols-2 sm:gap-4"
          >
            <Field label={f.name} htmlFor="cf-name" error={errors.name ? f.errors.name : undefined} className="sm:col-span-2">
              <input
                id="cf-name"
                name="name"
                autoComplete="name"
                enterKeyHint="next"
                className={`${inputCls} h-13`}
                placeholder={f.namePlaceholder}
                value={values.name}
                onChange={set('name')}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'cf-name-error' : undefined}
              />
            </Field>
            <Field label={f.email} htmlFor="cf-email" error={errors.email ? f.errors.email : undefined}>
              <input
                id="cf-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                dir="ltr"
                className={`${inputCls} h-13 rtl:text-right`}
                placeholder={f.emailPlaceholder}
                value={values.email}
                onChange={set('email')}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'cf-email-error' : undefined}
              />
            </Field>
            <Field label={f.phone} htmlFor="cf-phone">
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="next"
                dir="ltr"
                className={`${inputCls} h-13 rtl:text-right`}
                placeholder={f.phonePlaceholder}
                value={values.phone}
                onChange={set('phone')}
              />
            </Field>
            <Field label={f.message} htmlFor="cf-message" error={errors.message ? f.errors.message : undefined} className="sm:col-span-2">
              <textarea
                id="cf-message"
                name="message"
                rows={4}
                className={`${inputCls} resize-y py-3.5 leading-relaxed`}
                placeholder={f.messagePlaceholder}
                value={values.message}
                onChange={set('message')}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'cf-message-error' : undefined}
              />
            </Field>

            {status === 'error' && (
              <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">
                {f.failed}{' '}
                <a className="underline" href={whatsappLink(t.common.waHello)} target="_blank" rel="noopener noreferrer">
                  {t.common.whatsapp}
                </a>
                .
              </p>
            )}

            <div className="mt-1 flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:gap-5">
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileTap={{ scale: 0.97 }}
                className="group relative flex h-13 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#22b8ff] to-brand px-8 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgb(34_184_255/0.65)] transition-shadow hover:shadow-[0_14px_40px_-8px_rgb(34_184_255/0.8)] disabled:opacity-70"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {status === 'sending' ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" /> {f.sending}
                  </>
                ) : (
                  <>
                    {f.send}
                    <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                  </>
                )}
              </motion.button>
              <p className="text-center text-xs leading-relaxed text-white/55 sm:text-start">
                {mode.kind === 'email' ? f.opensEmail : f.replyTime}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  )
}

function Success({ name, onReset }: { name: string; onReset: () => void }) {
  const { t } = useI18n()
  const f = t.form
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex flex-col items-center py-8 text-center sm:py-10"
      role="status"
    >
      <svg viewBox="0 0 80 80" className="size-16">
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#4db0ff"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <motion.path
          d="M25 41l10 10 20-22"
          fill="none"
          stroke="#34d399"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        />
      </svg>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">{f.thanks(name)}</h3>
      <p className="mt-2 max-w-sm text-white/70">
        {mode.kind === 'email' ? f.sentEmail : f.sent}
      </p>
      <div className="mt-7 flex flex-col items-center gap-2 xs:flex-row">
        <a
          href={whatsappLink(t.common.waHello)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
        >
          <WhatsAppIcon className="size-4 text-[#25D366]" /> {f.urgent}
        </a>
        <button type="button" onClick={onReset} className="h-12 rounded-full px-5 text-sm font-semibold text-white/60 hover:text-white">
          {f.another}
        </button>
      </div>
    </motion.div>
  )
}

function EmbeddedForm({ src, href }: { src: string; href: string }) {
  const [loaded, setLoaded] = useState(false)
  const { t } = useI18n()
  return (
    <Card>
      <div className="relative overflow-hidden rounded-2xl bg-white">
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-white/5">
            <LoaderCircle className="size-6 animate-spin text-[#4db0ff]" />
          </div>
        )}
        <iframe
          src={src}
          title={t.form.embedTitle}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="block h-[900px] w-full"
        />
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6cc2ff] hover:text-white"
      >
        {t.form.openInTab} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
      </a>
    </Card>
  )
}

function LinkCard({ href }: { href: string }) {
  const { t } = useI18n()
  return (
    <Card>
      <p className="text-white/75">{t.form.linkIntro}</p>
      <Button href={href} external className="mt-6 w-full sm:w-auto">
        {t.form.openForm}
      </Button>
    </Card>
  )
}
