import React, { createContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USER_BY_TOKEN = gql`
  query GetUserByToken {
    client {
      _id
      username
      profilePicture
      headline
      channels
    }
  }
`;

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  

  const [user, setUser] = React.useState({
    loggedIn: false,
    id: null,
    username: "",
    profilePicture: "",
    headline: ""
  })

  const { loading, error, data, refetch } = useQuery(GET_USER_BY_TOKEN);

  useEffect(() => {
    if (data && data.client) {
      setUser({
        loggedIn: true,
        id: data.client._id,
        username: data.client.username,
        profilePicture: data.client.profilePicture,
        headline: data.client.headline
      })
    }
  }, [data]);

  const updateUser = async () => {
    try {
      const { data } = await refetch();
      if (data && data.client) {
        setUser({
          loggedIn: true,
          id: data.client._id,
          username: data.client.username,
          profilePicture: data.client.profilePicture,
          headline: data.client.headline
        })
      }
    } catch (error) {
      console.error('Error while updating user:', error.message);
    }
  };

  return (
    <UserContext.Provider value={{user, updateUser, loading}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContextProvider, UserContext}