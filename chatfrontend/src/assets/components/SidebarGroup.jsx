import React from 'react'
import { gsap } from 'gsap'

const generateRandomHex = () => `#${Math.random().toString(16).substr(2, 6)}`;

export default function SidebarGroup(props) {
    const [activeAnimation, setActiveAnimation] = React.useState('ddcontract')
    const [clickAvailable, setClickAvailable] = React.useState(true)
    const childrenRef = React.useRef(null)

    const handleClick = (e) => {
        if (!clickAvailable) {return}
        setClickAvailable(false)
        const element = childrenRef.current;
        const targetHeight = activeAnimation === "ddexpand" ? '0px' : '2000px';

        setActiveAnimation(prev => prev === "ddexpand" ? "ddcontract" : "ddexpand")

        const reEnable = () => setClickAvailable(true)

        if (activeAnimation !== "ddexpand") {
            gsap.to(element, { maxHeight: targetHeight, duration: 0.5, onComplete: reEnable });
            setTimeout(() => {
                e.target.nextSibling.style.overflowY = 'auto'
            }, 500)
        } else {
            e.target.nextSibling.style.maxHeight = `${e.target.nextSibling.style.clientHeight}px`
            e.target.nextSibling.style.overflowY = 'hidden'
            gsap.to(element, { maxHeight: targetHeight, duration: 0, onComplete: reEnable });
        }
    }

    return (
        <>
            <div onClick={handleClick} className={`flex xl:my-1 pt-2 md:my-2 duration-100 select-none justify-start items-center box-content xl:h-6 lg:h-5 md:h-4 xl:text-base xl:leading-none lg:text-[12px] lg:leading-none md:text-[8px] md:leading-none xl:pb-3 lg:pb-2 fill-slate-300 text-slate-300 hover:fill-slate-100 hover:text-slate-100 ysab font-semibold cursor-pointer`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`duration-100 xl:mr-3 lg:mr-2 md:mr-2 ${activeAnimation !== "ddexpand" && '-rotate-90'}`} height="100%" viewBox="0 -960 960 960"><path d="M480-360 280-559h400L480-360Z"/></svg>
                {props.icon}
                {props.title}
            </div>
                {/*<div className={`${activeAnimation} overflow-hidden`}></div>*/}
                <div ref={childrenRef} className={`box-border collapsible min-h-max ${activeAnimation}`}>
                    {
                        props.children
                    }
                </div>
        </>
    )
}