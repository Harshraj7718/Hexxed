import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { INSTAGRAM_URL, SUPPORT, YOUTUBE_URL, whatsappUrl } from '../../contact'
import { FooterBeam } from '../effects/FooterBeam'
import { PRICE, inr, productById, type ProductId } from '../data'
import { Reveal, useFrame } from '../motion'
import { bundleMessage, type Cart, type bagTotals } from '../useBag'
import { ProductImage } from './Shop'

const OFFERS = ['Buy 2 get 10% off', 'Buy 3 get 15% off', 'Buy 4 get 20% off', 'Get 5% additional discount on prepaid', 'Free delivery pan India']

export function OfferBar() {
  const items = [...OFFERS, ...OFFERS, ...OFFERS, ...OFFERS]
  return (
    <div className="offer" role="region" aria-label="Offers">
      <span className="sr-only">{OFFERS.join('. ')}</span>
      <div className="offer__track" aria-hidden="true">
        {items.map((t, i) => <span key={i}>{t}<i> ✦ </i></span>)}
      </div>
    </div>
  )
}

export function Nav({ count, onBag }: { count: number; onBag?: () => void }) {
  return (
    <nav className="nav">
      <a href="/#top" className="nav__logo"><img src="/assets/haxxed-logo.png" alt="HAXXED Grooming & Co." /></a>
      <div className="nav__links">
        <a href="/products.html">Our products</a>
        <a href="/story.html">Our story</a>
        <a href="/shipping.html">Shopping info</a>
        <a href="/contact.html">Contact</a>
        <a href="/faq.html">FAQ</a>
      </div>
      {onBag
        ? <button type="button" className="nav__bag" onClick={onBag} aria-label={`Bag, ${count} item${count === 1 ? '' : 's'}`}>
            Bag <span className="nav__count">{count}</span>
          </button>
        : <a href="/products.html" className="nav__bag">Shop</a>}
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
          <div className="footer__about">
            <b>HAXXED GROOMING CO.</b>
            <p>We offer a wide range of products, including hair styling, beard nourishing, and skin care products, and we hope to continue growing with the youth of India. Our goal is to provide the best quality products and become the “best partner” brand for men.</p>
          </div>
          <div className="footer__socials">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" className="social">IG</a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube" className="social">YT</a>
            <a href="#footer" title="@haxxedgroomingco" aria-label="@haxxedgroomingco" className="social">@</a>
          </div>
          <div className="footer__credit">Made in India, for Indian hair &amp; climate.<br /><span>Water-soluble.</span> No sulphates. No parabens.</div>
        </Reveal>
        <Reveal as="nav" delay={80} className="footer__col">
          <div className="footer__label">Explore</div>
          <a href="/#bench" className="footer__link">All formulas</a>
          <a href="/#looks" className="footer__link">Lookbook</a>
          <a href="/#match" className="footer__link">Find your match</a>
        </Reveal>
        <Reveal as="nav" delay={160} className="footer__col">
          <div className="footer__label">Information</div>
          <a href="/story.html" className="footer__link">Our story</a>
          <a href="/shipping.html" className="footer__link">Shopping info</a>
          <a href="/faq.html" className="footer__link">FAQ</a>
          <a href="/contact.html" className="footer__link">Contact</a>
          <a href="/privacy.html" className="footer__link">Privacy policy</a>
          <a href="/refund.html" className="footer__link">Refund policy</a>
          <a href="/terms.html" className="footer__link">Terms of service</a>
        </Reveal>
        <Reveal as="nav" delay={240} className="footer__col footer__col--contact">
          <div className="footer__label">Contact information</div>
          <a href={'mailto:' + SUPPORT.email} className="footer__link">{SUPPORT.email}</a>
          {SUPPORT.phones.map(([label, tel]) => <a key={tel} href={'tel:' + tel} className="footer__link">{label}</a>)}
          <div className="footer__text">{SUPPORT.hours}</div>
          <div className="footer__text">{SUPPORT.address}</div>
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
  prepaid: boolean
  onPrepaid: (v: boolean) => void
}

export function BagDrawer({ open, cart, totals, onClose, onQty, onCheckout, prepaid, onPrepaid }: DrawerProps) {
  const { count, subtotal, saving, prepaidSaving, total } = totals
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
          <div className="bar__track"><i style={{ width: Math.min(100, count / 4 * 100) + '%' }} /></div>
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
          <label className="prepay">
            <input type="checkbox" checked={prepaid} onChange={e => onPrepaid(e.target.checked)} />
            <span>Pay online (prepaid) · extra 5% off</span>
          </label>
          {prepaid && <div className="sum"><span>Prepaid discount</span><span>−{inr(prepaidSaving)}</span></div>}
          <div className="sum"><span>Delivery</span><span>Free</span></div>
          <div className="sum sum--total"><span>Total</span><span>{inr(total)}</span></div>
          <button type="button" className="btn btn--yellow checkout" onClick={onCheckout}>Checkout · free delivery pan India</button>
        </div>
      </aside>
    </>
  )
}

export function Toast({ message }: { message: string | null }) {
  return message ? <div className="toast" role="status">{message}</div> : null
}

export function WhatsAppButton({ showShop = true }: { showShop?: boolean }) {
  return (
    <div className="fab">
    {showShop && (
      <a className="fab__shop" href="/products.html" aria-label="Go to products">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h16l-1.5 11a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 8zM8 8a4 4 0 0 1 8 0" /></svg>
        <span>Go to products</span>
      </a>
    )}
    <a className="wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.18 1.6 6L4 28l7.1-1.86a12 12 0 0 0 4.94 1.06C22.68 27.2 28 21.8 28 15.16 28 8.5 22.7 3 16.04 3zm0 22.1c-1.5 0-2.98-.4-4.26-1.16l-.3-.18-4.2 1.1 1.12-4.1-.2-.32a9.9 9.9 0 0 1-1.52-5.3c0-5.5 4.5-9.96 10-9.96 5.46 0 9.9 4.46 9.9 9.94 0 5.5-4.44 9.98-9.54 9.98zm5.5-7.46c-.3-.16-1.78-.88-2.06-.98-.28-.1-.48-.16-.68.16-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.08-.3-.16-1.28-.48-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.14-.62.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.06-.38-.02-.54-.08-.16-.68-1.64-.94-2.24-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.54.08-.82.38-.28.3-1.08 1.06-1.08 2.58 0 1.52 1.1 3 1.26 3.2.16.2 2.18 3.32 5.28 4.66.74.32 1.32.5 1.76.64.74.24 1.42.2 1.96.12.6-.1 1.84-.76 2.1-1.48.26-.72.26-1.34.18-1.48-.08-.12-.28-.2-.58-.36z" />
      </svg>
      <span>Chat with us</span>
    </a>
    </div>
  )
}
