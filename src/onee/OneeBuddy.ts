// Onee, the style buddy: an imperative controller around the avatar runtime.
// Starts asleep, wakes on first scroll, gets drowsy after 20s idle and sleeps after 40s.
import { loadAvatarRuntime, type RuntimeAvatar } from './avatar-runtime'
import { avatarData, type AnimationName } from './onee.avatar'

export type { AnimationName }

const TIPS: [AnimationName, string][] = [
  ['playful', 'Tip: start with a pea-sized scoop, warm it in your palms.'],
  ['laughing', 'Hey! That tickles.'],
  ['happy', 'Everything here rinses out with plain water.'],
  ['excited', 'Damp hair = more control. Dry hair = more texture.'],
  ['shy', 'I’m Onee. I just live here.'],
]

export class OneeBuddy {
  /** True once the visitor has interacted (scrolled or poked Onee). */
  woke = false
  private avatar: RuntimeAvatar<AnimationName> | null = null
  private anim: AnimationName = 'sleeping'
  private lastAct = performance.now()
  private animTimer = 0
  private bubbleTimer = 0
  private idleTimer = 0
  private tipIndex = -1
  private gen = 0
  private onBubble: (line: string | null) => void

  constructor(onBubble: (line: string | null) => void) {
    this.onBubble = onBubble
  }

  mount(host: HTMLElement) {
    const gen = ++this.gen
    loadAvatarRuntime<AnimationName>(avatarData).then(rt => {
      if (gen !== this.gen || this.avatar) return
      this.avatar = rt.createAvatar(host, { animation: 'sleeping', autoplay: true, size: '100%', onAnimationEnd: () => {} })
      this.anim = 'sleeping'
    }).catch(e => console.warn('Onee failed to load', e))
    this.lastAct = performance.now()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.idleTimer = window.setInterval(() => {
      const idle = performance.now() - this.lastAct
      if (idle > 40000 && this.anim !== 'sleeping') this.setAnim('sleeping')
      else if (idle > 20000 && this.anim === 'idle') this.setAnim('drowsy')
    }, 2000)
  }

  private setAnim(a: AnimationName) {
    this.avatar?.play(a)
    this.anim = a
  }

  /** Play an animation, optionally with a speech-bubble line, then settle back to idle. */
  say = (anim: AnimationName, line?: string, ms = 3800) => {
    this.lastAct = performance.now()
    this.setAnim(anim)
    clearTimeout(this.animTimer)
    clearTimeout(this.bubbleTimer)
    if (line) {
      this.onBubble(line)
      this.bubbleTimer = window.setTimeout(() => this.onBubble(null), ms)
    }
    this.animTimer = window.setTimeout(() => { if (this.anim === anim) this.setAnim('idle') }, ms)
  }

  poke = () => {
    this.tipIndex = (this.tipIndex + 1) % TIPS.length
    this.woke = true
    this.say(TIPS[this.tipIndex][0], TIPS[this.tipIndex][1], 4500)
  }

  private onScroll = () => {
    if (this.anim === 'sleeping' || this.anim === 'drowsy')
      this.say('waking', this.woke ? 'I’m up, I’m up.' : 'Oh — hey. Keep scrolling, I’ll show you the good stuff.', 4200)
    this.woke = true
    this.lastAct = performance.now()
  }

  /** Undo mount(); a later mount() starts fresh. */
  dispose() {
    this.gen++
    clearTimeout(this.animTimer)
    clearTimeout(this.bubbleTimer)
    clearInterval(this.idleTimer)
    window.removeEventListener('scroll', this.onScroll)
    this.avatar?.destroy()
    this.avatar = null
  }
}
