import React from 'react';
import io from 'socket.io-client';
import collopng from '/collo.svg';
import SidebarGroup from './assets/components/SidebarGroup';
import SidebarProfile from './assets/components/SidebarProfile';
import MessagingPanel from './assets/components/MessagingPanel';
import RegistrationForm from './assets/components/RegistrationForm';

import { UserContext } from './assets/context/userContext';
import LoggedOutPage from './assets/components/LoggedOutPage';
import LoginForm from './assets/components/LoginForm';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ChannelContext } from './assets/context/channelContext';

const useLoadingSequence = async (array) => {
    return new Promise(async (resolve, reject) => {
        for (let promise of array) {
            await promise
        }
        resolve(true)
    })
}

function App() {
    const [isLoading, setIsLoading] = React.useState(true)
    const {loading} = React.useContext(UserContext)

    React.useEffect(() => {
        if (isLoading) {
            if (!loading) {
                setTimeout(() => {
                    document.querySelector('.loading-screen').style.opacity = '0'
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 200)
                }, 275)
            }
        }
    }, [loading])

    return (
        <>  
            {
                isLoading
                &&
                <div className='loading-screen absolute top-0 left-0 w-screen h-[100dvh] grid place-items-center bg-950 duration-200 z-[100]'>
                    <div className='h-20'>
                        <img
                            src={collopng}
                            className='h-full animate-pulse'/>
                    </div>
                </div>
            }
            <Routes>
                <Route exact path='/' element={
                    <Home/>
                }/>
                <Route path='/register' element={
                    <RegistrationForm/>
                }/>
                <Route path='/login' element={
                    <LoginForm/>
                }/>
            </Routes>
        </>
    );
}

const Home = () => {
    const {user} = React.useContext(UserContext)
    const {extensiveChannelInfo, focusedChannel} = React.useContext(ChannelContext)

    return (
        <div className="w-screen h-[100dvh] bg-900 flex">
                <div className="hidden p-3 h-full bg-950 border-r border-700 w-[18rem] md:flex md:flex-col">
                    <a href="/">
                        <div className="w-full pb-3 h-8 max-h-8 mb-[1%] flex items-center justify-start gap-3 tracking-widest select-none border-b border-700 box-content">
                            <img src={collopng} className="h-full" />
                            <div className="ysab leading-none flex flex-col">
                                <div className="clamp-title text-accent font-black lg:leading-none md:leading-none decoration-0 text-[0.85rem]">
                                    COLLOCUS
                                </div>
                                <div className="clamp-subtitle mt-1 text-600 block text-[8px]">
                                    CONNECTING PEOPLE, INSTANTLY
                                </div>
                            </div>
                        </div>
                    </a>
                    {
                        !user.loggedIn
                        ?
                        loggedOutSidebar
                        :
                        <>
                            <SidebarGroup 
                                title="USERS" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="mr-2" height="100%" viewBox="0 -960 960 960"><path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z"/></svg>}>
                            </SidebarGroup>
                            <SidebarGroup 
                                title="MEMBERS" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" height="100%" className='mr-2' viewBox="0 -960 960 960"><path d="M38-160v-94q0-35 18-63.5t50-42.5q73-32 131.5-46T358-420q62 0 120 14t131 46q32 14 50.5 42.5T678-254v94H38Zm700 0v-94q0-63-32-103.5T622-423q69 8 130 23.5t99 35.5q33 19 52 47t19 63v94H738ZM358-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42Zm360-150q0 66-42 108t-108 42q-11 0-24.5-1.5T519-488q24-25 36.5-61.5T568-631q0-45-12.5-79.5T519-774q11-3 24.5-5t24.5-2q66 0 108 42t42 108ZM98-220h520v-34q0-16-9.5-31T585-306q-72-32-121-43t-106-11q-57 0-106.5 11T130-306q-14 6-23 21t-9 31v34Zm260-321q39 0 64.5-25.5T448-631q0-39-25.5-64.5T358-721q-39 0-64.5 25.5T268-631q0 39 25.5 64.5T358-541Zm0 321Zm0-411Z"/></svg>}>
                                    {
                                        extensiveChannelInfo.members.length > 0 && typeof extensiveChannelInfo.members[0] == 'object'
                                        &&
                                        <>
                                            <SidebarProfile id={focusedChannel} name={"Invite other users"} svg={<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960"><path d="M730-400v-130H600v-60h130v-130h60v130h130v60H790v130h-60Zm-370-81q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM40-160v-94q0-35 17.5-63.5T108-360q75-33 133.338-46.5 58.339-13.5 118.5-13.5Q420-420 478-406.5 536-393 611-360q33 15 51 43t18 63v94H40Zm60-60h520v-34q0-16-9-30.5T587-306q-71-33-120-43.5T360-360q-58 0-107.5 10.5T132-306q-15 7-23.5 21.5T100-254v34Zm260-321q39 0 64.5-25.5T450-631q0-39-25.5-64.5T360-721q-39 0-64.5 25.5T270-631q0 39 25.5 64.5T360-541Zm0-90Zm0 411Z"/></svg>}/>
                                            {extensiveChannelInfo.members.map(member => <SidebarProfile name={member.username} image={member.profilePicture}/>)}
                                        </>
                                    }
                            </SidebarGroup>
                            <SidebarGroup 
                                title="SETTINGS"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" height="100%" className='mr-2' viewBox="0 -960 960 960"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/></svg>}>
                                    <Setting 
                                        name="PRIVACY"
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" height="70%" viewBox="0 -960 960 960"><path d="M220-80q-24.75 0-42.375-17.625T160-140v-434q0-24.75 17.625-42.375T220-634h70v-96q0-78.85 55.606-134.425Q401.212-920 480.106-920T614.5-864.425Q670-808.85 670-730v96h70q24.75 0 42.375 17.625T800-574v434q0 24.75-17.625 42.375T740-80H220Zm0-60h520v-434H220v434Zm260.168-140Q512-280 534.5-302.031T557-355q0-30-22.668-54.5t-54.5-24.5Q448-434 425.5-409.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350-634h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426-860 388-822.083 350-784.167 350-730v96ZM220-140v-434 434Z"/></svg>}
                                    />
                                    <Setting 
                                        name="APPEARANCE"
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" height="70%" viewBox="0 -960 960 960"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-85 32-158t87.5-127q55.5-54 130-84.5T489-880q79 0 150 26.5T763.5-780q53.5 47 85 111.5T880-527q0 108-63 170.5T650-294h-75q-18 0-31 14t-13 31q0 27 14.5 46t14.5 44q0 38-21 58.5T480-80Zm0-400Zm-233 26q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm126-170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm214 0q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm131 170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15ZM480-140q11 0 15.5-4.5T500-159q0-14-14.5-26T471-238q0-46 30-81t76-35h73q76 0 123-44.5T820-527q0-132-100-212.5T489-820q-146 0-247.5 98.5T140-480q0 141 99.5 240.5T480-140Z"/></svg>}
                                    />
                            </SidebarGroup>
                            <SidebarGroup 
                                title="ABOUT" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="mr-2" height="100%" viewBox="0 -960 960 960"><path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z"/></svg>}>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                            </SidebarGroup>
                        </>
                    }
                </div>
                {
                    user.loggedIn
                    ?
                    <MessagingPanel/>
                    :
                    <LoggedOutPage/>
                }
        </div>
    )
}

const Setting = (props) => {
    return (
        <div className='h-8 py-2 w-[calc(100%-1.5rem)] ml-3 pl-6 box-content border-l border-500 duration-150 cursor-pointer flex items-center p-1 fill-600 hover:brightness-125 text-600 hover:border-300 hover:border-l-8 justify-start gap-2' onClick={props.callback && props.callback}>
            {props.icon}
            <div className='ysab font-normal text-base'>
                {props.name}
            </div>
        </div>
    )
}

const loggedOutSidebar = 
    <>
        <div className='w-full text-lg quicksand box-border px-3 mt-3 text-center font-semibold text-700'>
            Join <span className='text-200 text-accent ysab font-bold tracking-wide'>COLLOCUS</span> now! <br/>Chat in real-time and connect with people from all over the world, instantly.
        </div>
        <Link to="/login">
            <div className='mt-6 py-1 bg-accent hover:brightness-125 font-medium rounded-lg cursor-pointer text-center w-full text-950 ysab tracking-widest text-base hover:text-200 hover:border-200 duration-150'>
                LOG IN
            </div>
        </Link>
        <Link to="/register">
            <div className='mt-4 py-1 bg-600 hover:brightness-125 font-medium rounded-lg cursor-pointer text-center w-full text-950 ysab tracking-widest text-base hover:text-200 hover:border-200 duration-150'>
                SIGN UP
            </div>
        </Link>
    </>

export default App
