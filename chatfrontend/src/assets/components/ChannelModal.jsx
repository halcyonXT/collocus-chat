import React from 'react'

export default function ChannelModal(props) {
    const [channelId, setChannelId] = React.useState("")
    const [channelName, setChannelName] = React.useState("")
    return (
        <div className='absolute top-0 left-0 z-[1] bg-neutral-950 bg-opacity-25 w-full h-full grid place-items-center'>
            <div className='open-modal w-96 border border-slate-500 bg-slate-950 font-medium ysab text-base text-slate-300 rounded-lg shadow-sm p-4 box-content h-max'>
                <div className='open-modal-content w-full h-max'>
                    <div className='ysab tracking-wide font-medium text-center gap-2 w-full mb-2'>
                        JOIN A CHANNEL
                    </div>
                    <input
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder='Channel ID'
                        className='w-full change-autofill rounded-lg quicksand overflow-hidden bg-slate-950 outline-none border border-slate-500 box-border p-2 py-1 placeholder:text-slate-500 text-slate-300 duration-150 focus:border-slate-300'
                    />
                </div>
                <div className='relative w-full h-4 grid place-items-center my-4'>
                    <div className='absolute h-[1px] w-full bg-slate-500'></div>
                    <div className='absolute text-sm ysab font-bold tracking-widest px-1 text-slate-500 bg-slate-950'>OR</div>
                </div>
                <div className='open-modal-content w-full h-max'>
                    <div className='ysab tracking-wide font-medium text-center gap-2 w-full mb-2'>
                        CREATE A CHANNEL
                    </div>
                    <input
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder='Channel name'
                        className='w-full change-autofill rounded-lg quicksand overflow-hidden bg-slate-950 outline-none border border-slate-500 box-border p-2 py-1 placeholder:text-slate-500 text-slate-300 duration-150 focus:border-slate-300'
                    />
                </div>
            </div>
        </div>
    )
}
