import React, { createContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { UserContext } from './userContext';

const GET_USER_BY_TOKEN = gql`
  query GetUserByToken {
    client {
      username
      profilePicture
      headline
    }
  }
`;

const ChannelContext = createContext();

const ChannelContextProvider = ({ children }) => {
    const { user } = React.useContext(UserContext)
    const [channels, setChannels] = React.useState([])

    return (
        <ChannelContext.Provider value={{}}>
            {children}
        </ChannelContext.Provider>
    );
};

export {ChannelContextProvider, ChannelContext}