import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PhoneContextProvider } from './assets/context/phoneContext'
import { UserContextProvider } from './assets/context/userContext.jsx'
import { SocketProvider } from './assets/context/socketContext.jsx'
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { ChannelContextProvider } from './assets/context/channelContext.jsx'
//asdf
const client = new ApolloClient({
    uri: 'http://localhost:8080/graphql',
    cache: new InMemoryCache(),
    credentials: 'include'
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <UserContextProvider>
                <ChannelContextProvider>
                    <SocketProvider>
                        <PhoneContextProvider>
                            <App />
                        </PhoneContextProvider>
                    </SocketProvider>
                </ChannelContextProvider>
            </UserContextProvider>
        </BrowserRouter>
    </ApolloProvider>
)
