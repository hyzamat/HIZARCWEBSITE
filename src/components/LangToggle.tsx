import { useI18n, type Lang } from '../i18n'

const OPTIONS: { lang: Lang; label: string }[] = [
  { lang: 'en', label: 'EN' },
  { lang: 'ar', label: 'عربي' },
]

/** EN | عربي switch — flips the whole site instantly, no reload. Always reads left → right. */
export function LangToggle() {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t.common.language}
      dir="ltr"
      className="relative z-10 grid h-11 grid-cols-2 rounded-xl bg-ink/[0.05] p-1 text-[13px] font-semibold"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-soft ring-1 ring-line transition-transform duration-300 ease-out-expo ${
          lang === 'ar' ? 'translate-x-full' : ''
        }`}
      />
      {OPTIONS.map((o) => (
        <button
          key={o.lang}
          type="button"
          lang={o.lang}
          onClick={() => setLang(o.lang)}
          aria-pressed={lang === o.lang}
          className={`relative min-w-11 rounded-lg px-2 transition-colors ${
            lang === o.lang ? 'text-brand' : 'text-ink/55 hover:text-ink active:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
