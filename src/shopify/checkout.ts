import { shopifyFetch } from './client'

const MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`

type Result = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null
    userErrors: { field: string[]; message: string }[]
  }
}

export type CheckoutLine = { variantId: string; quantity: number }

/**
 * Creates a Shopify cart from the bag and returns its checkout URL. Shopify applies automatic discounts
 * (bundle tiers) and the optional discount code, so the final price comes from Shopify, not from this page.
 */
export async function createCheckout(lines: CheckoutLine[], discountCodes: string[] = []): Promise<string> {
  const { cartCreate } = await shopifyFetch<Result>(MUTATION, {
    input: {
      lines: lines.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity })),
      ...(discountCodes.length ? { discountCodes } : {}),
    },
  })
  if (cartCreate.userErrors.length) throw new Error(cartCreate.userErrors.map(e => e.message).join('; '))
  if (!cartCreate.cart) throw new Error('Shopify did not return a cart')
  return cartCreate.cart.checkoutUrl
}
