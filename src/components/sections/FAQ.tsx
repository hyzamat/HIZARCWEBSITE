import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { whatsappLink } from '../../config/site'
import { useI18n } from '../../i18n'
import { EASE, itemVariants, Reveal, SectionHeading, Stagger } from '../ui/motion'

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <motion.div variants={itemVariants} className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-5 py-5 text-start sm:py-6"
        >
          <span className={`text-base font-semibold leading-snug transition-colors sm:text-xl ${open ? 'text-ink' : 'text-ink/80'}`}>
            {q}
          </span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`grid size-9 shrink-0 place-items-center rounded-full border transition-colors ${
              open ? 'border-brand bg-brand text-white' : 'border-line text-ink/70'
            }`}
          >
            <Plus className="size-4" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 pe-10 text-[15px] leading-relaxed text-muted sm:text-base">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { t } = useI18n()

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="faq-title"
            index="05"
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            highlight={t.faq.highlight}
            description={t.faq.description}
          />
          <Reveal delay={0.2}>
            <a
              href={whatsappLink(t.common.waQuestion)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand"
            >
              {t.faq.ask}
            </a>
          </Reveal>
        </div>

        <Stagger className="border-t border-line">
          {t.faq.items.map((f, i) => (
            <Item key={i} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </Stagger>
      </div>
    </section>
  )
}
