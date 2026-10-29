import { useCallback, useMemo, useRef, useState } from 'react'
import { PRICE, productById, type ProductId } from './data'

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

export function useBag() {
  const [cart, setCart] = useState<Cart>({})
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [prepaid, setPrepaid] = useState(false)
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

  const totals = useMemo(() => bagTotals(cart, prepaid), [cart, prepaid])
  return { cart, totals, prepaid, setPrepaid, open, setOpen, toast, flash, add, addMany, setQty }
}
