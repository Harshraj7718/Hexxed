/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_DOMAIN?: string
  readonly VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string
  readonly VITE_SHOPIFY_API_VERSION?: string
  /** Optional discount code applied when the customer picks "Pay online (prepaid)". */
  readonly VITE_SHOPIFY_PREPAID_CODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
