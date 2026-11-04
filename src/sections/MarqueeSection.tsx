import { useEffect, useRef, useState } from 'react'
import { MARQUEE_ROW_1, MARQUEE_ROW_2 } from '../data'

// Две ленты скриншотов: при прокрутке страницы верхняя едет вправо, нижняя — влево
export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const sectionTop = el.getBoundingClientRect().top + window.scrollY
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const row1 = [...MARQUEE_ROW_1, ...MARQUEE_ROW_1, ...MARQUEE_ROW_1]
  const row2 = [...MARQUEE_ROW_2, ...MARQUEE_ROW_2, ...MARQUEE_ROW_2]

  return (
    <section ref={sectionRef} className="flex flex-col gap-3 overflow-hidden pb-10 pt-24 sm:pt-32 md:pt-40" style={{ background: '#0C0C0C' }}>
      <Row images={row1} transform={`translateX(${offset - 200}px)`} />
      <Row images={row2} transform={`translateX(${-(offset - 200)}px)`} />
    </section>
  )
}

// Лента утроена и отцентрована: она шире экрана в разы, поэтому края никогда не видны
function Row({ images, transform }: { images: string[]; transform: string }) {
  return (
    <div className="flex w-max gap-3 self-center" style={{ transform, willChange: 'transform' }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
        />
      ))}
    </div>
  )
}
