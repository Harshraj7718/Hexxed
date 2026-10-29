import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DETAILS, MRP, PRICE, PRODUCTS, inr, type Product } from '../home/data'
import { bagTotals, bundleMessage, type useBag } from '../home/useBag'
import { Match } from '../home/sections/Shop'
import { Shell } from './Pages'
import { loadLocal, saveLocal, seededFor, type Review } from './reviews'
import './pdp.css'

gsap.registerPlugin(ScrollTrigger)

/** Hand-written copy per formula. */
const COPY: Record<string, { promise: string; closer: string }> = {
  'clay-pomade': { promise: 'Architecture for your hair. Height, grip and texture that outlast the meeting, the monsoon and the helmet.', closer: 'You do not wear it. It holds you up.' },
  'matte-paste': { promise: 'A dry, deliberate, undone finish. The kind of effortless that took exactly ten seconds.', closer: 'Quiet hair. Loud confidence.' },
  'cream-pomade': { promise: 'Sharp parts, slick-backs and a finish with a pulse. Shine that looks groomed, never greasy.', closer: 'Walk in like the room was waiting.' },
  'sculpting-cream': { promise: 'Strong, workable hold that stays flexible. Change your mind at noon, not at the mirror.', closer: 'Your style is a draft. Keep editing.' },
  'styling-wax': { promise: 'Medium grip with a quiet satin glow. Movement you can feel, control you can trust.', closer: 'Hold with a little give.' },
  'texture-paste': { promise: 'Thick, tousled texture with a true matte finish. Fine hair, finally taken seriously.', closer: 'More hair. Zero fuss.' },
  'define-cream': { promise: 'A feather-light hold that brings tired hair back to life. Defined, touchable, frizz-free.', closer: 'Hair that moves the way you do.' },
  'styling-clay': { promise: 'Serious hold in a water-based formula that rinses clean. Commitment without the residue.', closer: 'Strong enough to stay. Kind enough to leave.' },
  'spiking-mud': { promise: 'Grip that makes statements: spikes, crops and sharp, gravity-defying shapes.', closer: 'Make some noise.' },
  'moulding-gel': { promise: 'A plant-based gel with maximum hold and a mirror-bright finish. No flakes, no crunch.', closer: 'Shine that holds its shape.' },
  'beard-moustache-wax': { promise: 'Strong hold and a clean shine for beards and moustaches that refuse to behave.', closer: 'Every line, exactly where you left it.' },
  'beard-butter': { promise: 'Rich butters and oils for a beard that is softer, smoother and genuinely cared for.', closer: 'Because a great beard is grown, then looked after.' },
}

const ICONS: Record<string, ReactNode> = {
  drop: <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" />,
  leaf: <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l7-7" />,
  spark: <><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /><circle cx="12" cy="12" r="2" /></>,
  truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  india: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" /></>,
  recycle: <path d="M7 7l3-3 3 3M10 4v8M17 17l-3 3-3-3M14 20v-8M4 12h6M14 12h6" />,
}
function Icon({ n }: { n: string }) {
  return <svg className="pd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[n]}</svg>
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="pd-stars" role="img" aria-label={`${value.toFixed(1)} out of 5`} style={{ fontSize: size }}>
      <span className="pd-stars__bg">★★★★★</span>
      <span className="pd-stars__fg" style={{ width: (value / 5) * 100 + '%' }}>★★★★★</span>
    </span>
  )
}

type Bag = ReturnType<typeof useBag>
const TABS = ['Description', 'How to use', 'Ingredients', 'Shipping & returns'] as const

function Inner({ p, bag }: { p: Product; bag: Bag }) {
  const d = DETAILS[p.slug]
  const copy = COPY[p.slug] ?? { promise: p.sub, closer: '' }
  const root = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Description')
  const [local, setLocal] = useState<Review[]>(() => loadLocal(p.slug))
  const [draft, setDraft] = useState({ name: '', rating: 5, title: '', text: '' })
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    document.title = `${d.name} — HAXXED Grooming Co.`
    document.querySelector('meta[name=description]')?.setAttribute('content', `${d.name}: ${copy.promise}`)
  }, [d.name, copy.promise])

  const reviews = useMemo(() => [...local, ...seededFor(p.slug)], [local, p.slug])
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0
  const dist = [5, 4, 3, 2, 1].map(n => reviews.filter(r => r.rating === n).length)

  const totals = bagTotals({ [p.id]: qty })
  const others = PRODUCTS.filter(x => x.id !== p.id).slice(0, 8)

  const addToBag = (open: boolean) => {
    bag.addMany(Array(qty).fill(p.id))
    bag.flash(`${qty} × ${p.name} added to your bag`)
    if (open) bag.setOpen(true)
  }

  const submitReview = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim() || !draft.text.trim()) return
    const r: Review = { ...draft, name: draft.name.trim(), title: draft.title.trim(), text: draft.text.trim(), date: new Date().toISOString().slice(0, 10) }
    const next = [r, ...local]
    setLocal(next)
    saveLocal(p.slug, next)
    setDraft({ name: '', rating: 5, title: '', text: '' })
    bag.flash('Thank you — your review is posted')
  }

  useLayoutEffect(() => {
    const el = root.current?.querySelector('.pd-main__img')
    if (el) gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
  }, [active])

  useLayoutEffect(() => {
    const el = root.current?.querySelector('.pd-tabpanel')
    if (el) gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
  }, [tab])

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.pd-crumbs', { opacity: 0, y: -10, duration: 0.6 })
          .from('.pd-gallery', { opacity: 0, y: 30, duration: 1 }, 0.05)
          .from('.pd-buy > *', { opacity: 0, y: 24, duration: 0.8, stagger: 0.07 }, 0.15)
        gsap.from('.pd-spec > div', { opacity: 0, y: 30, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pd-spec', start: 'top 92%' } })
        gsap.from('.pd-sprig path, .pd-sprig circle', { opacity: 0, duration: 1.4, stagger: 0.06, scrollTrigger: { trigger: '.pd-tabs', start: 'top 85%' } })
        gsap.utils.toArray<HTMLElement>('.pd-bar-fill').forEach(b => {
          gsap.from(b, { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: b, start: 'top 95%', once: true } })
        })
        gsap.utils.toArray<HTMLElement>('.pd-info__img').forEach(el => {
          gsap.fromTo(el, { clipPath: 'inset(10% 6% 10% 6%)', opacity: 0.4 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 50%', scrub: true } })
        })
        gsap.from('.pd-card', { opacity: 0, y: 40, stagger: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pd-rail', start: 'top 92%' } })
        gsap.from('.pd-assure > *', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: '.pd-assure', start: 'top 98%' } })
        ScrollTrigger.create({ trigger: '.pd-buy', start: 'bottom top', end: 'max', toggleClass: { targets: '.pd-bar', className: 'is-on' } })
      }, root)
      return () => ctx.revert()
    })
    mm.add('(prefers-reduced-motion: reduce)', () => { document.querySelector('.pd-bar')?.classList.add('is-on') })
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { window.removeEventListener('load', refresh); mm.revert() }
  }, [p.slug])

  const onZoomMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const img = e.currentTarget.querySelector<HTMLElement>('.pd-main__img')
    if (img) img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`
  }
  const scrollRail = (dir: number) => rail.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

  const desc = d.description ? d.description.charAt(0).toUpperCase() + d.description.slice(1) + (/[.!]$/.test(d.description) ? '' : '.') : copy.promise
  const tabBody: Record<(typeof TABS)[number], ReactNode> = {
    Description: (
      <>
        <p>{desc}</p>
        {d.benefits.length > 0 && <ul>{d.benefits.map(b => <li key={b}>{b}</li>)}</ul>}
        {copy.closer && <p className="pd-quote">{copy.closer}</p>}
      </>
    ),
    'How to use': d.howTo.length ? <ol>{d.howTo.map(h => <li key={h}>{h}</li>)}</ol> : <p>Apply a small amount to dry or slightly damp hair, work through, and style.</p>,
    Ingredients: d.ingredients.length
      ? <dl>{d.ingredients.map(([n, b]) => <div key={n}><dt>{n}</dt><dd>{b}</dd></div>)}</dl>
      : <p>See the jar label for the full ingredient list.</p>,
    'Shipping & returns': (
      <>
        <p>Free shipping all over India, with no minimum order value. Orders are dispatched within 1–2 working days and typically arrive in 2–5 business days by air.</p>
        <p>If your order arrives damaged, contact us within 48 hours of delivery. See <a href="/shipping.html">Shopping info</a> for details.</p>
      </>
    ),
  }

  return (
    <div ref={root} className="pd">
      <nav className="pd-crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><i>›</i><a href="/products.html">Our products</a><i>›</i><span>{d.name}</span>
      </nav>

      <section className="pd-top">
        <div className="pd-gallery">
          <div className="pd-main" data-zoom={zoom ? '' : undefined} onPointerMove={onZoomMove}>
            <img className="pd-main__img" src={d.gallery[active]} alt={d.name} />
            <button type="button" className="pd-main__zoom" aria-label="Toggle zoom" aria-pressed={zoom} onClick={() => setZoom(z => !z)}>⌕</button>
          </div>
          {d.gallery.length > 1 && (
            <div className="pd-thumbs">
              <button type="button" className="pd-arrow" aria-label="Previous image" onClick={() => setActive(a => (a - 1 + d.gallery.length) % d.gallery.length)}>←</button>
              {d.gallery.map((g, i) => (
                <button key={g} type="button" className="pd-thumb" data-on={i === active ? '' : undefined} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`}><img src={g} alt="" /></button>
              ))}
              <button type="button" className="pd-arrow" aria-label="Next image" onClick={() => setActive(a => (a + 1) % d.gallery.length)}>→</button>
            </div>
          )}
        </div>

        <div className="pd-buy">
          <div className="pd-eyebrow">{d.tag}</div>
          <h1 className="pd-title">{d.name}</h1>
          <a href="#reviews" className="pd-rating">
            <Stars value={avg} />
            <span>{reviews.length ? `${avg.toFixed(1)} · ${reviews.length} review${reviews.length === 1 ? '' : 's'}` : 'No reviews yet'}</span>
          </a>
          <div className="pd-price"><b>{inr(PRICE)}</b><s>{inr(MRP)}</s><span>Inclusive of all taxes</span></div>
          <p className="pd-lede">{copy.promise}</p>
          <hr />
          <ul className="pd-feats">
            <li><Icon n="drop" />Water-soluble, rinses out clean</li>
            <li><Icon n="leaf" />No sulphates, no parabens</li>
            <li><Icon n="india" />Made in India for Indian hair</li>
            <li><Icon n="truck" />Free delivery Pan India</li>
            <li><Icon n="lock" />Extra 5% off on prepaid orders</li>
          </ul>

          <div className="pd-opts">
            <div>
              <div className="pd-label">Size</div>
              <div className="pd-chips"><span className="pd-chip">100 g</span></div>
            </div>
            <div>
              <div className="pd-label">Quantity</div>
              <div className="pd-qty">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>

          {d.stock ? (
            <>
              <button type="button" className="pd-add" onClick={() => addToBag(false)}>Add to bag &nbsp;·&nbsp; {inr(PRICE * qty - totals.saving)}</button>
              <button type="button" className="pd-buynow" onClick={() => addToBag(true)}>Buy now</button>
              <div className="pd-note"><Icon n="truck" />{bundleMessage(qty)}</div>
            </>
          ) : (
            <div className="pd-soldout">This formula is between batches. Choose another below and we will keep the shelf warm.</div>
          )}
        </div>
      </section>

      <section className="pd-spec" aria-label="At a glance">
        <div><span>Hold</span><b>{p.approx ? '≈' : ''}{p.hold} / 5</b><em>{d.sub.split(' · ')[0]}</em></div>
        <div><span>Shine</span><b>{p.approx ? '≈' : ''}{p.shine} / 5</b><em>{d.sub.split(' · ')[1] ?? 'Natural finish'}</em></div>
        <div><span>Formula</span><b>Water-soluble</b><em>No sulphates, no parabens</em></div>
        <div><span>Made</span><b>In India</b><em>Clean, stylist-tested</em></div>
      </section>

      <section className="pd-tabs">
        <div className="pd-tablist" role="tablist" aria-orientation="vertical">
          {TABS.map(t => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className="pd-tabpanel" role="tabpanel">{tabBody[tab]}</div>
        <svg className="pd-sprig" viewBox="0 0 200 220" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true">
          <path d="M20 210C60 170 100 120 150 20" />
          <path d="M60 165c-18-4-28-16-30-30 16 2 28 12 30 30zM88 128c-18-2-30-12-34-26 18 0 30 8 34 26zM116 86c-16-4-26-16-26-30 16 4 24 14 26 30zM96 140c14-6 28-4 38 6-14 6-30 4-38-6zM124 96c12-6 24-4 32 6-12 6-26 4-32-6z" />
          <circle cx="152" cy="18" r="6" />
        </svg>
      </section>

      {d.info.length > 0 && (
        <section className="pd-info">
          <h2 className="pd-h">The details</h2>
          <div className="pd-info__grid">
            {d.info.map(src => <img key={src} className="pd-info__img" src={src} alt={d.name + ' details'} loading="lazy" />)}
          </div>
        </section>
      )}

      <section className="pd-reviews" id="reviews">
        <h2 className="pd-h">Customer reviews</h2>
        <div className="pd-rv">
          <div className="pd-rv__sum">
            <div className="pd-rv__avg">{reviews.length ? avg.toFixed(1) : '—'}</div>
            <Stars value={avg} size={18} />
            <div className="pd-rv__count">{reviews.length ? `Based on ${reviews.length} review${reviews.length === 1 ? '' : 's'}` : 'No reviews yet'}</div>
            <div className="pd-rv__bars">
              {[5, 4, 3, 2, 1].map((n, i) => (
                <div key={n}><span>{n}★</span><div className="pd-rv__track"><i className="pd-bar-fill" style={{ width: reviews.length ? (dist[i] / reviews.length) * 100 + '%' : '0%' }} /></div><span>{dist[i]}</span></div>
              ))}
            </div>
          </div>

          <div className="pd-rv__list">
            {reviews.length === 0 && <p className="pd-rv__empty">Be the first to review {d.name}. Tell others how it held up.</p>}
            {reviews.map((r, i) => (
              <article key={i} className="pd-rv__item">
                <header><Stars value={r.rating} /><b>{r.title || 'Review'}</b></header>
                <p>{r.text}</p>
                <footer>{r.name} · {r.date}</footer>
              </article>
            ))}
          </div>

          <form className="pd-rv__form" onSubmit={submitReview}>
            <div className="pd-label">Write a review</div>
            <div className="pd-pick" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" role="radio" aria-checked={draft.rating === n} data-on={n <= draft.rating ? '' : undefined} onClick={() => setDraft(v => ({ ...v, rating: n }))} aria-label={`${n} star${n > 1 ? 's' : ''}`}>★</button>
              ))}
            </div>
            <input placeholder="Your name" value={draft.name} onChange={e => setDraft(v => ({ ...v, name: e.target.value }))} required />
            <input placeholder="Review title" value={draft.title} onChange={e => setDraft(v => ({ ...v, title: e.target.value }))} />
            <textarea placeholder="How was your experience?" rows={4} value={draft.text} onChange={e => setDraft(v => ({ ...v, text: e.target.value }))} required />
            <button type="submit" className="pd-add">Submit review</button>
          </form>
        </div>
      </section>

      <div className="pd-quiz"><Match onAdd={bag.add} onStep={() => {}} /></div>

      <section className="pd-also">
        <h2 className="pd-h pd-h--c">You will also love</h2>
        <div className="pd-railwrap">
          <button type="button" className="pd-arrow" aria-label="Scroll left" onClick={() => scrollRail(-1)}>←</button>
          <div ref={rail} className="pd-rail">
            {others.map(o => (
              <article key={o.id} className="pd-card">
                <a href={'/product.html?p=' + o.slug} className="pd-card__img"><img src={o.img!} alt={o.name} loading="lazy" /></a>
                <h3>{o.name}</h3>
                <span>{inr(PRICE)}</span>
                <button type="button" disabled={!o.stock} onClick={() => bag.add(o.id)}>{o.stock ? 'Add to bag' : 'Sold out'}</button>
              </article>
            ))}
          </div>
          <button type="button" className="pd-arrow" aria-label="Scroll right" onClick={() => scrollRail(1)}>→</button>
        </div>
      </section>

      <section className="pd-assure">
        <div><Icon n="truck" /><span><b>Free delivery</b>29,000+ pincodes</span></div>
        <div><Icon n="lock" /><span><b>Secure payment</b>Cards, UPI &amp; more</span></div>
        <div><Icon n="spark" /><span><b>Stylist tested</b>Approved by top stylists</span></div>
        <div><Icon n="recycle" /><span><b>Clean formula</b>Water-soluble &amp; paraben-free</span></div>
      </section>

      <div className="pd-bar" role="region" aria-label="Quick buy">
        <img src={d.gallery[0]} alt="" />
        <div><b>{d.name}</b><span>{inr(PRICE * qty - totals.saving)}</span></div>
        {d.stock ? <button type="button" onClick={() => addToBag(true)}>Add to bag</button> : <em>Sold out</em>}
      </div>
    </div>
  )
}

export function ProductPage() {
  const slug = new URLSearchParams(window.location.search).get('p') ?? ''
  const p = PRODUCTS.find(x => x.slug === slug)
  return (
    <Shell>
      {bag => p
        ? <Inner p={p} bag={bag} />
        : <main style={{ padding: '120px var(--gutter)' }}><h1 className="h2">Product not found.</h1><a className="link-underline" href="/products.html">Back to all products</a></main>}
    </Shell>
  )
}
