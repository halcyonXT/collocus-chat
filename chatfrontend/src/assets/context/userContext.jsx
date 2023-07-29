import React, { createContext, useEffect } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = React.useState({
    loggedIn: true
  })


  return (
    <UserContext.Provider value={{user}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContextProvider, UserContext}