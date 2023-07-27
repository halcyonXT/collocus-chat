import React from 'react';
import io from 'socket.io-client';
import collopng from '/collo.png';
import SidebarGroup from './assets/components/SidebarGroup';
import SidebarProfile from './assets/components/SidebarProfile';
import MessagingPanel from './assets/components/MessagingPanel';
import RegistrationForm from './assets/components/RegistrationForm';

import { UserContext } from './assets/context/userContext';
import LoggedOutPage from './assets/components/LoggedOutPage';
import LoginForm from './assets/components/LoginForm';
import { Routes, Route, Link } from "react-router-dom";
//asdf

function App() {

    return (
        <>  
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
    return (
        <div className="w-screen h-[100dvh] bg-slate-900 flex">
                <div className="hidden p-3 h-full bg-slate-950 border-r border-slate-600 w-[18rem] md:flex md:flex-col">
                    <a href="/">
                        <div className="w-full pb-3 h-8 max-h-8 mb-[1%] flex items-center justify-start gap-3 tracking-widest select-none border-b border-slate-700 box-content">
                            <img src={collopng} className="h-full" />
                            <div className="ysab leading-none flex flex-col">
                                <div className="clamp-title text-slate-300 font-black lg:leading-none md:leading-none decoration-0 text-[0.85rem]">
                                    COLLOCUS
                                </div>
                                <div className="clamp-subtitle mt-1 text-slate-500 block text-[8px]">
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
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/k1z17CB/wp8452310-simple-dark-wallpapers.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/9bj02b8/ar3.png"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                            </SidebarGroup>
                            <SidebarGroup 
                                title="SETTINGS" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" height="100%" className='mr-2' viewBox="0 -960 960 960"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/></svg>}>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
                                    <SidebarProfile name="GrandCanyon" image="https://i.ibb.co/1qqM328/IMG-0634.jpg"/>
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

const loggedOutSidebar = 
    <>
        <div className='w-full text-lg text-slate-500 quicksand box-border px-3 mt-3 text-center font-semibold'>
            Join <span className='text-slate-200 ysab font-bold tracking-wide'>COLLOCUS</span> now! <br/>Chat in real-time and connect with people from all over the world, instantly.
        </div>
        <Link to="/login">
            <div className='mt-6 py-1 font-medium border border-slate-400 rounded-lg cursor-pointer text-center w-full text-slate-400 ysab tracking-widest text-base hover:text-slate-200 hover:border-slate-200 duration-150'>
                LOG IN
            </div>
        </Link>
        <Link to="/register">
            <div className='mt-4 py-1 font-medium border border-slate-400 rounded-lg cursor-pointer text-center w-full text-slate-400 ysab tracking-widest text-base hover:text-slate-200 hover:border-slate-200 duration-150'>
                SIGN UP
            </div>
        </Link>
    </>

export default App
