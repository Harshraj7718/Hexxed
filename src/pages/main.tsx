import { StrictMode, Suspense, lazy, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'

// Each page loads only its own code (the FAQ no longer downloads GSAP or the legal tables).
const PAGES: Record<string, ComponentType> = {
  products: lazy(() => import('./CatalogPage').then(m => ({ default: m.CatalogPage }))),
  product: lazy(() => import('./ProductPage').then(m => ({ default: m.ProductPage }))),
  story: lazy(() => import('./Pages').then(m => ({ default: m.StoryPage }))),
  shipping: lazy(() => import('./Pages').then(m => ({ default: m.ShippingPage }))),
  contact: lazy(() => import('./Pages').then(m => ({ default: m.ContactPage }))),
  faq: lazy(() => import('./Pages').then(m => ({ default: m.FaqPage }))),
  privacy: lazy(() => import('./Privacy').then(m => ({ default: m.PrivacyPage }))),
  refund: lazy(() => import('./Privacy').then(m => ({ default: m.RefundPage }))),
  terms: lazy(() => import('./Privacy').then(m => ({ default: m.TermsPage }))),
}

const Page = PAGES[document.body.dataset.page ?? ''] ?? PAGES.products

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </StrictMode>,
)
