import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import FadeIn from '../components/FadeIn'
import { LiveProjectButton } from '../components/Buttons'
import { PROJECTS, type Project } from '../data'

const RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  // progress идёт от 0 до 1, пока блок с карточками проезжает по экрану
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const total = PROJECTS.length

  return (
    <section
      id="projects"
      className={`relative z-20 -mt-10 bg-[#0C0C0C] px-5 pb-10 pt-20 sm:-mt-12 sm:px-8 sm:pt-24 md:-mt-14 md:px-10 md:pt-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`}
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-14 md:mb-20"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Проекты
      </FadeIn>

      <div ref={containerRef} className="mx-auto max-w-6xl">
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.name}
            index={i}
            project={project}
            progress={scrollYProgress}
            range={[i / total, 1]}
            targetScale={1 - (total - 1 - i) * 0.03}
          />
        ))}
      </div>
    </section>
  )
}

type CardProps = {
  index: number
  project: Project
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}

function ProjectCard({ index, project, progress, range, targetScale }: CardProps) {
  // Карточка плавно уменьшается, когда на неё «наезжает» следующая
  const scale = useTransform(progress, range, [1, targetScale])
  const [img1, img2, img3] = project.images

  return (
    <div className="sticky top-24 h-[85vh] md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px` }}
        className={`relative origin-top border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${RADIUS}`}
      >
        <div className="flex flex-col gap-4 px-2 pt-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:px-4">
          <div className="flex items-end gap-4 sm:gap-6">
            <span className="hero-heading shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1 pb-1 md:pb-3">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">{project.category}</span>
              <h3 className="font-medium uppercase leading-tight text-[#D7E2EA]" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.1rem)' }}>
                {project.name}
              </h3>
              <p className="hidden max-w-md text-sm font-light leading-snug text-[#D7E2EA]/60 md:block">{project.description}</p>
            </div>
          </div>
          <div className="sm:pb-1 md:pb-3">
            <LiveProjectButton href={project.url} />
          </div>
        </div>

        <div className="mt-4 flex gap-3 sm:mt-6 md:mt-8">
          <div className="flex w-[40%] flex-col gap-3">
            <img src={img1} alt={`${project.name} – первый экран`} loading="lazy" className={`w-full object-cover object-top ${RADIUS}`} style={{ height: 'min(clamp(130px, 16vw, 230px), 22vh)' }} />
            <img src={img2} alt={`${project.name} – раздел сайта`} loading="lazy" className={`w-full object-cover object-top ${RADIUS}`} style={{ height: 'min(clamp(160px, 22vw, 340px), 30vh)' }} />
          </div>
          <div className="w-[60%]">
            <img src={img3} alt={`${project.name} – мобильная версия`} loading="lazy" className={`h-full w-full object-cover ${RADIUS}`} />
          </div>
        </div>
      </motion.article>
    </div>
  )
}
