import { StrictMode, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ContactPage, FaqPage, ShippingPage, StoryPage } from './Pages'
import { ProductPage } from './ProductPage'
import { CatalogPage } from './CatalogPage'
import { PrivacyPage, RefundPage, TermsPage } from './Privacy'

const PAGES: Record<string, () => ReactElement> = {
  products: CatalogPage,
  product: ProductPage,
  story: StoryPage,
  shipping: ShippingPage,
  contact: ContactPage,
  faq: FaqPage,
  privacy: PrivacyPage,
  refund: RefundPage,
  terms: TermsPage,
}

const Page = PAGES[document.body.dataset.page ?? ''] ?? CatalogPage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
