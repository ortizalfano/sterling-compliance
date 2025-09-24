import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Log para verificar que se está cargando la nueva versión
console.log('🚀 Sterling Web v2.3 - NEW EMAIL POPUP - Loading...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


