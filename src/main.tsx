import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StackProvider, StackTheme } from '@stackframe/stack'
import { stackClientApp } from '../stack'

// Import tests for automatic execution
import './test-scrapers'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StackProvider app={stackClientApp}>
      <StackTheme>
        <App />
      </StackTheme>
    </StackProvider>
  </React.StrictMode>,
)