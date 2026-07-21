import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Whiteboard from './pages/whiteboardPage/Whiteboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Whiteboard />
  </StrictMode>,
)
