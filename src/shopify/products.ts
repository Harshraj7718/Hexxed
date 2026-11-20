import { PRODUCTS } from '../home/data'
import { SHOPIFY_ENABLED, shopifyFetch } from './client'

const QUERY = `
  query Products {
    products(first: 50) {
      nodes {
        handle
        availableForSale
        variants(first: 5) {
          nodes { id availableForSale }
        }
      }
    }
  }
`

type Result = { products: { nodes: { handle: string; availableForSale: boolean; variants: { nodes: { id: string; availableForSale: boolean }[] } }[] } }

let loaded: Promise<boolean> | null = null

/**
 * Pulls live stock and the purchasable variant for every product from Shopify. A site product is matched
 * to a Shopify product by handle (the `slug`, e.g. "clay-pomade"). Returns true when anything was updated.
 */
export function syncShopifyProducts(): Promise<boolean> {
  if (!SHOPIFY_ENABLED) return Promise.resolve(false)
  loaded ??= shopifyFetch<Result>(QUERY)
    .then(({ products }) => {
      for (const node of products.nodes) {
        const p = PRODUCTS.find(x => x.slug === node.handle)
        if (!p) continue
        // Never guess: with more than one variant the right one has to be chosen explicitly.
        if (node.variants.nodes.length !== 1) {
          console.warn(`[shopify] "${node.handle}" has ${node.variants.nodes.length} variants; keep one variant or map its variant ID. Not buyable from the site until then.`)
          p.variantId = undefined
          p.stock = false
          continue
        }
        const variant = node.variants.nodes[0]
        p.variantId = variant.id
        p.stock = node.availableForSale && variant.availableForSale
      }
      return true
    })
    .catch(err => {
      console.warn('[shopify] product sync failed, keeping local data:', err)
      return false
    })
  return loaded
}
