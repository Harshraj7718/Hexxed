import { useRef, useState } from 'react'
import LiquidMetalLogo from '../effects/FramerLiquidMetal'
import { MARQUEE_WORDS, PILLARS, QUESTION, STATS } from '../data'
import { CountUp, Reveal, cl, ease, sectionProgress, seg, useFrame } from '../motion'

const LOGO = '/assets/haxxed-logo-metal.png'
const WORDS = QUESTION.split(' ')

export function Marquee({ seconds }: { seconds: number }) {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS]
  return (
    <section className="marquee" aria-label={MARQUEE_WORDS.join(', ')}>
      <div className="marquee__track" style={{ animationDuration: seconds + 's' }} aria-hidden="true">
        {items.map((m, i) => <div key={i} className="marquee__item">{m} <span>✦</span></div>)}
      </div>
    </section>
  )
}

/** The question fills in word by word as you scroll, then gives way to the liquid-metal logo. */
export function Born({ metalSpeed }: { metalSpeed: number }) {
  const sectionRef = useRef<HTMLElement>(null)
  const questionRef = useRef<HTMLDivElement>(null)
  const bornRef = useRef<HTMLDivElement>(null)
  useFrame(() => {
    const pb = sectionProgress(sectionRef.current)
    const q = questionRef.current, bn = bornRef.current
    if (!q || !bn) return
    const fill = seg(pb, 0.04, 0.55) * WORDS.length
    q.querySelectorAll<HTMLElement>('[data-w]').forEach((w, i) => { w.style.opacity = String(0.14 + 0.86 * cl(fill - i)) })
    const out = seg(pb, 0.6, 0.72)
    q.style.opacity = String(1 - out)
    q.style.transform = `translateY(${-out * 60}px)`
    const b = ease(seg(pb, 0.7, 0.92))
    bn.style.opacity = String(b)
    bn.style.transform = `scale(${0.7 + 0.3 * b})`
  })

  return (
    <section ref={sectionRef} className="born">
      <div className="born__stage">
        <div ref={questionRef} className="born__question">
          <div className="eyebrow">It all started with one stubborn question.</div>
          <h2 className="born__words" style={{ margin: 0, fontWeight: 400 }}>
            {WORDS.map((w, i) => <span key={i} data-w={i}>{w}</span>)}
          </h2>
        </div>
        <div ref={bornRef} className="born__reveal">
          <div className="eyebrow">Turns out, yes. So</div>
          <div className="born__logo" role="img" aria-label="HAXXED">
            <LiquidMetalLogo imageSource={LOGO} speed={0.3 * metalSpeed} dispersion={0.015} edge={0.4} patternBlur={0.005} liquify={0.07} patternScale={2} />
          </div>
          <div className="born__was">was born.</div>
        </div>
      </div>
    </section>
  )
}

export function Crew() {
  return (
    <section className="crew">
      <Reveal className="section-head">
        <div className="stack-14">
          <div className="eyebrow">The people behind the styles</div>
          <h2 className="h2">A crew, not a <span className="hl">customer list.</span></h2>
        </div>
        <p className="lede">Thousands of men who stopped settling for crunchy, greasy, flaky hair — and never went back.</p>
      </Reveal>
      <div className="stats">
        {STATS.map((s, i) => (
          <Reveal key={s.small} delay={i * 90} className="stat">
            <div className="stat__big"><CountUp to={s.count} dec={s.dec} initial={s.big} />{s.suffix}</div>
            <div className="stat__small">{s.small}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Introducing() {
  return (
    <section className="intro">
      <Reveal className="intro__head">
        <div className="eyebrow">Introducing</div>
        <h2 className="intro__title">Style hard.<br /><span className="hl">Rinse easy.</span></h2>
      </Reveal>
      <Reveal delay={150} className="intro__body">
        <p>HAXXED Grooming Co. exists because your styling shouldn’t cost you your scalp. We brought international-grade formulas to India and stripped out what doesn’t belong — harsh chemicals, fake claims, heavy residue.</p>
        <p>Every jar is researched around Indian hair types and Indian weather, so the look you leave home with is the look you come home with. Heat, humidity, and all.</p>
      </Reveal>
    </section>
  )
}

export function Standard() {
  const [open, setOpen] = useState(0)
  return (
    <section id="standard" className="standard">
      <Reveal className="standard__head">
        <div className="eyebrow">The HAXXED standard</div>
        <h2 className="h2">Nourishing <span className="hl">+</span> styling.<br />No trade-offs.</h2>
        <p>Most products make you pick: great hair today, or healthy hair tomorrow. We built every formula to be used daily without harming hair or scalp. Six rules keep us honest.</p>
      </Reveal>
      <div className="pillars">
        {PILLARS.map(([title, desc], i) => (
          <Reveal key={title} delay={i * 60}>
            <button type="button" className="pillar" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="pillar__row">
                <span className="pillar__num">0{i + 1}</span>
                <span className="pillar__title">{title}</span>
                <span className="pillar__plus" aria-hidden="true">+</span>
              </div>
              {open === i && <div className="pillar__desc">{desc}</div>}
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function OriginStory() {
  return (
    <section id="story" className="story">
      <Reveal>
        <div className="eyebrow">How it all started</div>
        <h2 className="h2">Born from a <span className="hl">bad hair decade.</span></h2>
        <p>This never started as a business. It started as frustration. For years, every shelf in India offered the same deal: one product for everyone. No thought for hair type. No options for different styles. No real performance.</p>
        <p>So we stopped searching and started building — the range we always wished existed.</p>
        <a href="#story" className="story__more">Read the full story →</a>
      </Reveal>
    </section>
  )
}
