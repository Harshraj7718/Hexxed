import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { PRICE, PRODUCTS, inr, type Product } from '../home/data'
import { Match } from '../home/sections/Shop'
import { INSTAGRAM_URL, SUPPORT, YOUTUBE_URL } from '../contact'
import { Doodle } from './Doodle'
import { OfferBar } from '../home/sections/Chrome'
import { Shell } from './Pages'
import './catalog.css'

const WISH = 'hx-wishlist'

const TABS: { id: string; label: string; test: (p: Product) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'best', label: 'Best', test: p => p.stock },
  { id: 'hair', label: 'Hair', test: p => !p.slug.startsWith('beard') },
  { id: 'beard', label: 'Beard', test: p => p.slug.startsWith('beard') },
]
const FILTERS: { id: string; label: string; test: (p: Product) => boolean }[] = [
  { id: 'any', label: 'Everything', test: () => true },
  { id: 'hold', label: 'High hold', test: p => p.hold >= 4 },
  { id: 'matte', label: 'Matte finish', test: p => p.shine <= 1 },
  { id: 'shine', label: 'High shine', test: p => p.shine >= 3 },
]

const NAV = [['Our story', '/story.html'], ['Shop', '/products.html'], ['Shipping', '/shipping.html'], ['Contact', '/contact.html'], ['FAQ', '/faq.html']] as const
// Varied image heights give the grid its staggered, editorial rhythm.
const RATIOS = ['1 / 1.12', '1 / .86', '1 / 1.2', '1 / .92', '1 / 1.05', '1 / .8']

function loadWish(): string[] {
  try { return JSON.parse(localStorage.getItem(WISH) ?? '[]') as string[] } catch { return [] }
}

function Heart({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 8 3.6 4.8 6.9 4.8c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.3 0 5.2 3.2 4.1 6.4-1.7 4.7-9.2 9.3-9.2 9.3z" />
    </svg>
  )
}

function Arrow() {
  return <svg viewBox="0 0 40 10" width="36" height="9" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><path d="M0 5h38M33 1l5 4-5 4" /></svg>
}

type BagApi = Parameters<Parameters<typeof Shell>[0]['children']>[0]

function Catalog({ bag }: { bag: BagApi }) {
  const [tab, setTab] = useState('all')
  const [filter, setFilter] = useState('any')
  const [open, setOpen] = useState(false)
  const [wish, setWish] = useState<string[]>(loadWish)
  const [email, setEmail] = useState('')
  const grid = useRef<HTMLDivElement>(null)

  const list = useMemo(() => {
    const t = TABS.find(x => x.id === tab)!.test
    const f = FILTERS.find(x => x.id === filter)!.test
    return PRODUCTS.filter(p => t(p) && f(p))
  }, [tab, filter])
  const shown = list


  const toggleWish = (id: string) => {
    setWish(w => {
      const n = w.includes(id) ? w.filter(x => x !== id) : [...w, id]
      try { localStorage.setItem(WISH, JSON.stringify(n)) } catch { /* private mode */ }
      return n
    })
  }

  useLayoutEffect(() => {
    if (!grid.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.ct-card', { opacity: 0, y: 36, duration: 0.8, stagger: 0.07, ease: 'power3.out' })
    }, grid)
    return () => ctx.revert()
  }, [tab, filter])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.ct-w', { yPercent: 110, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.12 })
      gsap.from('.ct-eyebrow, .ct-lede', { opacity: 0, y: 14, duration: 0.8, delay: 0.3, stagger: 0.1 })
      gsap.from('.ct-tabs > *', { opacity: 0, y: 12, duration: 0.7, stagger: 0.06, delay: 0.3 })
    })
    return () => ctx.revert()
  }, [])

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    bag.flash('Prototype only — no newsletter is connected yet')
    setEmail('')
  }

  return (
    <>
    <OfferBar />
    <div className="ct">
      <header className="ct-head">
        <a href="/" className="ct-logo"><img src="/assets/haxxed-logo.png" alt="HAXXED Grooming & Co." /></a>
        <nav className="ct-nav" aria-label="Main">{NAV.map(([l, h]) => <a key={l} href={h} aria-current={h === '/products.html' ? 'page' : undefined}>{l}</a>)}</nav>
        <div className="ct-acct">
          <span>Wishlist ({wish.length})</span>
          <button type="button" onClick={() => bag.setOpen(true)}>Cart ({bag.totals.count})</button>
        </div>
      </header>

      <main className="ct-main">
        <Doodle v="shelf" className="ct-art" />
        <div className="ct-eyebrow">The HAXXED shelf · {PRODUCTS.length} formulas</div>
        <h1 className="ct-title">
          {['Hold.', 'Shine.'].map(w => <span key={w} className="ct-w">{w}</span>)}
          <span className="ct-w ct-w--hl"><em>Repeat.</em></span>
        </h1>
        <p className="ct-lede">Water-soluble styling for hair and beard, from featherlight softness to full-grip structure. Find the one that fits your morning.</p>

        <div className="ct-bar">
          <div className="ct-tabs" role="tablist">
            {TABS.map(t => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>)}
          </div>
          <div className="ct-filter">
            <button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}>
              Filter by{filter !== 'any' && <em>: {FILTERS.find(f => f.id === filter)!.label}</em>}
              <svg viewBox="0 0 12 8" width="12" height="8" fill="none" stroke="currentColor" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none' }}><path d="M1 1l5 5 5-5" /></svg>
            </button>
            {open && (
              <ul role="listbox">
                {FILTERS.map(f => (
                  <li key={f.id}><button type="button" role="option" aria-selected={filter === f.id} onClick={() => { setFilter(f.id); setOpen(false) }}>{f.label}</button></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div ref={grid} className="ct-grid">
          {shown.map((p, i) => (
            <article key={p.id} className="ct-card">
              <a href={'/product.html?p=' + p.slug} className="ct-media" style={{ aspectRatio: RATIOS[i % RATIOS.length] }} aria-label={p.name}>
                <img src={p.img!} alt={p.name} loading="lazy" />
              </a>
              <h2 className="ct-name">{p.name}</h2>
              <div className="ct-sub">{p.sub}</div>
              <div className="ct-row">
                <b>{inr(PRICE)}</b>
                <button type="button" className="ct-heart" data-on={wish.includes(p.id) ? '' : undefined} aria-pressed={wish.includes(p.id)} aria-label={`Wishlist ${p.name}`} onClick={() => toggleWish(p.id)}><Heart on={wish.includes(p.id)} /></button>
              </div>
              <div className="ct-actions">
                <button type="button" className="ct-add" disabled={!p.stock} onClick={() => bag.add(p.id)}>{p.stock ? 'Add to cart' : 'Sold out'}</button>
                <a href={'/product.html?p=' + p.slug} className="ct-go" aria-label={`View ${p.name}`}><Arrow /></a>
              </div>
            </article>
          ))}
          {shown.length === 0 && <p className="ct-empty">Nothing matches that filter. Try another.</p>}
        </div>

      </main>

      <div className="ct-quiz"><Match onAdd={bag.add} onStep={() => {}} /></div>

      <footer className="ct-foot">
        <div className="ct-foot__grid">
          <nav className="ct-foot__links" aria-label="Footer">
            <a href="/">Home</a><a href="/story.html">Our story</a><a href="/products.html">Catalog</a>
            <a href="/shipping.html">Shipping</a><a href="/faq.html">FAQ</a><a href="/contact.html">Contact</a>
          </nav>
          <div className="ct-foot__brand">
            <img src="/assets/haxxed-logo.png" alt="HAXXED Grooming & Co." />
            <div className="ct-about"><b>HAXXED GROOMING CO.</b><p>We offer a wide range of products, including hair styling, beard nourishing, and skin care products, and we hope to continue growing with the youth of India. Our goal is to provide the best quality products and become the “best partner” brand for men.</p></div>
            <address className="ct-addr">
              <a href={'mailto:' + SUPPORT.email}>{SUPPORT.email}</a>
              <span>{SUPPORT.phones.map(([l, t], i) => <span key={t}>{i ? ' / ' : ''}<a href={'tel:' + t}>{l}</a></span>)}</span>
              <span>{SUPPORT.hours}</span>
              <span>{SUPPORT.address}</span>
            </address>
            <div className="ct-social"><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a><a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a></div>
          </div>
          <form className="ct-foot__sub" onSubmit={subscribe}>
            <h2>Subscribe</h2>
            <label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email address" /><button type="submit" aria-label="Subscribe"><Arrow /></button></label>
          </form>
        </div>
        <div className="ct-foot__legal"><a href="/privacy.html">Privacy policy</a><a href="/refund.html">Refund policy</a><a href="/terms.html">Terms of service</a><span>© 2026 HAXXED Grooming Co.</span></div>
      </footer>
    </div>
    </>
  )
}

export function CatalogPage() {
  return <Shell chrome={false}>{bag => <Catalog bag={bag} />}</Shell>
}
