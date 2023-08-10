import React from 'react'
import collopng from '/collo.png';
import { PhoneContext } from '../context/phoneContext'
import SidebarGroup from './SidebarGroup';
import SidebarProfile from './SidebarProfile';
import samplePfp1 from '/sample1.webp'
import { UserContext } from '../context/userContext';
import { ChannelContext } from '../context/channelContext';
//s
export default function UpperPanel(props) {
    const {isMobile} = React.useContext(PhoneContext)
    const {channels} = React.useContext(ChannelContext)
    const [menuLaunched, setMenuLaunched] = React.useState(false)
    const [renderChannels, setRenderChannels] = React.useState([])
    let menuRef = React.useRef(null)
    const {user} = React.useContext(UserContext)

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

    React.useEffect(() => {
        if (channels.length > 0) {
            setRenderChannels(channels)
        }
    }, [channels])

    const changeChannels = (id) => {
        props.changeChannels(id)
    }

    if (isMobile) {
        return (
            <>
                <div className='min-h-[8%]'></div>
                <div className='w-full min-h-[8%] absolute top-0 h-[8%] bg-950 border-b box-border p-[2.5%] px-[3%] border-700 flex justify-between items-center'>
                    <div onClick={launchPhoneMenu} className='h-full aspect-square rounded-[20%] border border-500 grid place-items-center fill-400'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="85%" viewBox="0 -960 960 960"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/></svg>
                    </div>
                    <a href="/" className='h-full'>
                        <div className="max-w-full w-max h-full flex items-center justify-start gap-3 tracking-widest select-none box-content">
                            <img src={collopng} className="h-full" />
                            <div className="ysab leading-none flex flex-col">
                                <div className="clamp-title text-accent font-black lg:leading-none md:leading-none decoration-0 text-[0.8rem]">
                                    COLLOCUS
                                </div>
                                <div className="clamp-subtitle mt-1 text-600 block text-[6px]">
                                    CONNECTING PEOPLE, INSTANTLY
                                </div>
                            </div>
                        </div>
                    </a>
                    <div className='h-full aspect-square'>
                        <img 
                            src='https://i.ibb.co/1qqM328/IMG-0634.jpg'
                            className='h-full aspect-square rounded-[20%] border border-500'
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
            <div className={`w-full min-h-8 h-8 bg-950 border-b box-content overflow-y-visible p-3 flex border-700 ${props.disabled && "pointer-events-none"}`}>
                <div className='w-[17.5rem] flex h-full border-r border-700 box-content pr-2'>
                    <div className='h-full overflow-visible aspect-square relative'>
                        <img 
                            src={(props.disabled && samplePfp1) || (user.loggedIn && user.profilePicture)}
                            className='h-full aspect-square rounded-full'
                        />
                        <div 
                            className='h-[45%] aspect-square rounded-full absolute -right-[2px] -bottom-[2px] bg-green-500 border-2 box-border border-950'
                            id='user-status'></div>
                    </div>
                    <div className='w-[69%] h-full ml-[4%] flex flex-col justify-between'>
                        <div className='text-[14px] max-h-[50%] max-w-full ysab font-bold overflow-hidden leading-4 text-600 whitespace-nowrap text-ellipsis'>
                            {props.disabled && "Alexander"}
                            {user.loggedIn && user.username}
                        </div>
                        <div className='text-[10px] max-h-[50%] max-w-full quicksand font-medium overflow-hidden leading-2 text-600 whitespace-nowrap text-ellipsis'>
                            {props.disabled && "Jack of all trades"}
                            {user.loggedIn && user.headline}
                        </div>
                    </div>
                    <div className='h-full aspect-square ml-auto' onClick={() => props.setProfileModalOpen(true)}>
                        <div className='min-h-full aspect-square mr-2 cursor-pointer grid place-items-center fill-700 hover:fill-600 duration-150'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="75%" className='float-right grow' viewBox="0 -960 960 960"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/></svg>
                        </div>
                    </div>
                </div>
                <div className='box-border w-[calc(100%-20rem)] max-w-[calc(100%-20rem)] ml-[0.66rem] overflow-x-auto overflow-y-hidden flex gap-2 justify-start h-full pointer-events-auto'>
                    <Servers servers={renderChannels} changeChannels={changeChannels}/>
                    <div onClick={() => props.setChannelModalOpen(prev => !prev)} className='h-full aspect-square rounded-full box-border border duration-100 cursor-pointer border-700 hover:border-600 grid place-items-center fill-700 hover:fill-600 text-lg leading-none'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="80%" viewBox="0 -960 960 960"><path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z"/></svg>
                    </div>
                </div>
            </div>
        )
    }
}

const Servers = React.memo(({servers, changeChannels}) => {

    const hovered = (id, action) => {
        let newTarget = document.getElementById(id)
        if (action == "enter") {
            newTarget.style.opacity = "1"
            newTarget.style.transform = "scale(1) translateX(1rem)"
        } else {
            newTarget.style.opacity = "0"
            newTarget.style.transform = "scale(0.9) translateX(1rem)"
        }
    }

    if (!servers || servers.length == 0) {return}

    return (
        <>
            {
                servers.map(server => {
                    return <>
                        <div className='h-full aspect-square'>
                            <div id={server._id} className='opacity-0 scale-[0.9] rounded-tl-none duration-100 z-[999] absolute text-600 text-sm top-12 quicksand pointer-events-none font-medium py-1 px-2 rounded-lg bg-900 border border-700'>
                                {server.name}
                            </div>
                            <div key={server._id} onClick={() => changeChannels(server._id)} onMouseEnter={(e) => hovered(server._id, "enter")} onMouseLeave={(e) => hovered(server._id, "leave")} className='h-full aspect-square rounded-full box-border border duration-100 cursor-pointer border-700 hover:border-600 grid place-items-center fill-500 hover:fill-300 text-lg leading-none'>
                                <img 
                                    className='rounded-full aspect-square h-full'
                                    src={server.image ? server.image : "https://i.ibb.co/DDx3QSW/defaultserver.png"}
                                    onError={(e) => e.target.src = "https://i.ibb.co/DDx3QSW/defaultserver.png"}
                                />
                            </div>
                        </div>
                    </>
                })
            }
        </>
    )
})

const sideMenu = <>
<div className="absolute popout-animation top-[8%] p-[1%] h-[92%] w-full bg-950 flex flex-col">
</div></>