import React from "react"
import { useMediaQuery } from 'react-responsive';


const PhoneContext = React.createContext()

let isMobile, isHighRes

function PhoneContextProvider(props) {
    isMobile = useMediaQuery({ query: `(max-width: 834px) and (orientation: portrait)` }); //760
    isHighRes = useMediaQuery({ query: `(min-width: 1920px) and (max-width: 2560px)`})


    return (
        <PhoneContext.Provider value={{isMobile, isHighRes}}>
            {props.children}
        </PhoneContext.Provider>
    )
}

export {PhoneContextProvider, PhoneContext}