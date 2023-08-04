import React, { createContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { UserContext } from './userContext';
import { SocketContext } from './socketContext';

import { GET_CHANNEL, GET_USER_CHANNELS, GET_USERS_BY_IDS } from '../api/api'


const ChannelContext = createContext();

let PASSED_INITIAL = false

const ChannelContextProvider = ({ children }) => {
    const { user } = React.useContext(UserContext)
    const [focusedChannel, setFocusedChannel] = React.useState(null)
    const [channels, setChannels] = React.useState([])
    const {socket} = React.useContext(SocketContext)
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
    const membersQuery = useQuery(GET_USERS_BY_IDS, {
      variables: { ids: extensiveChannelInfo.members },
      skip: true
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
            socket.emit('joinChannel', focusedChannel);
            (async () => {
                updateChannel()
            })();
        }
    }, [focusedChannel])

    React.useEffect(() => {
      if (extensiveChannelInfo.members.length > 0 && typeof extensiveChannelInfo.members[0] !== 'object') {
        ;(async() => {
          updateMembers();
        })();
      }
    }, [extensiveChannelInfo])

    const updateUserChannels = async () => {
      let raw = await getUserChannels.refetch()
      setChannels(raw.data.getUserChannels)
    }

    const updateChannel = async () => {
      let raw = await getChannel.refetch()
      setExtensiveChannelInfo(raw.data.getChannel)
    }

    const updateMembers = async () => {
      let raw = await membersQuery.refetch()
      setExtensiveChannelInfo(prev => {
        let r = {...prev}
        r.members = raw.data.users
        return r
      })
    }

    return (
        <ChannelContext.Provider value={{
          focusedChannel,
          setFocusedChannel,
          channels,
          extensiveChannelInfo,
          update: {
            userChannels: updateUserChannels,
            channel: updateChannel,
            members: updateMembers,
          }}}>
            {children}
        </ChannelContext.Provider>
    );
};

export { ChannelContextProvider, ChannelContext }