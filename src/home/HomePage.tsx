import { useCallback, useMemo } from 'react'
import { resolveTweaks, type Tweaks } from '../config'
import { useBag } from './useBag'
import { Hero } from './sections/Hero'
import { Preloader } from './sections/Preloader'
import { Born, Crew, Introducing, Marquee, OriginStory, Standard } from './sections/Story'
import { Bench, Looks, Match } from './sections/Shop'
import { InMotion } from './sections/Motion'
import { Founder } from './sections/Founder'
import { HomeReviews } from './sections/Reviews'
import { InstagramFeed } from './sections/Instagram'
import { BagDrawer, Footer, Nav, OfferBar, Toast, WhatsAppButton } from './sections/Chrome'
import './home.css'

export function HomePage({ tweaks: overrides }: { tweaks?: Partial<Tweaks> }) {
  const tweaks = useMemo(() => resolveTweaks(overrides, window.location.search), [overrides])
  const bag = useBag()

  const { add, setOpen } = bag
  const openBag = () => setOpen(true)
  const closeBag = useCallback(() => setOpen(false), [setOpen])

  // "Buy now" adds Clay Pomade; the 3-jar box uses only in-stock formulas.
  const buyNow = () => { add('clay'); setOpen(true) }
  const buyTrio = () => {
    bag.addMany(['clay', 'define', 'matte'])
    setOpen(true)
    bag.flash('3-jar box added — 15% off unlocked')
  }

  const checkout = () => {
    bag.flash(bag.totals.count > 0 ? 'Prototype only — no payment processed' : 'Your bag is empty')
  }

  return (
    <div className="page">
      <Preloader />
      <OfferBar />
      <Nav count={bag.totals.count} onBag={openBag} />
      <Hero
        gridSpacing={tweaks.gridSpacing}
        gridSpotlight={tweaks.gridSpotlight}
        onAdd={add}
        onBuyNow={buyNow}
        onBuyTrio={buyTrio}
        onPacked={() => {}}
      />
      <HomeReviews />
      <Marquee seconds={tweaks.marqueeSpeed} />
      <Born metalSpeed={tweaks.metalSpeed} />
      <Crew />
      <Introducing />
      <Standard />
      <Bench onAdd={add} />
      <Match onAdd={add} onStep={() => {}} />
      <Looks onAdd={add} />
      <InMotion />
      <InstagramFeed />
      <OriginStory />
      <Founder more />
      <Footer />
      <BagDrawer open={bag.open} cart={bag.cart} totals={bag.totals} onClose={closeBag} onQty={bag.setQty} onCheckout={checkout} prepaid={bag.prepaid} onPrepaid={bag.setPrepaid} />
      <Toast message={bag.toast} />
      <WhatsAppButton />
    </div>
  )
}
