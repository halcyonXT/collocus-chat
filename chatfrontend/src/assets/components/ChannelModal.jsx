import React from 'react'
import { UserContext } from '../context/userContext';
import { ChannelContext } from '../context/channelContext';
import { useMutation, gql } from '@apollo/client';
import Input from './Input';

import { ADD_CHANNEL_MUTATION, ADD_USER_TO_CHANNEL_MUTATION } from '../api/api';
import { SocketContext } from '../context/socketContext';

export default function ChannelModal(props) {
    const [channelId, setChannelId] = React.useState("")
    const [channelName, setChannelName] = React.useState("")
    const [error, setError] = React.useState(false)
    const [addUserToChannel] = useMutation(ADD_USER_TO_CHANNEL_MUTATION);
    const [addChannel] = useMutation(ADD_CHANNEL_MUTATION);
    const {user} = React.useContext(UserContext)
    const {update} = React.useContext(ChannelContext)
    const {socket} = React.useContext(SocketContext)

    const handleAddUserToChannel = async () => {
        try {
            await addUserToChannel({
                variables: { id: user.id, channel: channelId },
            });
            return socket.emit("newMember", {channel: channelId, user: user.id})
        } catch (ex) {}
    }

    const handleAddChannel = async () => {
        return await addChannel({
            variables: { name: channelName, picture: "" },
        });
    }

    const joinChannel = async () => {
        let raw = await handleAddUserToChannel()
        if (raw.data?.addUserToChannel?.status == "error") {
            setError(true)
        } else {
            update.userChannels();
            cancel("", true);
        }
    }

    const createChannel = async () => {
        let raw = await handleAddChannel()
        if (raw.data?.addChannel?.status == "error") {
            setError(true)
        } else {
            update.userChannels();
            cancel("", true);
        }
    }

    return (
        <>
            {
                error
                &&
                <div className='w-full bg-red-500 text-red-100 ysab text-sm rounded-lg p-2 grid place-items-center'>
                    Something went wrong. Try checking if your information is correct.
                </div>
            }
            <div className='open-modal-content duration-100 w-full h-max'>
                <div className='ysab tracking-wide font-medium text-center gap-2 text-accent w-full mb-2'>
                    JOIN A CHANNEL
                </div>
                <Input
                    id="channel-id"
                    tether={channelId}
                    callback={(e) => setChannelId(e.target.value)}
                    name="Channel ID"
                />
            </div>
            <div className='flex w-full justify-between'>
                <div onClick={joinChannel} className={`py-1 mt-3 mb-1 mx-auto font-medium rounded-lg cursor-pointer text-center w-40 ysab tracking-widest text-sm ${(channelId) ? 'bg-accent text-900 hover:brightness-125' : 'pointer-events-none bg-700 text-900'} duration-150`}>
                    PROCEED
                </div>
            </div>
            <div className='relative w-full h-4 grid place-items-center my-4'>
                <div className='absolute h-[1px] w-full bg-600'></div>
                <div className='absolute text-sm ysab font-bold tracking-widest px-1 text-600 bg-950'>OR</div>
            </div>
            <div className='open-modal-content w-full h-max'>
                <div className='ysab tracking-wide font-medium text-center text-accent gap-2 w-full mb-2'>
                    CREATE A CHANNEL
                </div>
                <Input
                    id="channel-name"
                    tether={channelName}
                    callback={(e) => setChannelName(e.target.value)}
                    name="Channel Name"
                />
            </div>
            <div className='flex w-full justify-between'>
                <div onClick={createChannel} className={`py-1 mt-3 mb-1 mx-auto font-medium rounded-lg cursor-pointer text-center w-40 ysab tracking-widest text-sm ${(channelName) ? 'bg-accent text-900 hover:brightness-125' : 'pointer-events-none bg-700 text-900'} duration-150`}>
                    PROCEED
                </div>
            </div>
        </>
    )
}
