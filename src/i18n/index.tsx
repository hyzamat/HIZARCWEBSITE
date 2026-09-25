import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { en, type Dict } from './en'
import { ar } from './ar'
import { site } from '../config/site'

export type Lang = 'en' | 'ar'
export type { Dict }

const DICTS: Record<Lang, Dict> = { en, ar }
export const LANG_KEY = 'hz-lang'

type I18n = { lang: Lang; dir: 'ltr' | 'rtl'; t: Dict; setLang: (lang: Lang) => void }

const I18nContext = createContext<I18n>({ lang: 'en', dir: 'ltr', t: en, setLang: () => {} })

/** Words for the current language: `const { t } = useI18n()` → `t.hero.title`. */
export const useI18n = () => useContext(I18nContext)

/** Office address and hours from src/config/site.ts, in the current language. */
export function useOffice() {
  const { lang } = useI18n()
  const c = site.contact
  return lang === 'ar' ? { address: c.addressAr, hours: c.hoursAr } : { address: c.address, hours: c.hours }
}

/** `?lang=ar` in the link wins, then the visitor's last choice. index.html runs the same check. */
function savedLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl
    return localStorage.getItem(LANG_KEY) === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

/** The section at the top of the screen, so switching language doesn't lose the visitor's place. */
function topSection() {
  const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.3)?.closest('section, footer')
  return el ? { el, top: el.getBoundingClientRect().top } : null
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start in English so the pre-rendered page and the first render match; a saved choice applies right after.
  const [lang, setLangState] = useState<Lang>('en')
  const anchor = useRef<ReturnType<typeof topSection>>(null)

  useLayoutEffect(() => {
    const saved = savedLang()
    if (saved !== 'en') setLangState(saved)
  }, [])

  useLayoutEffect(() => {
    const t = DICTS[lang]
    const root = document.documentElement
    root.lang = lang === 'ar' ? 'ar-AE' : 'en-AE'
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    root.classList.remove('lang-pending')
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)

    const a = anchor.current
    anchor.current = null
    if (a) {
      const shift = a.el.getBoundingClientRect().top - a.top
      if (Math.abs(shift) > 1) window.scrollTo({ top: window.scrollY + shift, behavior: 'instant' })
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    anchor.current = topSection()
    setLangState(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* private mode */
    }
  }, [])

  const value = useMemo<I18n>(() => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', t: DICTS[lang], setLang }), [lang, setLang])

  return <I18nContext value={value}>{children}</I18nContext>
}
