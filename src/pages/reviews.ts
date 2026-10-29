import seed from './reviews.json'

export type Review = { name: string; rating: number; title: string; text: string; date: string }
export type Entry = Review & { slug: string }

const STORE = 'hx-reviews'
const seeded = seed as Record<string, Review[]>

const readStore = (): Record<string, Review[]> => {
  try { return JSON.parse(localStorage.getItem(STORE) ?? '{}') } catch { return {} }
}

/** Reviews visitors posted on this device. */
export const loadLocal = (slug: string): Review[] => readStore()[slug] ?? []

export function saveLocal(slug: string, list: Review[]) {
  try { localStorage.setItem(STORE, JSON.stringify({ ...readStore(), [slug]: list })) } catch { /* storage unavailable: the review still shows for this visit */ }
}

/** Reviews shipped in reviews.json. */
export const seededFor = (slug: string): Review[] => seeded[slug] ?? []

/** Every review across all products, newest first. */
export function readAllReviews(): Entry[] {
  const local = readStore()
  const out: Entry[] = []
  for (const slug of new Set([...Object.keys(seeded), ...Object.keys(local)])) {
    for (const r of [...(local[slug] ?? []), ...(seeded[slug] ?? [])]) out.push({ ...r, slug })
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}
