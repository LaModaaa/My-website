import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import { ContactButton } from '../components/Buttons'
import { HERO_PORTRAIT, NAV } from '../data'

export default function HeroSection() {
  return (
    <section id="top" className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} className="relative z-20 flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {NAV.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[11.4vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[11.6vw] md:-mt-3 md:text-[11.8vw] lg:text-[12vw]"
        >
          Привет, я&nbsp;Егор
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          веб-разработчик, который делает яркие сайты, приводящие клиентов
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Обёртка отвечает за позицию, FadeIn внутри — за анимацию: так transform-ы не конфликтуют */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
            <img src={HERO_PORTRAIT} alt="Егор" className="block w-full select-none" draggable={false} />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  )
}
