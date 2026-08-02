import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/typography.css";
import "./styles/animations.css";
import "./styles/utilities.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
