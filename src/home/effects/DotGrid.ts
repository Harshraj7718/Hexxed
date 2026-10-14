// Hero background: twinkling ink dot grid with a soft yellow cursor spotlight.
type Dot = { x: number; y: number; o: number; s: number; k: number }
type Spot = { x: number; y: number; a: number }

export class DotGrid {
  spacing: number
  spotlight: number
  private ctx: CanvasRenderingContext2D
  private dots: Dot[] = []
  private w = 0
  private h = 0
  private mouse: { x: number; y: number } | null = null
  private sm: Spot | null = null
  private t0 = performance.now()
  private ro: ResizeObserver
  private cv: HTMLCanvasElement

  constructor(cv: HTMLCanvasElement, spacing: number, spotlight: number) {
    this.cv = cv
    this.ctx = cv.getContext('2d')!
    this.spacing = spacing
    this.spotlight = spotlight
    this.ro = new ResizeObserver(() => this.layout())
    this.ro.observe(cv)
    this.layout()
    window.addEventListener('mousemove', this.onMove)
    document.addEventListener('mouseleave', this.onLeave)
  }

  setSpacing(sp: number) {
    if (sp === this.spacing) return
    this.spacing = sp
    this.layout()
  }

  private layout() {
    const dpr = Math.min(2, devicePixelRatio || 1), w = this.cv.clientWidth, h = this.cv.clientHeight
    this.cv.width = w * dpr; this.cv.height = h * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.w = w; this.h = h
    const sp = this.spacing, dots: Dot[] = []
    for (let x = (w % sp) / 2; x <= w; x += sp)
      for (let y = (h % sp) / 2; y <= h; y += sp)
        dots.push({ x, y, o: Math.random() * Math.PI * 2, s: 0.5 + Math.random() * 1.5, k: 0.5 + Math.random() * 0.5 })
    this.dots = dots
  }

  private onMove = (e: MouseEvent) => {
    const rc = this.cv.getBoundingClientRect()
    const x = e.clientX - rc.left, y = e.clientY - rc.top
    this.mouse = x >= 0 && y >= 0 && x <= rc.width && y <= rc.height ? { x, y } : null
  }

  private onLeave = () => { this.mouse = null }

  frame() {
    if (!this.w) return
    const rc = this.cv.getBoundingClientRect()
    if (rc.bottom < 0 || rc.top > innerHeight) return
    const { ctx, w, h } = this, t = (performance.now() - this.t0) / 1000
    if (this.mouse) {
      const s = this.sm
      this.sm = s
        ? { x: s.x + (this.mouse.x - s.x) * 0.18, y: s.y + (this.mouse.y - s.y) * 0.18, a: Math.min(1, s.a + 0.06) }
        : { ...this.mouse, a: 0 }
    } else if (this.sm) {
      this.sm.a -= 0.05
      if (this.sm.a <= 0) this.sm = null
    }
    ctx.clearRect(0, 0, w, h)
    const m = this.sm, rad = this.spotlight, ds = 1.2
    if (m) {
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, rad * 1.1)
      g.addColorStop(0, 'rgba(250,244,24,' + 0.42 * m.a + ')'); g.addColorStop(1, 'rgba(250,244,24,0)')
      ctx.fillStyle = g; ctx.fillRect(m.x - rad * 1.2, m.y - rad * 1.2, rad * 2.4, rad * 2.4)
    }
    for (const d of this.dots) {
      const blink = 0.2 + (Math.sin(t * d.s + d.o) * 0.5 + 0.5) * d.k * 0.8
      let k = 0
      if (m) { const dx = d.x - m.x, dy = d.y - m.y; k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / (rad * 0.8)) * m.a }
      const s = ds + k * ds * 1.5
      ctx.fillStyle = k > 0 ? 'rgba(20,20,18,' + (0.25 + k * 0.6) * (0.6 + blink * 0.4) + ')' : 'rgba(20,20,18,' + blink * 0.2 + ')'
      ctx.fillRect(d.x - s, d.y - s, s * 2, s * 2)
    }
  }

  dispose() {
    this.ro.disconnect()
    window.removeEventListener('mousemove', this.onMove)
    document.removeEventListener('mouseleave', this.onLeave)
  }
}
