export const PRICE = 599
export const MRP = 799

import details from './productDetails.json'

export type ProductId = 'clay' | 'define' | 'cream' | 'matte' | 'sculpting' | 'wax' | 'texture' | 'stylingclay' | 'mud' | 'gel' | 'beardwax' | 'beardbutter'

export type Product = {
  id: ProductId
  slug: string
  name: string
  tag: string
  sub: string
  pitch: string
  hold: number
  shine: number
  /** Ratings without published numbers are shown with a ≈ prefix. */
  approx?: boolean
  img: string | null
  accent: string
  stock: boolean
}

const ACCENT: Partial<Record<ProductId, string>> = { clay: '#4a3c34', define: '#2c7a6e', cream: '#4636a6', matte: '#141412' }
const PITCH: Partial<Record<ProductId, string>> = {
  clay: 'The all-day architect. Height and structure that won’t quit.',
  define: 'Softness on command. Curls and waves that move like they should.',
  cream: 'Shine that means business. Slick-backs, side parts, sharp edges.',
  matte: 'Zero shine, full grip. The “I just woke up like this” lie.',
}

export type ProductDetail = (typeof details)[keyof typeof details]
export const DETAILS = details as Record<string, ProductDetail>

export const PRODUCTS: Product[] = Object.entries(details).map(([slug, d]) => ({
  id: d.id as ProductId,
  slug,
  name: d.name,
  tag: d.tag,
  sub: d.sub,
  pitch: PITCH[d.id as ProductId] ?? d.sub,
  hold: d.hold,
  shine: d.shine,
  approx: d.approx || undefined,
  img: d.gallery[0] ?? null,
  accent: ACCENT[d.id as ProductId] ?? '#141412',
  stock: d.stock,
}))

export const productById = (id: ProductId) => PRODUCTS.find(p => p.id === id)!

/** Hero product chapters; `ch` indexes into HERO_WINDOWS. */
export const CHAPTERS: { ch: number; id: ProductId; num: string; hook: string; copy: string; hold: number; shine: number }[] = [
  { ch: 2, id: 'clay', num: '01', hook: 'The all-day architect.', copy: 'Extreme hold with a natural finish. Builds height and texture that stay put from first meeting to last call — through heat, humidity and helmets.', hold: 5, shine: 3 },
  { ch: 3, id: 'define', num: '02', hook: 'Softness, on command.', copy: '2× softness and smoothness with a light, touchable hold. Tames frizz, defines curls and waves, and never feels like product.', hold: 1, shine: 1 },
  { ch: 4, id: 'cream', num: '03', hook: 'Shine that means business.', copy: 'High hold meets high shine. For slick-backs, side parts and sharp edges — and it still rinses out with plain water.', hold: 5, shine: 4 },
]

/**
 * Scroll-progress windows [start, end] for each hero overlay:
 * 0 intro · 1 lid open · 2–4 product chapters · 5 packed & sealed.
 * These line up with the timings in HeroScene.
 */
export const HERO_WINDOWS: [number, number][] = [[-1, 0.12], [0.15, 0.35], [0.41, 0.545], [0.575, 0.675], [0.705, 0.785], [0.955, 2]]

export const PILLARS: [string, string][] = [
  ['Nothing shady in the jar.', 'No sulphates, no parabens. Water-soluble formulas that rinse out with plain water.'],
  ['Stylist-approved.', 'Put through the chair by top stylists before it ever reaches yours.'],
  ['Ingredients with a résumé.', 'Premium ingredients picked for performance, feel and hair compatibility.'],
  ['Built for here.', 'Formulated around Indian hair types, heat and humidity — not imported guesswork.'],
  ['Hold that clocks overtime.', 'Consistent performance from the morning commute to the late dinner.'],
  ['Style daily, guilt-free.', 'Nourishing + styling. Gentle on hair and scalp, every single day.'],
]

export const QUIZ: { q: string; o: string[] }[] = [
  { q: 'Your hair, honestly?', o: ['Straight & fine', 'Thick & wavy', 'Curly & coily'] },
  { q: 'The look you’re chasing?', o: ['Matte & textured', 'Natural & lived-in', 'Slick & shiny', 'Soft & defined'] },
  { q: 'How long does it need to last?', o: ['A few hours', 'The full workday', 'Wedding-level, all night'] },
]

export const WHY: Partial<Record<ProductId, string>> = {
  matte: 'Full grip with zero shine — texture that reads effortless, even when it isn’t.',
  clay: 'Extreme hold with a natural finish. Your look, locked in, without the helmet effect.',
  cream: 'High hold and high shine for clean, sharp, slicked styles that last.',
  define: 'Light hold with 2× softness — definition without the crunch.',
}

export function quizResult(ans: string[]): ProductId {
  const look = ans[1]
  if (look === 'Matte & textured') return 'matte'
  if (look === 'Slick & shiny') return 'cream'
  if (look === 'Soft & defined') return ans[2] === 'Wedding-level, all night' ? 'clay' : 'define'
  return ans[0] === 'Curly & coily' && ans[2] === 'A few hours' ? 'define' : 'clay'
}

export const STATS: { count: number; dec: number; big: string; suffix: string; small: string }[] = [
  { count: 10000, dec: 0, big: '10,000', suffix: '+', small: 'men styling with HAXXED every day' },
  { count: 87.9, dec: 1, big: '87.9', suffix: '%', small: 'come back for another jar' },
  { count: 29000, dec: 0, big: '29,000', suffix: '+', small: 'pincodes with free delivery' },
  { count: 0, dec: 0, big: 'Made', suffix: ' in India', small: 'for Indian hair and climate' },
  { count: 0, dec: 0, big: 'Pro', suffix: ' tested', small: 'approved by top stylists' },
]

export const LOOKS: { img: string; pos: string; tag: string; title: string; note: string; product: string; id: ProductId }[] = [
  { img: '/assets/look-quiff.webp', pos: 'center 30%', tag: 'Extreme hold', title: 'The Textured Quiff', note: 'Height up front, tight fade, zero flop by 6 pm.', product: 'CLAY POMADE', id: 'clay' },
  { img: '/assets/look-crop.webp', pos: 'center 20%', tag: 'Matte finish', title: 'The Messy Crop', note: 'Piece-y, undone, deliberately effortless.', product: 'MATTE PASTE', id: 'matte' },
  { img: '/assets/look-curls.webp', pos: 'center 25%', tag: 'Soft hold', title: 'The Curl Cloud', note: 'Defined curls, no crunch, no frizz.', product: 'DEFINE CREAM', id: 'define' },
]

export const MARQUEE_WORDS = ['Control', 'Texture', 'Movement', 'Finish']

export const QUESTION = 'Can hair styling and hair health go together?'

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')
export const dots = (n: number) => '●'.repeat(Math.round(n)) + '○'.repeat(5 - Math.round(n))
