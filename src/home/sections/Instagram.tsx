import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../contact'
import { Reveal } from '../motion'

/** Tiles reuse our own look and product shots; swap in real post images here. */
const TILES = [
  '/assets/look-quiff.webp',
  '/assets/products/clay-pomade/g1.webp',
  '/assets/look-crop.webp',
  '/assets/products/matte-paste/g1.webp',
  '/assets/look-curls.webp',
  '/assets/products/define-cream/g1.webp',
]

export function InstagramFeed() {
  return (
    <section id="instagram" className="ig">
      <Reveal className="section-head">
        <div className="stack-14">
          <div className="eyebrow">Follow the latest</div>
          <h2 className="h2">HAXXED on <span className="hl">Instagram.</span></h2>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="bench__all">@{INSTAGRAM_HANDLE} →</a>
      </Reveal>

      <div className="ig__grid">
        <Reveal className="ig__profile">
          <div className="ig__top">
            <span className="ig__avatar"><img src="/assets/haxxed-logo.png" alt="" /></span>
            <div className="ig__id">
              <b>{INSTAGRAM_HANDLE}</b>
              <span>HAXXED Grooming Co.</span>
            </div>
          </div>
          <p>Style hard. Rinse easy. Clean, water-soluble styling built for Indian hair.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn--yellow ig__follow">Follow on Instagram</a>
        </Reveal>

        <div className="ig__tiles">
          {TILES.map((src, i) => (
            <Reveal key={src} delay={i * 70}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="ig__tile" aria-label="View HAXXED on Instagram">
                <img src={src} alt="" loading="lazy" />
                <span>View on Instagram</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
