// Design "Tweaks" from the prototype, exposed as typed props with defaults.
// Each can also be overridden from the URL for quick tuning, e.g. /?marqueeSpeed=18&gridSpotlight=240

export type Tweaks = {
  /** Seconds for one loop of the yellow words marquee. */
  marqueeSpeed: number
  /** Flow-speed multiplier for the liquid-metal logo. 0 freezes it. */
  metalSpeed: number
  /** Hero dot-grid spacing in px. */
  gridSpacing: number
  /** Hero cursor spotlight radius in px. */
  gridSpotlight: number
}

type Range = { min: number; max: number; step: number; default: number; unit?: string }

export const TWEAK_RANGES: Record<keyof Tweaks, Range> = {
  marqueeSpeed: { min: 10, max: 60, step: 1, default: 28, unit: 's' },
  metalSpeed: { min: 0, max: 3, step: 0.1, default: 1 },
  gridSpacing: { min: 16, max: 60, step: 2, default: 30, unit: 'px' },
  gridSpotlight: { min: 80, max: 360, step: 10, default: 170, unit: 'px' },
}

const keys = Object.keys(TWEAK_RANGES) as (keyof Tweaks)[]

export const DEFAULT_TWEAKS = Object.fromEntries(keys.map(k => [k, TWEAK_RANGES[k].default])) as Tweaks

const clampTo = (k: keyof Tweaks, v: number) => Math.min(TWEAK_RANGES[k].max, Math.max(TWEAK_RANGES[k].min, v))

export function resolveTweaks(overrides: Partial<Tweaks> = {}, search = ''): Tweaks {
  const out = { ...DEFAULT_TWEAKS }
  const q = new URLSearchParams(search)
  for (const k of keys) {
    const fromProps = overrides[k]
    const fromUrl = q.get(k)
    if (typeof fromProps === 'number' && Number.isFinite(fromProps)) out[k] = clampTo(k, fromProps)
    if (fromUrl !== null && fromUrl !== '' && Number.isFinite(+fromUrl)) out[k] = clampTo(k, +fromUrl)
  }
  return out
}
