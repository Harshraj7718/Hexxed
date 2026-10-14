import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
export const seg = (p: number, a: number, b: number) => cl((p - a) / (b - a))
export const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/** Scroll progress (0–1) of a tall sticky section: 0 when its top hits the viewport top,
 *  1 when its bottom reaches the viewport bottom. */
export function sectionProgress(el: HTMLElement | null) {
  if (!el) return 0
  const r = el.getBoundingClientRect()
  return cl(-r.top / Math.max(1, r.height - innerHeight))
}

/** Run `cb` every animation frame while mounted. The latest `cb` is always used. */
export function useFrame(cb: (now: number) => void) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => {
    let raf = 0
    const tick = (now: number) => { raf = requestAnimationFrame(tick); ref.current(now) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
}

let revealIO: IntersectionObserver | null = null
const revealIn = () => (revealIO ??= new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return
  const el = en.target as HTMLElement
  el.dataset.in = ''
  revealIO!.unobserve(el)
  el.dispatchEvent(new CustomEvent('hx:reveal'))
}), { threshold: 0.12 }))

type RevealProps = { delay?: number; className?: string; style?: CSSProperties; children?: ReactNode; as?: 'div' | 'nav' }

/** Fades and rises its content in once, the first time it scrolls into view. */
export function Reveal({ delay = 0, className = '', style, children, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    revealIn().observe(el)
    return () => revealIn().unobserve(el)
  }, [])
  return (
    <Tag ref={ref as never} className={('reveal ' + className).trim()} style={{ transitionDelay: delay + 'ms', ...style }}>
      {children}
    </Tag>
  )
}

/** Counts up from 0 to `to` when the enclosing <Reveal> comes into view. Shows `initial` before then. */
export function CountUp({ to, dec = 0, initial }: { to: number; dec?: number; initial: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    const host = el?.closest('.reveal')
    if (!el || !host || !to) return
    let raf = 0
    const run = () => {
      const t0 = performance.now()
      const step = (now: number) => {
        const k = ease(cl((now - t0) / 1600))
        el.textContent = (to * k).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    host.addEventListener('hx:reveal', run, { once: true })
    return () => { host.removeEventListener('hx:reveal', run); cancelAnimationFrame(raf) }
  }, [to, dec])
  return <span ref={ref}>{initial}</span>
}
