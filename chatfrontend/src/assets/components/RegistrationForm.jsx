import React from 'react';
import collopng from '/collo.png';
import { Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

import {REGISTER_USER} from '../api/api'

export default function RegistrationForm() {
    const [info, setInfo] = React.useState({
        username: "",
        email: "",
        password: "",
        termsAccepted: false
        
    })

    const [status, setStatus] = React.useState({
        active: false,
        status: "success",
        message: ""
    })
    const [passwordVisible, setPasswordVisible] = React.useState(false)
    const [termsActivated, setTermsActivated] = React.useState(false)

    const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!info.termsAccepted) {
            return setStatus({active: true, status: "error", message: "Terms and Conditions are required"})
        }
        try {
            const { data } = await registerUser({
              variables: { username: info.username, email: info.email, password: info.password },
            });
            setStatus({active: true, status: data?.register.status, message: data?.register.message})
          } catch (error) {
            setStatus({active: true, status: "error", message: "Server error"});
          }
    };

    const usernameRef = React.useRef(null)
    usernameRef.current = info.username
    const emailRef = React.useRef(null)
    emailRef.current = info.email
    const passwordRef = React.useRef(null)
    passwordRef.current = info.password

    React.useEffect(() => {
        const movePlaceholder = () => {
            let target = document.querySelector(".escaping-placeholder-username")
            target.style.transform = 'translateY(-1.15rem) translateX(0.2rem)'
            target.style.fontSize = '10px'
            target.style.color = 'white'
        }

        const normalPlaceholder = () => {
            let target = document.querySelector(".escaping-placeholder-username")
            if (!usernameRef.current) {
                target.style.transform = 'translateY(0rem) translateX(0rem)'
                target.style.fontSize = '16px'
            }
            target.style.color = '#64748b'
        }

        const moveEmail = () => {
            let target = document.querySelector(".escaping-placeholder-email")
            target.style.transform = 'translateY(-1.15rem) translateX(0.2rem)'
            target.style.fontSize = '10px'
            target.style.color = 'white'
        }

        const normalEmail = () => {
            let target = document.querySelector(".escaping-placeholder-email")
            if (!emailRef.current) {
                target.style.transform = 'translateY(0rem) translateX(0rem)'
                target.style.fontSize = '16px'
            }
            target.style.color = '#64748b'
        }

        const movePassword = () => {
            let target = document.querySelector(".escaping-placeholder-password")
            target.style.transform = 'translateY(-1.15rem) translateX(0.2rem)'
            target.style.fontSize = '10px'
            target.style.color = 'white'
        }

        const normalPassword = () => {
            let target = document.querySelector(".escaping-placeholder-password")
            if (!passwordRef.current) {
                target.style.transform = 'translateY(0rem) translateX(0rem)'
                target.style.fontSize = '16px'
            }
            target.style.color = '#64748b'
        }
        
        document.querySelector("#username-input").addEventListener("focus", movePlaceholder)
        document.querySelector("#username-input").addEventListener("blur", normalPlaceholder)
        document.querySelector("#email-input").addEventListener("focus", moveEmail)
        document.querySelector("#email-input").addEventListener("blur", normalEmail)
        document.querySelector("#password-input").addEventListener("focus", movePassword)
        document.querySelector("#password-input").addEventListener("blur", normalPassword)

    }, [])

    return (
        <>
            <div className='w-screen h-[100dvh] grid place-items-center bg-900'>
                <div className='w-96 relative scale-110 rounded-lg h-max p-4 max-w-[calc(100vw-3rem)] max-h-[calc(100dvh-2rem)] bg-950 flex flex-col border border-600 shadow-sm shadow-black'>
                    <div className='flex pb-4 border-b border-600 mb-1 justify-between'>
                        <a href="/" className='h-max w-[80%] max-w-[80%]'>
                            <div className="w-[80%] max-w-[80%] h-8 flex items-center justify-start gap-3 tracking-widest select-none box-content">
                                <img src={collopng} className="h-full" />
                                <div className="ysab leading-none flex flex-col">
                                    <div className="text-300 font-black lg:leading-none md:leading-none decoration-0 text-[0.8rem]">
                                        COLLOCUS
                                    </div>
                                    <div className="mt-1 text-500 text-[6px]">
                                        CONNECTING PEOPLE, INSTANTLY
                                    </div>
                                </div>
                            </div>
                        </a>
                        <Link to="/">
                            <div className='aspect-square grid duration-150 cursor-pointer place-items-center fill-500 hover:fill-300 h-8'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="85%" viewBox="0 -960 960 960"><path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z"/></svg>
                            </div>
                        </Link>
                    </div>
                    <div className='w-full h-max flex flex-col overflow-x-hidden overflow-y-auto pb-2 border-b mb-4 border-500'>
                        {/*<div className='text-base font-medium text-500'>
                            Username
                        </div>*/}
                        <div className='relative h-max flex items-center overflow-visible py-1 pt-3'>
                            <input 
                                id="username-input"
                                value={info.username}
                                onChange={(e) => setInfo(prev => ({...prev, username: e.target.value}))}
                                className='w-full change-autofill rounded-lg quicksand overflow-hidden bg-950 outline-none border border-500 box-border p-2 py-1 placeholder:text-500 text-300 duration-150 focus:border-300'
                            />
                            <div className='escaping-placeholder-username leading-none text-base px-1 absolute ml-1 bg-950 text-500 quicksand pointer-events-none duration-100 ease-out'>
                                Username
                            </div>
                        </div>
                        <div className='relative h-max flex items-center overflow-visible py-1 pt-3'>
                            <input 
                                id="email-input"
                                value={info.email}
                                onChange={(e) => setInfo(prev => ({...prev, email: e.target.value}))}
                                className='w-full change-autofill rounded-lg quicksand overflow-hidden bg-950 outline-none border border-500 box-border p-2 py-1 placeholder:text-500 text-300 duration-150 focus:border-300'
                            />
                            <div className='escaping-placeholder-email leading-none text-base px-1 absolute ml-1 bg-950 text-500 quicksand pointer-events-none duration-100 ease-out'>
                                Email
                            </div>
                        </div>
                        <div className='relative h-max flex items-center overflow-visible py-1 pt-3'>
                            <input 
                                id="password-input"
                                value={info.password}
                                onChange={(e) => setInfo(prev => ({...prev, password: e.target.value}))}
                                type={passwordVisible ? 'text' : 'password'}
                                className='w-full change-autofill rounded-lg quicksand overflow-hidden bg-950 outline-none border border-500 box-border p-2 py-1 pr-[2.2rem] placeholder:text-500 text-300 duration-150 focus:border-300'
                            />
                            <div className='absolute right-2 cursor-pointer fill-500 duration-150 hover:fill-300' onClick={() => setPasswordVisible(prev => !prev)}>
                                {
                                    passwordVisible
                                    ?
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1.4rem" viewBox="0 -960 960 960"><path d="M480.118-330Q551-330 600.5-379.618q49.5-49.617 49.5-120.5Q650-571 600.382-620.5q-49.617-49.5-120.5-49.5Q409-670 359.5-620.382q-49.5 49.617-49.5 120.5Q310-429 359.618-379.5q49.617 49.5 120.5 49.5Zm-.353-58Q433-388 400.5-420.735q-32.5-32.736-32.5-79.5Q368-547 400.735-579.5q32.736-32.5 79.5-32.5Q527-612 559.5-579.265q32.5 32.736 32.5 79.5Q592-453 559.265-420.5q-32.736 32.5-79.5 32.5ZM480-200q-146 0-264-83T40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83Zm0-300Zm-.169 240Q601-260 702.5-325.5 804-391 857-500q-53-109-154.331-174.5-101.332-65.5-222.5-65.5Q359-740 257.5-674.5 156-609 102-500q54 109 155.331 174.5 101.332 65.5 222.5 65.5Z"/></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1.4rem" viewBox="0 -960 960 960"><path d="m629-419-44-44q26-71-27-118t-115-24l-44-44q17-11 38-16t43-5q71 0 120.5 49.5T650-500q0 22-5.5 43.5T629-419Zm129 129-40-40q49-36 85.5-80.5T857-500q-50-111-150-175.5T490-740q-42 0-86 8t-69 19l-46-47q35-16 89.5-28T485-800q143 0 261.5 81.5T920-500q-26 64-67 117t-95 93Zm58 226L648-229q-35 14-79 21.5t-89 7.5q-146 0-265-81.5T40-500q20-52 55.5-101.5T182-696L56-822l42-43 757 757-39 44ZM223-654q-37 27-71.5 71T102-500q51 111 153.5 175.5T488-260q33 0 65-4t48-12l-64-64q-11 5-27 7.5t-30 2.5q-70 0-120-49t-50-121q0-15 2.5-30t7.5-27l-97-97Zm305 142Zm-116 58Z"/></svg>
                                }
                            </div>
                            <div className='escaping-placeholder-password leading-none text-base px-1 absolute ml-1 bg-950 text-500 quicksand pointer-events-none duration-100 ease-out'>
                                Password
                            </div>
                        </div>
                        <div className='w-full flex h-max justify-between mt-3 overflow-visible'>
                            <div className='text-500 quicksand text-[10px]'>
                                By checking this box you agree to follow our&nbsp;
                                <span className='text-300 cursor-pointer underline' onClick={() => setTermsActivated(prev => !prev)}>Terms and Conditions</span>
                            </div>
                            <div class="checkbox-wrapper-1" style={{display: 'flex', justifyContent: 'flex-end', overflow: 'visible'}}>
                                <input id="example-1" class="substituted" type="checkbox" aria-hidden="true" checked={info.termsAccepted} onClick={() => setInfo(prev => ({...prev, termsAccepted: !prev.termsAccepted}))} />
                                <label for="example-1" style={{maxHeight: '1em', maxWidth: '1em'}}></label>
                            </div>
                        </div>
                        <div onClick={handleFormSubmit} className='py-1 mt-2 mb-1 mx-auto font-medium border border-400 rounded-lg cursor-pointer text-center w-40 text-400 ysab tracking-widest text-xs hover:text-200 hover:border-200 duration-150'>
                            REGISTER
                        </div>
                    </div>
                    <div className='w-full text-center text-xs quicksand text-500'>
                        Already got an account? <Link to="/login"><span className='text-300 underline font-semibold'>Log in.</span></Link>
                    </div>
                    {
                        status.active &&
                        <>
                            <div className='w-full h-8'></div>
                            <div className={`absolute bottom-0 quicksand font-medium left-0 text-base h-8 rounded-bl-lg rounded-br-lg w-full grid place-items-center leading-none py-2 ${status.status === "success" ? "bg-green-600 text-green-300" : "bg-red-600 text-red-300"}`}>
                                {status.message}
                            </div>
                        </>
                    }
                </div>
                {
                    termsActivated
                    &&
                    <dialog open className='w-[500px] items-center max-w-[95vw] box-border p-4 rounded-lg h-[600px] max-h-[95vh] border border-500 bg-950 text-500 flex flex-col justify-between'>
                        <div className='h-[92%] max-h-[92%] w-full whitespace-pre-wrap overflow-y-auto overflow-x-hidden text-sm shadow-sm'>
                            <span className='text-300 text-base font-semibold text-center w-full'>Terms and Conditions for Collocus Chat App</span><br/><br/>
                            {
                                TERMS_AND_CONDITIONS
                            }
                        </div>
                        <div onClick={() => setTermsActivated(false)} className='py-1 font-medium border border-400 rounded-lg cursor-pointer text-center w-60 text-400 ysab tracking-widest text-base hover:text-200 hover:border-200 duration-150'>
                            CLOSE
                        </div>
                    </dialog>
                }
            </div>
        </>
    )
}

const TERMS_AND_CONDITIONS = `These Terms and Conditions ("Terms") govern your use of the Collocus Chat App ("App"), its features, services, and any related content. By accessing or using the App, you agree to comply with these Terms. If you do not agree to these Terms, please refrain from using the App.

User Conduct:
a. You are responsible for all interactions and content shared on the App.
b. Do not engage in any unlawful, offensive, or harmful behavior on the App.
c. Avoid using the App to harass, intimidate, or harm others or violate their rights.
d. Content shared on the App must not infringe on any third-party copyrights or trademarks.

Privacy Policy:
a. Our Privacy Policy outlines how we collect, use, and protect your personal information. By using the App, you agree to the terms of our Privacy Policy.

User Accounts:
a. You may need to create an account to use certain features of the App.
b. Keep your account information confidential and do not share it with others.
c. You are responsible for all activities that occur under your account.

Content:
a. You retain ownership of the content you post on the App.
b. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and distribute the content for the purpose of operating and improving the App.

Intellectual Property:
a. The App and its content are protected by copyright, trademark, and other intellectual property laws.
b. You may not use, copy, or distribute the App's content without our prior written consent.

Disclaimers:
a. The App is provided on an "as is" basis, and we make no warranties or guarantees regarding its availability, accuracy, or functionality.
b. We do not endorse or verify the content shared by users on the App.
c. We are not liable for any damages or losses resulting from your use of the App.

Modifications:
a. We may update, modify, or discontinue the App or any of its features at any time without notice.
b. We reserve the right to change these Terms at our discretion. It is your responsibility to review these Terms periodically.

Termination:
a. We may suspend or terminate your access to the App if you violate these Terms or for any other reason without prior notice.

Governing Law:
a. These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the operating entity of Collocus Chat App is located, without regard to its conflicts of law principles.

Contact:
a. If you have any questions or concerns regarding these Terms, please contact us at collocus.chat@gmail.com.

By using the Collocus Chat App, you acknowledge that you have read, understood, and agreed to these Terms and Conditions. Please make sure to review them carefully before using the App.`