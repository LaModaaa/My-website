import { useEffect, useRef, type ReactNode } from 'react'

type MagnetProps = {
  children: ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

// «Магнит»: когда курсор подходит ближе чем на padding пикселей к краю элемента,
// элемент тянется за курсором. strength — делитель: чем больше, тем слабее тяга.
export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = false

    const onMove = (e: MouseEvent) => {
      const outer = outerRef.current
      const inner = innerRef.current
      if (!outer || !inner) return

      const { left, top, width, height } = outer.getBoundingClientRect()
      const cx = left + width / 2
      const cy = top + height / 2
      const near =
        Math.abs(cx - e.clientX) < width / 2 + padding &&
        Math.abs(cy - e.clientY) < height / 2 + padding

      if (near) {
        active = true
        inner.style.transition = activeTransition
        inner.style.transform = `translate3d(${(e.clientX - cx) / strength}px, ${(e.clientY - cy) / strength}px, 0)`
      } else if (active) {
        active = false
        inner.style.transition = inactiveTransition
        inner.style.transform = 'translate3d(0, 0, 0)'
      }
    }

    // Меняем стиль напрямую, без setState — так нет лишних перерисовок React
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [padding, strength, activeTransition, inactiveTransition])

  return (
    <div ref={outerRef} className={className} style={{ position: 'relative' }}>
      <div
        ref={innerRef}
        style={{ transform: 'translate3d(0, 0, 0)', transition: inactiveTransition, willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  )
}
