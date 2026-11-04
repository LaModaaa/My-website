import { ArrowUpRight, MessageCircle, Send } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { CONTACTS } from '../data'

const LINKS = [
  { ...CONTACTS.telegram, Icon: Send },
  { ...CONTACTS.vk, Icon: MessageCircle },
]

export default function ContactSection() {
  return (
    <section id="contact" className="relative z-10 bg-[#0C0C0C] px-5 pb-10 pt-24 sm:px-8 sm:pt-32 md:px-10 md:pt-40">
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-6 text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Контакты
      </FadeIn>
      <FadeIn
        as="p"
        delay={0.1}
        y={20}
        className="mx-auto mb-14 max-w-[480px] text-center font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:mb-20"
        style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.2rem)' }}
      >
        Напишите в Telegram или ВКонтакте – обсудим вашу идею и посчитаем стоимость сайта
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {LINKS.map(({ label, handle, url, Icon }, i) => (
          <FadeIn key={url} delay={0.15 + i * 0.1}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 border-b border-[#D7E2EA]/15 py-6 text-[#D7E2EA] transition-colors duration-300 hover:text-white sm:py-8 md:py-10"
              style={{ borderTop: i === 0 ? '1px solid rgba(215, 226, 234, 0.15)' : undefined }}
            >
              <span className="flex items-center gap-4 sm:gap-6">
                <Icon className="h-6 w-6 shrink-0 opacity-60 sm:h-8 sm:w-8" strokeWidth={1.5} />
                <span className="flex flex-col">
                  <span className="text-xs font-light uppercase tracking-widest opacity-60 sm:text-sm">{label}</span>
                  <span className="font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(1.6rem, 6vw, 5rem)' }}>
                    {handle}
                  </span>
                </span>
              </span>
              <ArrowUpRight
                className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-12 sm:w-12"
                strokeWidth={1.5}
              />
            </a>
          </FadeIn>
        ))}
      </div>

      <div className="mx-auto mt-20 flex max-w-5xl flex-col items-center justify-between gap-3 text-xs font-light uppercase tracking-widest text-[#D7E2EA]/40 sm:flex-row sm:text-sm">
        <span>© {new Date().getFullYear()} Егор · сайты для бизнеса</span>
        <a href="#top" className="transition-opacity duration-200 hover:opacity-70">Наверх ↑</a>
      </div>
    </section>
  )
}
