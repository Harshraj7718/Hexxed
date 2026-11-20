/**
 * Shopify Storefront API client. Only the PUBLIC storefront token belongs here (VITE_ variables are
 * shipped to the browser). Admin API keys and private tokens must never be added to this project.
 */
const domain = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined)?.trim()
const token = (import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string | undefined)?.trim()
const version = (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined)?.trim() || '2026-10'

/** False until both the store domain and the public token are set; the site then keeps its prototype behaviour. */
export const SHOPIFY_ENABLED = Boolean(domain && token)

// A full http(s) origin is accepted too, which makes it possible to point at a local mock while testing.
const origin = domain ? (/^https?:\/\//.test(domain) ? domain.replace(/\/$/, '') : `https://${domain}`) : ''
const endpoint = `${origin}/api/${version}/graphql.json`

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] }

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!SHOPIFY_ENABLED) throw new Error('Shopify is not configured')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token! },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Shopify request failed (${res.status})`)
  const json = (await res.json()) as GraphQLResponse<T>
  if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '))
  if (!json.data) throw new Error('Shopify returned no data')
  return json.data
}
