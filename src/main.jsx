import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import './styles.css'
import { FxProvider } from './lib/fx.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {import.meta.env.VITE_MEMORY_ROUTER ? (
      <MemoryRouter>
        <FxProvider><App /></FxProvider>
      </MemoryRouter>
    ) : (
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <FxProvider><App /></FxProvider>
      </BrowserRouter>
    )}
  </StrictMode>
)
