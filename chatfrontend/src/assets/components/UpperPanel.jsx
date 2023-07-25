import React from 'react'
import collopng from '/collo.png';
import { PhoneContext } from '../context/phoneContext'
import SidebarGroup from './SidebarGroup';
import SidebarProfile from './SidebarProfile';

export default function UpperPanel(props) {
    const {isMobile} = React.useContext(PhoneContext)
    const [menuLaunched, setMenuLaunched] = React.useState(false)
    let menuRef = React.useRef(null)

    const launchPhoneMenu = async () => {
        if (menuLaunched) {
            let anim = document.querySelector('.popout-animation').animate([
                {right: '0%'},
                {right: '100%'}
            ], {
                duration: 400,
                easing: 'ease-out',
                fill: 'forwards'
            })
            await anim.finished
            setMenuLaunched(false)
        } else {
            setMenuLaunched(true)
        }
    }

    if (isMobile) {
        return (
            <>
                <div className='min-h-[8%]'></div>
                <div className='w-full min-h-[8%] absolute top-0 h-[8%] bg-slate-950 border-b box-border p-[2%] px-[3%] border-slate-600 flex justify-between items-center'>
                    <div onClick={launchPhoneMenu} className='h-full aspect-square rounded-[20%] border border-slate-500 grid place-items-center fill-slate-400'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="85%" viewBox="0 -960 960 960"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/></svg>
                    </div>
                    <a href="/" className='h-full'>
                        <div className="max-w-full w-max h-full flex items-center justify-start gap-3 tracking-widest select-none box-content">
                            <img src={collopng} className="h-full" />
                            <div className="ysab leading-none flex flex-col">
                                <div className="clamp-title text-slate-300 font-black lg:leading-none md:leading-none decoration-0 text-[1.2rem]">
                                    COLLOCUS
                                </div>
                                <div className="clamp-subtitle mt-1 text-slate-500 block text-[8px]">
                                    CONNECTING PEOPLE, INSTANTLY
                                </div>
                            </div>
                        </div>
                    </a>
                    <div className='h-full aspect-square'>
                        <img 
                            src='https://i.ibb.co/1qqM328/IMG-0634.jpg'
                            className='h-full aspect-square rounded-[20%] border border-slate-500'
                        />
                    </div>
                </div>
                {
                    menuLaunched
                    &&
                    sideMenu
                }
            </>
        )
    } else {
        return (
            <div className='w-full h-[7.8%] min-h-[7.8%] max-h-[7.8%] bg-slate-950 border-b box-border p-[1%] border-slate-600'>
                <div className='w-[15%] overflow-hidden flex h-full border-r border-slate-600'>
                    <img 
                        src='https://i.ibb.co/1qqM328/IMG-0634.jpg'
                        className='h-full aspect-square rounded-[20%] border border-slate-500'
                    />
                    <div className='w-[77%] h-full ml-[5%]'>
                        <div className='text-[1.6vh] max-h-[60%] max-w-full h-[60%] ysab font-bold text-slate-300 overflow-hidden whitespace-nowrap text-ellipsis'>
                            Hello dis my name aoisdjf
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const sideMenu = <>
<div className="absolute popout-animation top-[8%] p-[1%] h-[92%] w-full bg-slate-950 flex flex-col">
</div></>