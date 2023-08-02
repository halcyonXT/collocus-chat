import React, { createContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { UserContext } from './userContext';

const GET_CHANNEL = gql`
  query GetChannel($id: ID!) {
    getChannel(id: $id) {
      owner
      messages {
        sender {
          _id
          username
          profilePicture
        }
        timestamp
        content
      }
    }
  }
`;

const GET_USER_CHANNELS = gql`
  query GetUserChannels($id: ID!) {
    getUserChannels(id: $id) {
      _id
      name
      picture
    }
  }
`;


const ChannelContext = createContext();

let PASSED_INITIAL = false

const ChannelContextProvider = ({ children }) => {
    const { user } = React.useContext(UserContext)
    const [focusedChannel, setFocusedChannel] = React.useState(null)
    const [channels, setChannels] = React.useState([])
    const [extensiveChannelInfo, setExtensiveChannelInfo] = React.useState({
        name: "",
        picture: "",
        members: [],
        messages: [],
        owner: ""
    })
    const getUserChannels = useQuery(GET_USER_CHANNELS, {
      variables: { id: user.id }, 
      skip: true, 
    });

    const getChannel = useQuery(GET_CHANNEL, {
      variables: { id: focusedChannel }, 
      skip: true, 
    });

    React.useEffect(() => {
        if (!PASSED_INITIAL) {
            if (user.id) {
                (async () => {
                    PASSED_INITIAL = true
                    updateUserChannels()
                })();
            }
        }
    }, [user])

    React.useEffect(() => {
        if (focusedChannel) {
            (async () => {
                updateChannel()
            })();
        }
    }, [focusedChannel])

    const updateUserChannels = async () => {
      let raw = await getUserChannels.refetch()
      setChannels(raw.data.getUserChannels)
    }

    const updateChannel = async () => {
      let raw = await getChannel.refetch()
      setExtensiveChannelInfo(raw.data.getChannel)
    }

    return (
        <ChannelContext.Provider value={{
          focusedChannel,
          setFocusedChannel,
          channels,
          extensiveChannelInfo,
          update: {
            userChannels: updateUserChannels,
            channel: updateChannel 
          }}}>
            {children}
        </ChannelContext.Provider>
    );
};

export { ChannelContextProvider, ChannelContext }