import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { FooterBeam } from '../effects/FooterBeam'
import { PRICE, inr, productById, type ProductId } from '../data'
import { Reveal, useFrame } from '../motion'
import { bundleMessage, type Cart, type bagTotals } from '../useBag'
import { ProductImage } from './Shop'

export function OfferBar() {
  return <div className="offer">Stack your shelf ✦ 2 jars save 10% ✦ 3+ save 20%</div>
}

export function Nav({ count, onBag }: { count: number; onBag: () => void }) {
  return (
    <nav className="nav">
      <a href="#top" className="nav__logo"><img src="/assets/haxxed-logo.png" alt="HAXXED Grooming & Co." /></a>
      <div className="nav__links">
        <a href="#bench">Shop</a>
        <a href="#looks">Looks</a>
        <a href="#match">Find your match</a>
        <a href="#story">Our story</a>
      </div>
      <button type="button" className="nav__bag" onClick={onBag} aria-label={`Bag, ${count} item${count === 1 ? '' : 's'}`}>
        Bag <span className="nav__count">{count}</span>
      </button>
    </nav>
  )
}

const LETTERS = Array.from('HAXXED')

function hop(e: ReactMouseEvent<HTMLSpanElement>) {
  const el = e.currentTarget
  el.animate?.([
    { transform: 'translateY(0) scale(1,1)' },
    { transform: 'translateY(.02em) scale(1.06,.9)', offset: 0.18 },
    { transform: 'translateY(-.14em) scale(.97,1.05)', offset: 0.45 },
    { transform: 'translateY(.01em) scale(1.02,.97)', offset: 0.7 },
    { transform: 'translateY(0) scale(1,1)' },
  ], { duration: 750, easing: 'cubic-bezier(.2,.8,.2,1)' })
}

export function Footer() {
  const rootRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const beam = useRef<FooterBeam | null>(null)

  useEffect(() => {
    const root = rootRef.current!
    const b = new FooterBeam(root, boxRef.current!, innerRef.current!, () => { root.dataset.in = '' })
    beam.current = b
    return () => { b.dispose(); beam.current = null }
  }, [])

  useFrame(() => beam.current?.frame())
  const onPtr = (e: ReactPointerEvent) => beam.current?.pointer(e)

  return (
    <footer id="footer" ref={rootRef} className="footer" onPointerMove={onPtr} onPointerEnter={onPtr} onPointerLeave={onPtr}>
      <div className="footer__edge" aria-hidden="true" />
      <div className="footer__light" aria-hidden="true">
        <i className="footer__wash" /><i className="footer__rays" /><i className="footer__beam" /><i className="footer__glow" />
      </div>

      <div className="footer__top">
        <Reveal className="footer__brand">
          <div className="footer__label">© 2026 HAXXED Grooming Co.</div>
          <div className="footer__tagline">Good hair. <span className="it-yellow">No hard rules.</span></div>
          <div className="footer__socials">
            <a href="#footer" title="Instagram" aria-label="Instagram" className="social">IG</a>
            <a href="#footer" title="YouTube" aria-label="YouTube" className="social">YT</a>
            <a href="#footer" title="@haxxedgroomingco" aria-label="@haxxedgroomingco" className="social">@</a>
          </div>
          <div className="footer__credit">Made in India, for Indian hair &amp; climate.<br /><span>Water-soluble.</span> No sulphates. No parabens.</div>
        </Reveal>
        <Reveal as="nav" delay={80} className="footer__col">
          <div className="footer__label">Explore</div>
          <a href="#bench" className="footer__link">All formulas</a>
          <a href="#looks" className="footer__link">Lookbook</a>
          <a href="#match" className="footer__link">Find your match</a>
          <a href="/jar-3d.html" className="footer__link">Inspect in 3D ↗</a>
        </Reveal>
        <Reveal as="nav" delay={160} className="footer__col">
          <div className="footer__label">Information</div>
          <a href="#story" className="footer__link">Our story</a>
          <a href="#footer" className="footer__link">Shipping</a>
          <a href="#footer" className="footer__link">FAQ</a>
          <a href="#footer" className="footer__link">Contact</a>
        </Reveal>
      </div>

      <div ref={boxRef} className="footer__word">
        <div className="footer__word-col">
          <div ref={innerRef} className="footer__word-in" aria-label="HAXXED" role="img">
            {LETTERS.map((ch, i) => (
              <span key={i} className="footer__lw" style={{ transitionDelay: 260 + i * 75 + 'ms' }}>
                <span data-fx="l" className="footer__l" onClick={hop}>{ch}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="footer__fade" aria-hidden="true" />
      </div>
      <div className="footer__bottom"><span>Clean styling · Made in India</span><a href="#top">Back to top ↑</a></div>
    </footer>
  )
}

type DrawerProps = {
  open: boolean
  cart: Cart
  totals: ReturnType<typeof bagTotals>
  onClose: () => void
  onQty: (id: ProductId, delta: number) => void
  onCheckout: () => void
}

export function BagDrawer({ open, cart, totals, onClose, onQty, onCheckout }: DrawerProps) {
  const { count, subtotal, saving, total } = totals
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const lines = Object.entries(cart) as [ProductId, number][]
  return (
    <>
      <div className="scrim" data-open={open ? '' : undefined} onClick={onClose} />
      <aside className="drawer" data-open={open ? '' : undefined} aria-label="Your bag" aria-hidden={!open} inert={!open}>
        <div className="drawer__head">
          <div className="drawer__title">Your bag</div>
          <button type="button" className="drawer__close" onClick={onClose}>Close</button>
        </div>
        <div className="drawer__bundle">
          <div>{bundleMessage(count)}</div>
          <div className="bar__track"><i style={{ width: Math.min(100, count / 3 * 100) + '%' }} /></div>
        </div>
        <div className="drawer__items">
          {count === 0 && (
            <div className="drawer__empty">
              <div>Nothing here yet. Your hair is waiting.</div>
              <a href="#bench" onClick={onClose} className="link-underline">Shop the bench →</a>
            </div>
          )}
          {lines.map(([id, qty]) => {
            const p = productById(id)
            return (
              <div key={id} className="line">
                <div className="line__media"><ProductImage product={p} /></div>
                <div className="line__body">
                  <div className="line__name">{p.name}</div>
                  <div className="qty">
                    <button type="button" aria-label={'Remove one ' + p.name} onClick={() => onQty(id, -1)}>−</button>
                    <span>{qty}</span>
                    <button type="button" aria-label={'Add one ' + p.name} onClick={() => onQty(id, 1)}>+</button>
                  </div>
                </div>
                <div className="line__total">{inr(qty * PRICE)}</div>
              </div>
            )
          })}
        </div>
        <div className="drawer__foot">
          <div className="sum"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
          <div className="sum"><span>Bundle saving</span><span>{saving ? '−' + inr(saving) : '—'}</span></div>
          <div className="sum sum--total"><span>Total</span><span>{inr(total)}</span></div>
          <button type="button" className="btn btn--yellow checkout" onClick={onCheckout}>Checkout · free delivery</button>
        </div>
      </aside>
    </>
  )
}

export function OneeDock({ hostRef, bubble, onPoke }: { hostRef: RefObject<HTMLSpanElement | null>; bubble: string | null; onPoke: () => void }) {
  return (
    <div className="onee">
      <button type="button" className="onee__btn" title="Onee, your style buddy" aria-label="Onee, your style buddy" onClick={onPoke}>
        <span ref={hostRef} className="onee__host" />
      </button>
      {bubble && (
        <div className="onee__bubble" role="status">
          <div className="onee__who">ONEE · STYLE BUDDY</div>{bubble}
        </div>
      )}
    </div>
  )
}

export function Toast({ message }: { message: string | null }) {
  return message ? <div className="toast" role="status">{message}</div> : null
}
