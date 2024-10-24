import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
// import { ToastContextProvider } from './contexts/ToastContext.tsx'
// import { AppContextProvider } from './contexts/AppContext.tsx'
// import { ApiContextProvider } from './contexts/ApiContext.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      {/* <ToastContextProvider>
      <AppContextProvider>
        <ApiContextProvider> */}
      {/* <RefreshAccessToken> */}
      {/* </RefreshAccessToken> */}
      {/* <NetworkErrorLogger> */}
      {/* </NetworkErrorLogger> */}
      <App />
      {/* </ApiContextProvider>
      </AppContextProvider>
    </ToastContextProvider> */}
    </Router>
  </React.StrictMode>
)
