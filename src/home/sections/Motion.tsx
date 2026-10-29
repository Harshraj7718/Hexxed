import { useEffect, useRef } from 'react'
import { PRODUCTS } from '../data'
import { Reveal } from '../motion'

/** Each film is paired with the product it shows; change `slug` to relink a video. */
const FILMS: { src: string; poster: string; slug: string; label: string }[] = [
  { src: '/assets/videos/motion-1.mp4', poster: '/assets/videos/motion-1.jpg', slug: 'clay-pomade', label: 'The morning routine' },
  { src: '/assets/videos/motion-2.mp4', poster: '/assets/videos/motion-2.jpg', slug: 'cream-pomade', label: 'Sharp, in one motion' },
  { src: '/assets/videos/motion-3.mp4', poster: '/assets/videos/motion-3.jpg', slug: 'matte-paste', label: 'Zero shine, full grip' },
]

function Film({ film, i }: { film: (typeof FILMS)[number]; i: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  const product = PRODUCTS.find(p => p.slug === film.slug)

  // Play only while on screen, so three videos never decode at once off-screen.
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.45 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <Reveal delay={i * 110} className="film">
      <div className="film__frame">
        <video ref={ref} src={film.src} poster={film.poster} muted loop playsInline preload="metadata" aria-label={film.label} />
        <span className="film__tag">{String(i + 1).padStart(2, '0')} — {film.label}</span>
      </div>
      {product && (
        <a className="film__link" href={'/product.html?p=' + product.slug}>
          <span>Shop {product.name}</span>
          <span aria-hidden="true">→</span>
        </a>
      )}
    </Reveal>
  )
}

export function InMotion() {
  return (
    <section id="motion" className="motion">
      <Reveal className="section-head">
        <div className="stack-14">
          <div className="eyebrow">HAXXED / in motion</div>
          <h2 className="h2">HAXXED styling, <span className="hl">in motion.</span></h2>
        </div>
        <p className="lede">See how it goes on, how it moves, and how it holds. No filters, just the jar and the hair.</p>
      </Reveal>
      <div className="films">
        {FILMS.map((f, i) => <Film key={f.src} film={f} i={i} />)}
      </div>
    </section>
  )
}
