import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PhoneContextProvider } from './assets/context/phoneContext'
import { SocketProvider } from './assets/context/socketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <SocketProvider>
        <PhoneContextProvider>
            <App />
        </PhoneContextProvider>
    </SocketProvider>
)
