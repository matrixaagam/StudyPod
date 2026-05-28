import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './TheStudyPod_fixed.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)