import React, { createContext, useEffect } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const user = React.useState({
    loggedIn: false
  })


  return (
    <UserContext.Provider value={{user}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContextProvider, UserContext}