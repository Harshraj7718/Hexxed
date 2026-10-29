import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        products: resolve(import.meta.dirname, 'products.html'),
        product: resolve(import.meta.dirname, 'product.html'),
        refund: resolve(import.meta.dirname, 'refund.html'),
        terms: resolve(import.meta.dirname, 'terms.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        story: resolve(import.meta.dirname, 'story.html'),
        shipping: resolve(import.meta.dirname, 'shipping.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        faq: resolve(import.meta.dirname, 'faq.html'),
      },
    },
  },
})
