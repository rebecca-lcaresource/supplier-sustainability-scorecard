import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SuppliersProvider } from './context/SuppliersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SuppliersProvider>
      <App />
    </SuppliersProvider>
  </StrictMode>,
)
