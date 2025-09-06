import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Initierar tema (default: light)
(function () {
  const saved = localStorage.getItem('theme') // 'dark' | 'light' | null
  const root = document.documentElement
  if (saved === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
})()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
