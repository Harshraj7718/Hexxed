import type { ComponentType } from 'react'

declare const LogoPreloader: ComponentType<{
  logo?: { src: string; alt?: string }
  backgroundColor?: string
  duration: number
  logoSize: number
  videoFile?: string
  backgroundImage?: { src: string; alt?: string }
  logoInEasing?: string
  logoOutEasing?: string
  backgroundFadeEasing?: string
}>
export default LogoPreloader
