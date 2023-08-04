import React from 'react'
import { PhoneContext } from '../context/phoneContext'

export default function Message(props) {
    const {isMobile} = React.useContext(PhoneContext)
    const [hovered, setHovered] = React.useState(false)

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={`w-full ${hovered && 'color-mix'} duration-100 rounded-md animation-newmessage max-w-full h-max box-border 
        ${["bottom", "none"].includes(props.chain) && 'mb-4'} p-[3.5%] ${["bottom", "middle"].includes(props.chain) && "pt-0 md:pt-0 lg:pt-0"} md:p-[2.5%] md:pb-0 lg:p-[1%] lg:pb-0 pb-0 bg-opacity-60 flex flex-col justify-start items-start rounded-2xl`}>
            {
                !["bottom", "middle"].includes(props.chain)
                &&
                <div className='h-max flex w-full max-w-full items-end gap-4'>
                    <img src={props.image} className='h-[40px] aspect-square rounded-full'></img>
                    <div className='h-full flex flex-col justify-evenly'>
                        <div className={`text-200 ${!isMobile ? 'text-[1rem]' : 'text-[15px]'} max-w-[65vw] font-semibold ysab overflow-hidden whitespace-nowrap text-ellipsis`}>
                            {props.name}
                        </div>
                        <div className={`${!isMobile ? "text-[13px]" : "text-[12px]"} text-500 leading-none quicksand`}>
                            {props.timestamp}
                        </div>
                    </div>
                </div>
            }
            <div className={`quicksand ${!isMobile ? "text-[1rem]" : 'text-[1rem]'} text-300 ml-[20px] break-words h-max max-w-[95%] pl-[calc(20px+1rem)] font-medium leading-8 border-l border-500`}>
                {props.content}{props.chain !== "top" && hovered && <span className='text-xs ml-2 text-600 pointer-events-none'>{props.timestamp.slice(-8)}</span>}
            </div>
        </div>
    )
}