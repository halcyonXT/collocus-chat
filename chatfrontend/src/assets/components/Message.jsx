import React from 'react'
import { PhoneContext } from '../context/phoneContext'

export default function Message(props) {
    const {isMobile} = React.useContext(PhoneContext)

    return (
        <div className='w-full max-w-full h-max box-border mb-4 p-[3.5%] md:p-[2.5%] md:pb-0 lg:p-[1%] lg:pb-0 pb-0 bg-opacity-60 flex flex-col justify-start items-start rounded-2xl'>
            <div className='h-[5vh] flex w-full max-w-full items-end gap-4'>
                <img src={props.image} className='h-[4vh] rounded-full'></img>
                <div className='h-full flex flex-col justify-evenly'>
                    <div className='text-slate-200 max-w-[50vw] font-semibold ysab overflow-hidden whitespace-nowrap text-ellipsis' style={{fontSize: !isMobile ? 'calc(0.6vw + 0.6vh)' : '1.3rem'}}>
                        {props.name}
                    </div>
                    <div className='text-slate-500 leading-none quicksand' style={{fontSize: !isMobile ? 'calc(0.45vw + 0.45vh)' : '1rem'}}>
                        {props.timestamp}
                    </div>
                </div>
            </div>
            <span className='quicksand text-slate-300 ml-[2vh] pl-[calc(2vh+1rem)] whitespace-pre-wrap font-medium leading-8 md:leading-5 lg:leading-6 xl:leading-8 border-l border-slate-500' style={{fontSize: !isMobile ? 'calc(0.6vw + 0.6vh)' : '1.4rem'}}>{props.content}</span>
        </div>
    )
}