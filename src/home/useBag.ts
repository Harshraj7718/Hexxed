import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PRICE, productById, type ProductId } from './data'
import { SHOPIFY_ENABLED } from '../shopify/client'
import { syncShopifyProducts } from '../shopify/products'
import { createCheckout, type CheckoutLine } from '../shopify/checkout'

export type Cart = Partial<Record<ProductId, number>>

/** Bundle tiers: buy 2 get 10% off, 3 get 15% off, 4+ get 20% off. Prepaid orders get 5% more off. */
export const PREPAID_RATE = 0.05
export function bundleRate(count: number) {
  return count >= 4 ? 0.2 : count === 3 ? 0.15 : count === 2 ? 0.1 : 0
}

export function bagTotals(cart: Cart, prepaid = false) {
  const count = Object.values(cart).reduce((a, b) => a + (b ?? 0), 0)
  const subtotal = count * PRICE
  const saving = Math.round(subtotal * bundleRate(count))
  const prepaidSaving = prepaid ? Math.round((subtotal - saving) * PREPAID_RATE) : 0
  return { count, subtotal, saving, prepaidSaving, total: subtotal - saving - prepaidSaving }
}

export function bundleMessage(count: number) {
  if (count >= 4) return 'Max bundle unlocked — you’re saving 20%.'
  if (count === 3) return 'Add 1 more jar to get 20% off.'
  if (count === 2) return 'Add 1 more jar to get 15% off.'
  if (count === 1) return 'Add 1 more jar to get 10% off.'
  return 'Buy 2 get 10% off · Buy 3 get 15% off · Buy 4 get 20% off.'
}

/** The prepaid tick box is only honest when checkout can apply it: always in the prototype, or when a Shopify discount code is configured. */
export const PREPAID_AVAILABLE = !SHOPIFY_ENABLED || Boolean(import.meta.env.VITE_SHOPIFY_PREPAID_CODE?.trim())

export function useBag() {
  const [cart, setCart] = useState<Cart>({})
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [prepaid, setPrepaid] = useState(false)
  const [, setSynced] = useState(0)
  const checkingOut = useRef(false)
  const toastTimer = useRef(0)
  const cartRef = useRef(cart)
  cartRef.current = cart

  const flash = useCallback((msg: string) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  /** Adds one jar; returns the new jar count. */
  const add = useCallback((id: ProductId) => {
    if (!productById(id).stock) {
      flash(productById(id).name + ' is sold out')
      return bagTotals(cartRef.current).count
    }
    const next = bagTotals(cartRef.current).count + 1
    setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
    flash(productById(id).name + ' added to your bag')
    return next
  }, [flash])

  const addMany = useCallback((ids: ProductId[]) => {
    const inStock = ids.filter(id => productById(id).stock)
    setCart(c => {
      const n = { ...c }
      inStock.forEach(id => { n[id] = (n[id] ?? 0) + 1 })
      return n
    })
  }, [])

  const setQty = useCallback((id: ProductId, delta: number) => {
    setCart(c => {
      const q = Math.max(0, (c[id] ?? 0) + delta)
      const n = { ...c }
      if (q) n[id] = q
      else delete n[id]
      return n
    })
  }, [])

  // When Shopify is connected, live stock replaces the local flags and everything re-renders once.
  useEffect(() => { void syncShopifyProducts().then(ok => { if (ok) setSynced(n => n + 1) }) }, [])

  /** Prototype message without Shopify; otherwise builds a Shopify cart and sends the customer to its checkout. */
  const checkout = useCallback(async () => {
    const entries = Object.entries(cartRef.current) as [ProductId, number][]
    if (!entries.length) { flash('Your bag is empty'); return }
    if (!SHOPIFY_ENABLED) { flash('Prototype only — no payment processed'); return }
    if (checkingOut.current) return
    const lines: CheckoutLine[] = []
    for (const [id, quantity] of entries) {
      const p = productById(id)
      if (!p.variantId) { flash(p.name + ' is not available to buy yet'); return }
      lines.push({ variantId: p.variantId, quantity })
    }
    const code = import.meta.env.VITE_SHOPIFY_PREPAID_CODE?.trim()
    checkingOut.current = true
    flash('Taking you to checkout…')
    try {
      window.location.assign(await createCheckout(lines, prepaid && code ? [code] : []))
    } catch (err) {
      console.error('[shopify] checkout failed:', err)
      checkingOut.current = false
      flash('Checkout is unavailable right now. Please try again.')
    }
  }, [flash, prepaid])

  const totals = useMemo(() => bagTotals(cart, prepaid), [cart, prepaid])
  return { cart, totals, prepaid, setPrepaid, open, setOpen, toast, flash, add, addMany, setQty, checkout }
}
