import { useCallback, useEffect, useState } from 'react'
import LogoPreloader from '../effects/LogoPreloader'

const SEEN = 'hx-intro-seen'
const DURATION = 2 // seconds the logo holds before it lifts away
const seenAlready = () => { try { return sessionStorage.getItem(SEEN) === '1' } catch { return false } }

/** Logo intro: the HAXXED mark rises in, lifts away and the cover fades. Played once per browser session. */
export function Preloader() {
  const [show, setShow] = useState(() => !seenAlready())

  const done = useCallback(() => {
    try { sessionStorage.setItem(SEEN, '1') } catch { /* private mode: it simply plays again next time */ }
    setShow(false)
  }, [])

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    // The component removes itself at duration + 0.75 s; drop our wrapper just after.
    const t = window.setTimeout(done, DURATION * 1000 + 850)
    return () => { window.clearTimeout(t); document.body.style.overflow = '' }
  }, [show, done])

  if (!show) return null
  return (
    <div className="pl" role="presentation">
      <LogoPreloader
        logo={{ src: '/assets/haxxed-logo.png', alt: 'HAXXED Grooming & Co.' }}
        backgroundColor="#eeede8"
        duration={DURATION}
        logoSize={260}
      />
      <button type="button" className="pl__skip" onClick={done}>Skip</button>
    </div>
  )
}
