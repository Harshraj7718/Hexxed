import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { DETAILS } from '../data'

// The intro (and framer-motion with it) loads as its own chunk so it never weighs on the page code.
const ZoomImageIntro = lazy(() => import('../effects/ZoomImageIntro'))

const SEEN = 'hx-intro-seen'
/** Product shots shown in order; the last one is the one that lands. */
const SLUGS = ['clay-pomade', 'cream-pomade', 'define-cream', 'matte-paste', 'clay-pomade']
const BG = '#eeede8'

const seenAlready = () => { try { return sessionStorage.getItem(SEEN) === '1' } catch { return false } }

/** Decode every frame first so the zoom never starts with a missing picture (gives up after 2.5 s). */
function preload(urls: string[]) {
  const load = (src: string) => new Promise<void>(res => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = src })
  return Promise.race([Promise.all(urls.map(load)), new Promise(r => setTimeout(r, 2500))])
}

/** Full-screen product-image intro, played once per browser session. */
export function Preloader() {
  const [show, setShow] = useState(() => !seenAlready())
  const [ready, setReady] = useState(false)
  const images = SLUGS.map(s => ({ src: DETAILS[s].gallery[0], alt: DETAILS[s].name }))

  const done = useCallback(() => {
    try { sessionStorage.setItem(SEEN, '1') } catch { /* private mode: it simply plays again next time */ }
    setShow(false)
  }, [])

  useEffect(() => {
    if (!show) return
    let live = true
    preload(images.map(i => i.src)).then(() => { if (live) setReady(true) })
    document.body.style.overflow = 'hidden'
    return () => { live = false; document.body.style.overflow = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  if (!show) return null
  return (
    <div className="pl" role="presentation" style={{ background: BG }}>
      {ready && (
        <Suspense fallback={null}>
          <ZoomImageIntro
            images={images}
            content={{ contentZoom: 1.5, zoomDirection: 'out', objectFit: 'cover', background: BG }}
            motion={{ delayBetweenImages: 0.3, paceCurve: 'accelerate', transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.9 } }}
            dismiss={{ autoDismiss: true, holdAfterSequence: 0.15 }}
            onComplete={done}
          />
        </Suspense>
      )}
      <button type="button" className="pl__skip" onClick={done}>Skip</button>
    </div>
  )
}
