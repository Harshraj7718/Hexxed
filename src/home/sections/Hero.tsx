import { useEffect, useRef } from 'react'
import type { HeroScene } from '../../three/HeroScene'
import { DotGrid } from '../effects/DotGrid'
import { CHAPTERS, HERO_WINDOWS, MRP, PRICE, dots, productById, type ProductId } from '../data'
import { sectionProgress, seg, useFrame } from '../motion'

type Props = {
  gridSpacing: number
  gridSpotlight: number
  onAdd: (id: ProductId) => void
  onBuyNow: () => void
  onBuyTrio: () => void
  /** Fired once when the jar is boxed and sealed. */
  onPacked: () => void
}

const TICKS = [0, 1, 2, 3, 4, 5]

/**
 * 960vh scroll story with a sticky 100vh stage. Scroll progress drives the 3D scene
 * and cross-fades the overlay for each phase (see HERO_WINDOWS).
 */
export function Hero({ gridSpacing, gridSpotlight, onAdd, onBuyNow, onBuyTrio, onPacked }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneCanvas = useRef<HTMLCanvasElement>(null)
  const gridCanvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<HeroScene | null>(null)
  const grid = useRef<DotGrid | null>(null)
  const pointer = useRef({ mx: 0, my: 0 })
  const packed = useRef(false)

  useEffect(() => {
    let cancelled = false
    // three.js is ~500 KB: fetch it after first paint instead of blocking it.
    import('../../three/HeroScene').then(({ HeroScene }) => {
      if (!cancelled && sceneCanvas.current) scene.current = new HeroScene(sceneCanvas.current)
    })
    grid.current = new DotGrid(gridCanvas.current!, gridSpacing, gridSpotlight)
    const onMove = (e: MouseEvent) => { pointer.current = { mx: e.clientX / innerWidth - 0.5, my: e.clientY / innerHeight - 0.5 } }
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelled = true
      window.removeEventListener('mousemove', onMove)
      scene.current?.dispose(); scene.current = null
      grid.current?.dispose(); grid.current = null
    }
    // Built once; tweak changes are applied by the effect below.
  }, [])

  useEffect(() => {
    grid.current?.setSpacing(gridSpacing)
    if (grid.current) grid.current.spotlight = gridSpotlight
  }, [gridSpacing, gridSpotlight])

  useFrame(() => {
    const stage = stageRef.current
    if (!stage) return
    const p = sectionProgress(sectionRef.current)
    scene.current?.setProgress(p)
    scene.current?.setPointer(pointer.current.mx, pointer.current.my)
    grid.current?.frame()

    let active = 0
    stage.querySelectorAll<HTMLElement>('[data-ch]').forEach(el => {
      const i = +el.dataset.ch!, [a, b] = HERO_WINDOWS[i]
      const o = seg(p, a - 0.03, a) * (1 - seg(p, b - 0.02, b + 0.01))
      el.style.opacity = String(o)
      el.style.pointerEvents = o > 0.6 && (i > 1 || 'interactive' in el.dataset) ? 'auto' : 'none'
      const base = i > 1 && i < 5 ? 'translateY(-50%) ' : ''
      el.style.transform = base + `translateY(${(1 - o) * (p < a ? 40 : -40)}px)`
      if (o > 0.5) active = i
    })
    if (active === 5 && !packed.current) { packed.current = true; onPacked() }
    stage.querySelectorAll<HTMLElement>('[data-tick]').forEach(t => {
      if (+t.dataset.tick! === active) t.dataset.on = ''
      else delete t.dataset.on
    })
  })

  return (
    <section id="top" ref={sectionRef} className="hero">
      <div ref={stageRef} className="hero__stage">
        <canvas ref={gridCanvas} className="hero__grid" aria-hidden="true" />

        <div data-ch="0" className="hero__layer">
          <h1 className="hero__big hero__big--top" style={{ margin: 0, fontWeight: 400 }}>Your hair.</h1>
          <div className="hero__big hero__big--bottom">Your <span className="hl">rules.</span></div>
          <div className="hero__sticker">✦ clean hold · 100g</div>
        </div>

        <canvas ref={sceneCanvas} className="hero__scene" role="img" aria-label="HAXXED jar in 3D" />

        <div data-ch="0" data-interactive className="hero__intro">
          <div className="hero__intro-copy">
            <p>Grip like a pro. Rinse like water. Clean styling built for Indian hair, heat &amp; humidity.</p>
            <div className="hero__ctas">
              <a href="#bench" className="btn btn--yellow">Shop the bench</a>
              <a href="#match" className="btn btn--outline">Find your match</a>
            </div>
          </div>
          <div className="hero__hint"><i />Scroll to open the jar</div>
        </div>

        <div data-ch="1" className="hero__open">
          <div className="stack-14" style={{ maxWidth: 420 }}>
            <div className="eyebrow">Twist. Scoop. Style.</div>
            <div className="hero__open-title">Hold you can feel. <span className="hl">Residue you can’t.</span></div>
          </div>
          <div className="hero__claims">
            <span>✦ No sulphates</span><span>✦ No parabens</span><span>✦ Water-soluble</span><span>✦ Clean ingredients</span>
          </div>
        </div>

        {CHAPTERS.map(c => {
          const p = productById(c.id)
          return (
            <div key={c.id} data-ch={c.ch} className="chapter">
              <div className="chapter__num" style={{ color: p.accent }}>{c.num} — {p.name.toUpperCase()}</div>
              <div className="chapter__hook">{c.hook}</div>
              <div className="chapter__copy">{c.copy}</div>
              <div className="chapter__dots">
                <span>HOLD <span style={{ color: p.accent }}>{dots(c.hold)}</span></span>
                <span>SHINE <span style={{ color: p.accent }}>{dots(c.shine)}</span></span>
              </div>
              <div className="chapter__buy">
                <button type="button" className="btn chapter__add" style={{ background: p.accent }} disabled={!p.stock} onClick={() => onAdd(c.id)}>{p.stock ? `Add to bag — ₹${PRICE}` : 'Sold out'}</button>
                <span className="strike">₹{MRP}</span>
              </div>
            </div>
          )
        })}

        <div data-ch="5" className="packed">
          <div className="packed__col">
            <div className="packed__pill">Free delivery · 29,000+ pincodes</div>
            <div className="packed__title">Packed. Sealed. <span className="hl">Yours.</span></div>
          </div>
          <div className="packed__col">
            <div className="packed__btns">
              <button type="button" className="btn btn--yellow packed__buy" onClick={onBuyNow}>Buy now — ₹{PRICE}</button>
              <button type="button" className="btn btn--outline packed__trio" onClick={onBuyTrio}>Box all 3 · save 15%</button>
            </div>
            <div className="packed__note">Clean formula · Made in India · Free nationwide delivery</div>
          </div>
        </div>

        <div className="ticks" aria-hidden="true">
          {TICKS.map(i => <span key={i} data-tick={i} />)}
        </div>
      </div>
    </section>
  )
}
