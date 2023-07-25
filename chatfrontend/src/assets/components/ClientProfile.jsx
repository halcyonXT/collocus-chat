import React from 'react'

export default function ClientProfile(props) {
    return (
        <div className='w-[15%] overflow-hidden flex h-full border-r border-slate-600'>
            <img 
                src='https://i.ibb.co/1qqM328/IMG-0634.jpg'
                className='h-full aspect-square rounded-[20%] border border-slate-500'
            />
            <div className='w-[77%] h-full border ml-[5%]'>
                <div className='text-[1.6vh] max-h-[60%] max-w-full h-[60%] border ysab font-bold text-slate-300 overflow-hidden whitespace-nowrap text-ellipsis'>
                    Hello dis my name aoisdjf
                </div>
            </div>
        </div>
    )
}