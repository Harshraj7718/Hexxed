import { useCallback, useMemo, useRef, useState } from 'react'
import { PRICE, productById, type ProductId } from './data'

export type Cart = Partial<Record<ProductId, number>>

/** Cart lines, totals and the bundle discount: 2 jars save 10%, 3+ save 20%. */
export function bagTotals(cart: Cart) {
  const count = Object.values(cart).reduce((a, b) => a + (b ?? 0), 0)
  const rate = count >= 3 ? 0.2 : count === 2 ? 0.1 : 0
  const subtotal = count * PRICE
  const saving = Math.round(subtotal * rate)
  return { count, subtotal, saving, total: subtotal - saving }
}

export function bundleMessage(count: number) {
  if (count >= 3) return 'Max bundle unlocked — you’re saving 20%.'
  if (count === 2) return 'Add 1 more jar to save 20%.'
  if (count === 1) return 'Add 1 more jar to save 10%.'
  return 'Buy more, save up to 20%.'
}

export function useBag() {
  const [cart, setCart] = useState<Cart>({})
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
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
    const next = bagTotals(cartRef.current).count + 1
    setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
    flash(productById(id).name + ' added to your bag')
    return next
  }, [flash])

  const addMany = useCallback((ids: ProductId[]) => {
    setCart(c => {
      const n = { ...c }
      ids.forEach(id => { n[id] = (n[id] ?? 0) + 1 })
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

  const totals = useMemo(() => bagTotals(cart), [cart])
  return { cart, totals, open, setOpen, toast, flash, add, addMany, setQty }
}
