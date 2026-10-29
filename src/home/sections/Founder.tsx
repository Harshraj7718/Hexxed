import { Reveal } from '../motion'

/** Founder spotlight: cut-out portrait over a yellow sun, name set large, one line from the story. */
export function Founder({ more = false }: { more?: boolean }) {
  return (
    <section id="founder" className="fd">
      <div className="fd__bg" aria-hidden="true">HAXXED</div>

      <Reveal className="fd__visual">
        <span className="fd__sun" aria-hidden="true" />
        <span className="fd__ring" aria-hidden="true" />
        <img src="/assets/founder.webp" alt="Hardik Singhvi K, founder of HAXXED Grooming Co." loading="lazy" />
        <span className="fd__badge">Founder</span>
      </Reveal>

      <Reveal delay={120} className="fd__copy">
        <div className="eyebrow">The face behind the formula</div>
        <h2 className="fd__name">Hardik <em>Singhvi K</em></h2>
        <div className="fd__role">Founder · HAXXED Grooming Co.</div>
        <blockquote className="fd__quote">
          “Indian men deserve world class hair products. Made for our hair types, our styles, and our climate.”
        </blockquote>
        {more && <a href="/story.html" className="btn btn--outline fd__more">Read the full story</a>}
      </Reveal>
    </section>
  )
}
