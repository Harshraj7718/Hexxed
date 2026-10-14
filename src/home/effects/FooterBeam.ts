// Footer: a diagonal yellow light beam that drifts and leans toward the cursor, a cursor glow,
// and the giant HAXXED wordmark sized to the column width and lit by both (via CSS variables).
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))

export class FooterBeam {
  private b = 58
  private px = 0
  private py = 0
  private g = 0
  private u = 0.5
  private x = 0
  private y = 0
  private inside = false
  private visible = false
  private last = performance.now()
  private io: IntersectionObserver
  private ro: ResizeObserver
  private ff = 0
  private disposed = false
  private root: HTMLElement
  private box: HTMLElement
  private inner: HTMLElement

  constructor(root: HTMLElement, box: HTMLElement, inner: HTMLElement, onFirstView: () => void) {
    this.root = root
    this.box = box
    this.inner = inner
    let seen = false
    this.io = new IntersectionObserver(([en]) => {
      this.visible = en.isIntersecting
      if (en.isIntersecting && !seen) { seen = true; onFirstView() }
    }, { threshold: 0.12 })
    this.io.observe(root)
    this.ro = new ResizeObserver(() => { cancelAnimationFrame(this.ff); this.ff = requestAnimationFrame(this.fit) })
    this.ro.observe(root)
    this.fit()
    document.fonts?.ready.then(() => { if (!this.disposed) this.fit() })
  }

  pointer(e: { clientX: number; clientY: number; type: string }) {
    const rr = this.root.getBoundingClientRect()
    this.x = e.clientX - rr.left
    this.y = e.clientY - rr.top
    this.u = rr.width ? this.x / rr.width : 0.5
    this.inside = e.type !== 'pointerleave'
  }

  /** Size the wordmark to the content column and record each letter's offset so the
   *  page-sized background gradients line up across letters. */
  fit = () => {
    const { root, box, inner } = this
    const wb = inner.parentElement!
    const pad = parseFloat(getComputedStyle(wb).paddingLeft) || 0
    const target = wb.clientWidth - pad * 2
    inner.style.fontSize = '100px'
    const measured = inner.offsetWidth
    const size = measured > 0 ? Math.min(100 * target / measured, target * 0.42) : 0
    inner.style.fontSize = size + 'px'
    let base = 0.8
    try {
      const c = document.createElement('canvas').getContext('2d')!
      c.font = '400 100px ' + getComputedStyle(inner).fontFamily
      const m = c.measureText('HAXXED')
      if (m.fontBoundingBoxAscent > 0) base = cl(((100 - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent) / 100, 0.5, 1.2)
    } catch {
      // keep default baseline ratio
    }
    box.style.height = Math.max(0, size * (base + 0.12)) + 'px'
    const rr = root.getBoundingClientRect()
    root.style.setProperty('--rw', rr.width + 'px')
    root.style.setProperty('--rh', rr.height + 'px')
    let top = 0
    root.querySelectorAll<HTMLElement>('[data-fx="l"]').forEach((sp, i) => {
      let x = 0, y = 0
      let el: HTMLElement | null = sp
      while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent as HTMLElement | null }
      sp.style.setProperty('--x', x + 'px'); sp.style.setProperty('--y', y + 'px')
      if (i === 0) top = y
    })
    root.style.setProperty('--top', top + 'px')
    root.style.setProperty('--bot', top + size * 0.92 + 'px')
  }

  frame() {
    if (!this.visible) return
    const now = performance.now(), dt = Math.min(0.1, (now - this.last) / 1000)
    this.last = now
    const t = now / 1000, ap = (a: number, b: number, k: number) => b + (a - b) * Math.pow(1 - k, dt * 60)
    const idle = 58 + 9 * (0.7 * Math.sin(t * 0.21) + 0.3 * Math.sin(t * 0.077 + 1.3))
    const target = this.inside ? (30 + 52 * cl(this.u)) * 0.75 + idle * 0.25 : idle
    this.b = ap(this.b, target, 0.035)
    this.px = ap(this.px, this.x, 0.16)
    this.py = ap(this.py, this.y, 0.16)
    this.g = ap(this.g, this.inside ? 1 : 0, 0.06)
    const st = this.root.style
    st.setProperty('--b', this.b.toFixed(2) + '%')
    st.setProperty('--px', this.px.toFixed(1) + 'px')
    st.setProperty('--py', this.py.toFixed(1) + 'px')
    st.setProperty('--g', this.g.toFixed(3))
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.ff)
    this.io.disconnect()
    this.ro.disconnect()
  }
}
