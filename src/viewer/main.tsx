import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ViewerPage } from './ViewerPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ViewerPage />
  </StrictMode>,
)
