import { motion } from 'framer-motion'
import type { CSSProperties, ComponentType, ReactNode } from 'react'

type Tag = keyof HTMLElementTagNameMap

type FadeInProps = {
  children?: ReactNode
  as?: Tag
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: CSSProperties
  id?: string
}

// motion.create() делает «анимируемую» версию любого тега.
// Кэшируем, чтобы не создавать новый компонент на каждый рендер.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<Tag, ComponentType<any>>()
function getMotion(tag: Tag) {
  if (!cache.has(tag)) cache.set(tag, motion.create(tag))
  return cache.get(tag)!
}

export default function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  id,
}: FadeInProps) {
  const Comp = getMotion(as)
  return (
    <Comp
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Comp>
  )
}
