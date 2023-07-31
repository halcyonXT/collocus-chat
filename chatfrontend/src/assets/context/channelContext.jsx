import React, { createContext, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
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
    const [getUserChannels] = useLazyQuery(GET_USER_CHANNELS);
    const [getChannel] = useLazyQuery(GET_CHANNEL);

    const fetchUserChannels = async (reqid) => {
        return await getUserChannels({ variables: { id: reqid } });
    };

    const fetchChannelData = async (reqid) => {
        return await getChannel({ variables: { id: reqid } });
    };

    React.useEffect(() => {
        if (!PASSED_INITIAL) {
            if (user.id) {
                (async () => {
                    PASSED_INITIAL = true
                    let raw = await fetchUserChannels(user.id)
                    setChannels(raw.data.getUserChannels)
                })();
            }
        }
    }, [user])

    React.useEffect(() => {
        if (focusedChannel) {
            (async () => {
                let raw = await fetchChannelData(focusedChannel)
                console.log(raw.data.getChannel)
                setExtensiveChannelInfo(raw.data.getChannel)
            })();
        }
    }, [focusedChannel])

    return (
        <ChannelContext.Provider value={{focusedChannel,setFocusedChannel,channels,extensiveChannelInfo}}>
            {children}
        </ChannelContext.Provider>
    );
};

export { ChannelContextProvider, ChannelContext }