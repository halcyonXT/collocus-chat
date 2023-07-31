import React from 'react'
import { PhoneContext } from '../context/phoneContext'

export default function Message(props) {
    const {isMobile} = React.useContext(PhoneContext)

    return (
        <div className={`w-full animation-newmessage max-w-full h-max box-border ${["bottom", "none"].includes(props.chain) && 'mb-4'} p-[3.5%] ${["bottom", "middle"].includes(props.chain) && "pt-0 md:pt-0 lg:pt-0"} md:p-[2.5%] md:pb-0 lg:p-[1%] lg:pb-0 pb-0 bg-opacity-60 flex flex-col justify-start items-start rounded-2xl`}>
            {
                !["bottom", "middle"].includes(props.chain)
                &&
                <div className='h-max flex w-full max-w-full items-end gap-4'>
                    <img src={props.image} className='h-[40px] aspect-square rounded-full'></img>
                    <div className='h-full flex flex-col justify-evenly'>
                        <div className={`text-slate-200 ${!isMobile ? 'text-[1rem]' : 'text-[15px]'} max-w-[65vw] font-semibold ysab overflow-hidden whitespace-nowrap text-ellipsis`}>
                            {props.name}
                        </div>
                        <div className={`${!isMobile ? "text-[13px]" : "text-[12px]"} text-slate-500 leading-none quicksand`}>
                            {props.timestamp}
                        </div>
                    </div>
                </div>
            }
            <span className={`quicksand ${!isMobile ? "text-[1rem]" : 'text-[1rem]'} text-slate-300 ml-[20px] pl-[calc(20px+1rem)] whitespace-pre-wrap font-medium leading-8 border-l border-slate-500`}>
                {props.content}
            </span>
        </div>
    )
}