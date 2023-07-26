import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PhoneContextProvider } from './assets/context/phoneContext'
import { UserContextProvider } from './assets/context/userContext.jsx'
import { SocketProvider } from './assets/context/socketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserContextProvider>
        <SocketProvider>
            <PhoneContextProvider>
                <App />
            </PhoneContextProvider>
        </SocketProvider>
    </UserContextProvider>
)
