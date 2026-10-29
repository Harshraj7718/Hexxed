import { useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { LOOKS, MRP, PRICE, PRODUCTS, QUIZ, WHY, productById, quizResult, type Product, type ProductId } from '../data'
import { Reveal } from '../motion'

export function ProductImage({ product, className = 'contain-img', label }: { product: Product; className?: string; label?: string }) {
  return product.img
    ? <div role="img" aria-label={product.name} className={className} style={{ backgroundImage: `url(${product.img})` }} />
    : <div className="placeholder">{label}</div>
}

const rating = (v: number, approx?: boolean) => (approx ? '≈' : '') + v + '/5'

const HOME_IDS: ProductId[] = ['clay', 'define', 'cream', 'matte']

/** `all` lists every formula (products page); otherwise just the four home-page picks. */
export function Bench({ onAdd, all = false }: { onAdd: (id: ProductId) => void; all?: boolean }) {
  const list = all ? PRODUCTS : HOME_IDS.map(productById)
  return (
    <section id="bench" className="bench">
      <Reveal className="section-head">
        <div className="stack-14">
          <div className="eyebrow">The styling bench</div>
          <h2 className="h2">Pick your <span className="hl">weapon.</span></h2>
        </div>
        {!all && <a href="/products.html" className="bench__all">See all formulas →</a>}
      </Reveal>
      <div className="cards">
        {list.filter(p => p.img).map((p, i) => (
          <Reveal key={p.id} delay={i * 110}>
            <div className="card">
              <div className="card__meta">
                <span className="card__stock"><i style={{ background: p.stock ? 'oklch(0.6 0.13 150)' : '#b04a3a' }} />{p.stock ? 'In stock' : 'Sold out'}</span>
                <span className="card__tag">{p.tag}</span>
              </div>
              <a href={'/product.html?p=' + p.slug} className="card__media" aria-label={p.name}>
                <ProductImage product={p} className="card__img" label={'product shot — ' + p.name.toUpperCase()} />
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href={'/product.html?p=' + p.slug} className="card__name">{p.name.toUpperCase()}</a>
                <div className="card__pitch">{p.pitch}</div>
              </div>
              <div className="card__bars">
                <div className="bar"><span>HOLD</span><div className="bar__track"><i style={{ width: p.hold / 5 * 100 + '%', background: p.accent }} /></div><span>{rating(p.hold, p.approx)}</span></div>
                <div className="bar"><span>SHINE</span><div className="bar__track"><i style={{ width: p.shine / 5 * 100 + '%', background: p.accent }} /></div><span>{rating(p.shine, p.approx)}</span></div>
              </div>
              <div className="card__foot">
                <div className="price"><b>₹{PRICE}</b><span className="strike">₹{MRP}</span></div>
                <button type="button" className="btn btn--outline card__add" disabled={!p.stock} onClick={() => onAdd(p.id)}>{p.stock ? 'Add to bag' : 'Sold out'}</button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

type MatchProps = {
  onAdd: (id: ProductId) => void
  /** Called after each answer; `result` is set once all three are answered. */
  onStep: (step: number, result: ProductId | null) => void
}

export function Match({ onAdd, onStep }: MatchProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const done = step >= QUIZ.length
  const res = done ? productById(quizResult(answers)) : null

  const pick = (label: string) => {
    const ans = [...answers.slice(0, step), label], next = step + 1
    setAnswers(ans)
    setStep(next)
    onStep(next, next >= QUIZ.length ? quizResult(ans) : null)
  }

  return (
    <section id="match" className="match">
      <Reveal className="match__panel">
        <div className="match__intro">
          <div className="eyebrow eyebrow--yellow">Find your match · 3 taps</div>
          <h2 className="h2">Still <span className="it-yellow">confused?</span></h2>
          <p>Tell us about your hair and the look you’re after. We’ll pour you the right formula — no sign-up, no spam.</p>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={step}><i style={{ width: step / 3 * 100 + '%' }} /></div>
        </div>
        <div className="quiz" aria-live="polite">
          {!done && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="quiz__num">QUESTION {Math.min(3, step + 1)} / 3</div>
              <div className="quiz__q">{QUIZ[step].q}</div>
              <div className="quiz__opts">
                {QUIZ[step].o.map(label => (
                  <button key={label} type="button" className="btn btn--ghost-dark quiz__opt" onClick={() => pick(label)}>{label}</button>
                ))}
              </div>
              {step > 0 && <button type="button" className="quiz__back" onClick={() => setStep(s => Math.max(0, s - 1))}>← Back</button>}
            </div>
          )}
          {res && (
            <div className="result">
              <div className="result__media"><ProductImage product={res} label="product shot" /></div>
              <div className="result__body">
                <div className="result__label">YOUR MATCH</div>
                <div className="result__name">{res.name}</div>
                <div className="result__why">{WHY[res.id]}</div>
                <div className="result__actions">
                  <button type="button" className="btn result__add" disabled={!res.stock} onClick={() => onAdd(res.id)}>{res.stock ? `Add to bag — ₹${PRICE}` : 'Sold out'}</button>
                  <button type="button" className="result__retake" onClick={() => { setStep(0); setAnswers([]) }}>Retake</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}

export function Looks({ onAdd }: { onAdd: (id: ProductId) => void }) {
  return (
    <section id="looks" className="looks">
      <Reveal className="section-head">
        <div className="stack-14">
          <div className="eyebrow eyebrow--yellow">The lookbook</div>
          <h2 className="h2">Steal <span className="it-yellow">the look.</span></h2>
        </div>
        <p className="lede">Three cuts we can’t stop seeing. Here’s exactly what holds them.</p>
      </Reveal>
      <div className="looks__grid">
        {LOOKS.map((lk, i) => (
          <Reveal key={lk.title} delay={i * 110} className="look">
            <LookFlipCard look={lk} onAdd={onAdd} />
            <div className="look__row">
              <button type="button" className="btn btn--ghost-dark look__add" disabled={!productById(lk.id).stock} onClick={() => onAdd(lk.id)}>
                <span>Get it with <strong>{lk.product}</strong></span><span>+ ₹{PRICE}</span>
              </button>
              <a className="look__go" href={'/product.html?p=' + productById(lk.id).slug} aria-label={'View ' + productById(lk.id).name} title={'View ' + productById(lk.id).name}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const canHover = () => window.matchMedia('(hover: hover)').matches

/**
 * Lookbook card that flips in 3D: the cut on the front, the jar that holds it on the back.
 * Mouse: hover flips, and the card tilts and catches light toward the cursor.
 * Touch: tap flips. Keyboard: tabbing to the back's buttons flips it.
 */
function LookFlipCard({ look, onAdd }: { look: (typeof LOOKS)[number]; onAdd: (id: ProductId) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState(false)
  const p = productById(look.id)

  const onMove = (e: ReactPointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg')
    el.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg')
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
    el.style.setProperty('--ga', '1')
  }
  const onLeave = () => {
    const st = ref.current?.style
    if (!st) return
    ;['--ry', '--rx'].forEach(k => st.setProperty(k, '0deg'))
    st.setProperty('--ga', '0')
  }
  // Hover already flips on mouse devices; taps toggle on touch screens.
  const onTap = (e: ReactMouseEvent) => {
    if (canHover() || (e.target as HTMLElement).closest('button')) return
    setFlipped(f => !f)
  }

  return (
    <div ref={ref} className="flip" data-flipped={flipped ? '' : undefined} onPointerMove={onMove} onPointerLeave={onLeave} onClick={onTap}>
      <div className="flip__inner">
        <div className="flip__face flip__front">
          <div role="img" aria-label={look.title} className="look__img" style={{ backgroundImage: `url(${look.img})`, backgroundPosition: look.pos }} />
          <div className="look__tag">{look.tag}</div>
          <div className="flip__hint" aria-hidden="true">↻ See the jar</div>
          <div className="look__caption">
            <div className="look__title">{look.title}</div>
            <div className="look__note">{look.note}</div>
          </div>
          <div className="flip__glare" />
        </div>
        <div className="flip__face flip__back" aria-label={'What holds ' + look.title + ': ' + p.name}>
          <div className="pback__top">
            <span className="look__tag">{p.tag}</span>
            <span className="pback__for">For {look.title.replace(/^The /, '')}</span>
          </div>
          <div className="pback__media"><ProductImage product={p} label={'product shot — ' + p.name.toUpperCase()} /></div>
          <div>
            <div className="pback__name">{p.name.toUpperCase()}</div>
            <div className="pback__sub">{p.sub}. {p.pitch}</div>
          </div>
          <div className="card__bars">
            <div className="bar"><span>HOLD</span><div className="bar__track"><i style={{ width: p.hold / 5 * 100 + '%', background: p.accent }} /></div><span>{rating(p.hold, p.approx)}</span></div>
            <div className="bar"><span>SHINE</span><div className="bar__track"><i style={{ width: p.shine / 5 * 100 + '%', background: p.accent }} /></div><span>{rating(p.shine, p.approx)}</span></div>
          </div>
          <div className="pback__foot">
            <div className="price"><b>₹{PRICE}</b><span className="strike">₹{MRP}</span></div>
            <button type="button" className="btn btn--outline card__add" disabled={!p.stock} onClick={() => onAdd(look.id)}>{p.stock ? 'Add to bag' : 'Sold out'}</button>
            <a className="pback__go" href={'/product.html?p=' + p.slug} aria-label={'View ' + p.name} title={'View ' + p.name}>↗</a>
          </div>
          {!canHover() && <button type="button" className="pback__back" onClick={() => setFlipped(false)}>↺ Back to the look</button>}
        </div>
      </div>
    </div>
  )
}
