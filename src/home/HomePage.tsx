import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { resolveTweaks, type Tweaks } from '../config'
import { OneeBuddy, type AnimationName } from '../onee/OneeBuddy'
import { productById, type ProductId } from './data'
import { useBag } from './useBag'
import { Hero } from './sections/Hero'
import { Born, Crew, Introducing, Marquee, OriginStory, Standard } from './sections/Story'
import { Bench, Looks, Match } from './sections/Shop'
import { BagDrawer, Footer, Nav, OfferBar, OneeDock, Toast } from './sections/Chrome'
import './home.css'

/** One-time Onee lines when these sections first come into view. */
const SECTION_LINES: Record<string, [AnimationName, string]> = {
  standard: ['proud', 'Six rules. We don’t break any of them.'],
  match: ['curious', 'Three taps and I’ll pick your formula.'],
  looks: ['excited', 'Pick a cut. I’ll hand you the jar.'],
}

export function HomePage({ tweaks: overrides }: { tweaks?: Partial<Tweaks> }) {
  const tweaks = useMemo(() => resolveTweaks(overrides, window.location.search), [overrides])
  const bag = useBag()
  const [bubble, setBubble] = useState<string | null>(null)
  const oneeHost = useRef<HTMLSpanElement>(null)
  const [buddy] = useState(() => new OneeBuddy(setBubble))

  useEffect(() => {
    buddy.mount(oneeHost.current!)
    const seen = new Set<string>()
    const io = new IntersectionObserver(es => es.forEach(en => {
      const id = en.target.id
      if (en.isIntersecting && !seen.has(id) && buddy.woke) { seen.add(id); buddy.say(...SECTION_LINES[id]) }
    }), { threshold: 0.35 })
    Object.keys(SECTION_LINES).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => { io.disconnect(); buddy.dispose() }
  }, [buddy])

  const { add: addToBag, setOpen } = bag
  const add = useCallback((id: ProductId) => {
    const n = addToBag(id)
    buddy.say('celebrate', n >= 3 ? 'Three jars! 20% off unlocked. Respect.' : n === 2 ? 'Two down — one more and you save 20%.' : 'Great pick. Add another and save 10%.')
  }, [addToBag, buddy])

  const openBag = () => {
    bag.setOpen(true)
    buddy.say('curious', bag.totals.count ? 'Ooh, let’s see what you picked.' : 'Empty? We can fix that.')
  }
  const closeBag = useCallback(() => setOpen(false), [setOpen])

  // "Buy now" adds the last jar shown in the hero (Cream Pomade).
  const buyNow = () => { add('cream'); bag.setOpen(true) }
  const buyTrio = () => {
    bag.addMany(['clay', 'define', 'cream'])
    bag.setOpen(true)
    bag.flash('3-jar box added — 20% off unlocked')
    buddy.say('celebrate', 'The full set. Excellent taste.')
  }

  const checkout = () => {
    const has = bag.totals.count > 0
    bag.flash(has ? 'Prototype only — no payment processed' : 'Your bag is empty')
    buddy.say(has ? 'shy' : 'confused', has ? 'Psst… this is a prototype. No payments yet.' : 'Checkout… with nothing?')
  }

  const quizStep = (step: number, result: ProductId | null) => {
    if (result) buddy.say('proud', 'Called it: ' + productById(result).name + '. Trust me on this one.', 5000)
    else buddy.say('thinking', step === 1 ? 'Hmm, noted…' : 'Getting warmer…', 2400)
  }

  return (
    <div className="page">
      <OfferBar />
      <Nav count={bag.totals.count} onBag={openBag} />
      <Hero
        gridSpacing={tweaks.gridSpacing}
        gridSpotlight={tweaks.gridSpotlight}
        onAdd={add}
        onBuyNow={buyNow}
        onBuyTrio={buyTrio}
        onPacked={() => buddy.say('celebrate', 'Boxed, taped, ready to roll. Your move.', 4500)}
      />
      <Marquee seconds={tweaks.marqueeSpeed} />
      <Born metalSpeed={tweaks.metalSpeed} />
      <Crew />
      <Introducing />
      <Standard />
      <Bench onAdd={add} />
      <Match onAdd={add} onStep={quizStep} />
      <Looks onAdd={add} />
      <OriginStory />
      <Footer />
      <BagDrawer open={bag.open} cart={bag.cart} totals={bag.totals} onClose={closeBag} onQty={bag.setQty} onCheckout={checkout} />
      <OneeDock hostRef={oneeHost} bubble={bubble} onPoke={buddy.poke} />
      <Toast message={bag.toast} />
    </div>
  )
}
