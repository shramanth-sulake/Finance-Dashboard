import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// importing css styles
import './index.css'
import App from './App.tsx'

console.log("React is starting up...");

// render the root element!
createRoot(document.getElementById('root')!).render(
  // strict mode is good for finding bugs
  <StrictMode>
    {/* routing wrapper */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
