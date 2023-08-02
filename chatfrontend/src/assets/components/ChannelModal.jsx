import React from 'react'
import { UserContext } from '../context/userContext';
import { ChannelContext } from '../context/channelContext';
import { useMutation, gql } from '@apollo/client';

import { ADD_CHANNEL_MUTATION, ADD_USER_TO_CHANNEL_MUTATION } from '../api/api';

export default function ChannelModal(props) {
    const [channelId, setChannelId] = React.useState("")
    const [channelName, setChannelName] = React.useState("")
    const [error, setError] = React.useState(false)
    const [addUserToChannel] = useMutation(ADD_USER_TO_CHANNEL_MUTATION);
    const [addChannel] = useMutation(ADD_CHANNEL_MUTATION);
    const {user} = React.useContext(UserContext)
    const {update} = React.useContext(ChannelContext)

    const handleAddUserToChannel = async () => {
        return await addUserToChannel({
            variables: { id: user.id, channel: channelId },
          });
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
            cancel("", true);
            update.userChannels();
        }
    }

    const createChannel = async () => {
        let raw = await handleAddChannel()
        if (raw.data?.addChannel?.status == "error") {
            setError(true)
        } else {
            cancel("", true);
            update.userChannels();
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
                <div className='ysab tracking-wide font-medium text-center gap-2 w-full mb-2'>
                    JOIN A CHANNEL
                </div>
                <input
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    placeholder='Channel ID'
                    className='w-full change-autofill rounded-lg quicksand overflow-hidden bg-950 outline-none border border-500 box-border p-2 py-1 placeholder:text-500 text-300 duration-150 focus:border-300'
                />
            </div>
            <div className='flex w-full justify-between'>
                <div onClick={joinChannel} className={`py-1 mt-3 mb-1 mx-auto font-medium border rounded-lg cursor-pointer text-center w-40 ysab tracking-widest text-sm ${(channelId) ? 'border-400 text-400 hover:text-200 hover:border-200' : 'pointer-events-none border-600 text-600'} duration-150`}>
                    PROCEED
                </div>
            </div>
            <div className='relative w-full h-4 grid place-items-center my-4'>
                <div className='absolute h-[1px] w-full bg-300'></div>
                <div className='absolute text-sm ysab font-bold tracking-widest px-1 text-300 bg-950'>OR</div>
            </div>
            <div className='open-modal-content w-full h-max'>
                <div className='ysab tracking-wide font-medium text-center gap-2 w-full mb-2'>
                    CREATE A CHANNEL
                </div>
                <input
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder='Channel name'
                    className='w-full change-autofill rounded-lg quicksand overflow-hidden bg-950 outline-none border border-500 box-border p-2 py-1 placeholder:text-500 text-300 duration-150 focus:border-300'
                />
            </div>
            <div className='flex w-full justify-between'>
                <div onClick={createChannel} className={`py-1 mt-3 mb-1 mx-auto font-medium border rounded-lg cursor-pointer text-center w-40 ysab tracking-widest text-sm ${(channelName) ? 'border-400 text-400 hover:text-200 hover:border-200' : 'pointer-events-none border-600 text-600'} duration-150`}>
                    PROCEED
                </div>
            </div>
        </>
    )
}
