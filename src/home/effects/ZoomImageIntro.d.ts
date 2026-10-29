import type { ComponentType, CSSProperties } from 'react'

export type IntroImage = { src: string; alt?: string; srcSet?: string }
declare const ZoomImageIntro: ComponentType<{
  images?: IntroImage[]
  content?: { contentZoom?: number; zoomDirection?: 'in' | 'out'; objectFit?: 'cover' | 'contain' | 'fill'; background?: string }
  motion?: { delayBetweenImages?: number; paceCurve?: 'even' | 'accelerate' | 'decelerate' | 'pulse'; transition?: { type?: string; ease?: number[]; duration?: number; delay?: number } }
  dismiss?: { autoDismiss?: boolean; holdAfterSequence?: number }
  onComplete?: () => void
  style?: CSSProperties
}>
export default ZoomImageIntro
