import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './custom.css'
// import { ApiContextProvider } from './contexts/ApiContext.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ApiContextProvider> */}
    {/* <RefreshAccessToken> */}
    {/* </RefreshAccessToken> */}
    {/* <NetworkErrorLogger> */}
    {/* </NetworkErrorLogger> */}
    <App />
    {/* </ApiContextProvider> */}

  </React.StrictMode>
)
