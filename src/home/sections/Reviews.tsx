import { useMemo } from 'react'
import { PRODUCTS, type Product } from '../data'
import { Reveal } from '../motion'
import { readAllReviews, type Entry } from '../../pages/reviews'

type Card = { product: Product; review: Entry | null }

const MIN_CARDS = 6
const MAX_CARDS = 12

function Stars({ value }: { value: number }) {
  return (
    <span className="rv-stars" role="img" aria-label={`${value} out of 5`}>
      <span>★★★★★</span><span style={{ width: (value / 5) * 100 + '%' }}>★★★★★</span>
    </span>
  )
}

function ReviewCard({ card }: { card: Card }) {
  const { product: p, review: r } = card
  return (
    <article className="rcard">
      <div className="rcard__body">
        <div className="rcard__q" aria-hidden="true">“</div>
        <div className="rcard__who">
          <span className="rcard__avatar" aria-hidden="true">{r ? r.name.trim().charAt(0).toUpperCase() : '?'}</span>
          <Stars value={r ? r.rating : 0} />
        </div>
        <p className="rcard__text">{r ? (r.title ? r.title + ' — ' : '') + r.text : 'No reviews yet. Be the first to tell the crew how it held up.'}</p>
        <div className="rcard__foot">
          {r
            ? <span>{r.name} · Customer review</span>
            : <a href={'/product.html?p=' + p.slug + '#reviews'}>Write a review →</a>}
        </div>
      </div>
      <a className="rcard__media" href={'/product.html?p=' + p.slug} aria-label={'View ' + p.name}>
        <img src={p.img!} alt="" loading="lazy" />
        <span>{p.name}</span>
      </a>
    </article>
  )
}

/** Customer reviews as a looping rail of cards, each with the product it is about. */
export function HomeReviews() {
  const all = useMemo(readAllReviews, [])
  const avg = all.length ? all.reduce((a, r) => a + r.rating, 0) / all.length : 0

  const cards = useMemo<Card[]>(() => {
    const real: Card[] = all.flatMap(r => {
      const product = PRODUCTS.find(p => p.slug === r.slug)
      return product ? [{ product, review: r }] : []
    })
    if (real.length >= MIN_CARDS) return real.slice(0, MAX_CARDS)
    // Fill the rail with "write the first review" cards for products that have none yet.
    const reviewed = new Set(real.map(c => c.product.slug))
    const fill: Card[] = PRODUCTS.filter(p => !reviewed.has(p.slug)).map(product => ({ product, review: null }))
    return [...real, ...fill].slice(0, Math.max(MIN_CARDS, real.length))
  }, [all])

  return (
    <section id="reviews" className="hrv">
      <Reveal className="section-head hrv__head">
        <div className="stack-14">
          <div className="eyebrow">Customer reviews</div>
          <h2 className="h2">Heard it from <span className="hl">the crew.</span></h2>
        </div>
        {all.length > 0 && (
          <div className="hrv__avg"><b>{avg.toFixed(1)}</b><Stars value={avg} /><span>{all.length} review{all.length === 1 ? '' : 's'}</span></div>
        )}
      </Reveal>

      <div className="rail" aria-label="Customer reviews">
        <div className="rail__track" style={{ animationDuration: Math.max(30, cards.length * 7) + 's' }}>
          {[0, 1].map(copy => (
            <div className="rail__set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {cards.map((c, i) => <ReviewCard key={c.product.slug + i} card={c} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
