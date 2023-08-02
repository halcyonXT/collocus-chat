import React from 'react'
import Input from './Input'
import { UserContext } from '../context/userContext'

export default function ProfileModal(props) {


    return (
        <>
            <General/>
            <ChangeUsername/>
            <ChangeHeadline/>
        </>
    )
}

const General = (props) => {
    const {user} = React.useContext(UserContext)

    return (
        <div className='w-full flex items-start overflow-y-auto justify-start h-16' id='profile-modal'>
            <img
                src={user.profilePicture}
                className='rounded-full mr-4 h-16 aspect-square'
            />
            <div className='h-full flex flex-col justify-start w-[calc(100%-4rem)]'>
                <div>
                    <div className='text-500 quicksand text-[8px] leading-none'>
                        User ID: {user.id}
                    </div>
                </div>
                <div>
                    <div onClick={() => animateTo("change-username")} className='flex fill-500 hover:fill-300 items-center duration-200 cursor-pointer gap-2'>
                        <div className='text-300 ysab font-bold text-xl text-ellipsis whitespace-nowrap overflow-hidden max-w-[80%]'>
                            {user.username}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" height="0.9rem" viewBox="0 -960 960 960"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
                    </div>
                    <div onClick={() => animateTo("change-headline")} className='flex fill-500 hover:fill-300 items-center duration-200 cursor-pointer gap-2'>
                        <div className='text-500 text-base quicksand leading-none text-ellipsis whitespace-nowrap overflow-hidden max-w-[80%]'>
                            {user.headline}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" height="0.8rem" viewBox="0 -960 960 960"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChangeUsername = (props) => {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleChangeUsername = (e) => setUsername(e.target.value)
    const handleChangePassword = (e) => setPassword(e.target.value)

    return (
        <AnimatableWrapper id="change-username">
            <>
                <div className='ysab text-lg text-300 font-semibold pb-1'>
                    Set a new username:
                </div>
                <Input
                    id="change-username-input"
                    tether={username}
                    callback={handleChangeUsername}
                    name="Username"
                />
                <div className='ysab text-lg text-300 font-semibold pt-4'>
                    Confirm password:
                </div>
                <Input
                    id="change-username-confirm-password"
                    tether={password}
                    callback={handleChangePassword}
                    name="Password"
                />
                <div className='pt-4 flex justify-between items-center'>
                    <div onClick={() => animateTo("change-username", "backwards")} className='py-1 font-medium border border-400 rounded-lg cursor-pointer text-center w-[48%] text-400 ysab tracking-widest text-base hover:text-200 hover:border-200 duration-150'>
                        BACK
                    </div>
                    <div className='py-1 bg-400 font-medium border border-400 rounded-lg cursor-pointer text-center w-[48%] text-950 ysab tracking-widest text-base hover:bg-200 hover:border-200 duration-150'>
                        PROCEED
                    </div>
                </div>
            </>
        </AnimatableWrapper>
    )
}

const ChangeHeadline = (props) => {
    const [headline, setHeadline] = React.useState("")

    const handleChangeHeadline = (e) => setHeadline(e.target.value)

    return (
        <AnimatableWrapper id="change-headline">
            <>
                <div className='ysab text-lg text-300 font-semibold pb-1'>
                    Set a new headline:
                </div>
                <Input
                    id="change-username-input"
                    tether={headline}
                    callback={handleChangeHeadline}
                    name="Username"
                />
                <div className='pt-4 flex justify-between items-center'>
                    <div onClick={() => animateTo("change-headline", "backwards")} className='py-1 font-medium border border-400 rounded-lg cursor-pointer text-center w-[48%] text-400 ysab tracking-widest text-base hover:text-200 hover:border-200 duration-150'>
                        BACK
                    </div>
                    <div className='py-1 bg-400 font-medium border border-400 rounded-lg cursor-pointer text-center w-[48%] text-950 ysab tracking-widest text-base hover:bg-200 hover:border-200 duration-150'>
                        PROCEED
                    </div>
                </div>
            </>
        </AnimatableWrapper>
    )
}

const AnimatableWrapper = (props) => <div className='w-full flex-col overflow-y-auto items-start justify-start h-max absolute left-[calc(100%+1rem)] opacity-0 top-0' id={props.id}>{props.children}</div>

const animateTo = (id, direction = 'forwards') => {
    let replaced = document.querySelector('#profile-modal')
    let replacedParent = replaced.parentElement
    let newel = document.querySelector(`#${id}`)
    replaced.style.position = 'absolute'
    replaced.style.top = '0'
    replaced.style.left = '0'
    switch (direction) {
        case "forwards":
            replaced.animate([
                {transform: 'scale(1)', opacity: '1', left: '0'},
                {transform: 'scale(0.7)', opacity: '0.7', left: '0'},
                {transform: 'scale(0.7)', opacity: '0.7', left: 'calc(-100% - 1rem)'},
            ], {
                duration: 350,
                delay: 0,
                fill: 'forwards'
            })
            replacedParent.animate([
                {height: `${replaced.offsetHeight}px`},
                {height: `${newel.offsetHeight}px`}
            ], {
                duration: 350,
                delay: 0,
                fill: 'forwards'
            })
            newel.animate([
                {transform: 'scale(0.7)', opacity: '0.7', left: 'calc(100% + 1rem)'},
                {transform: 'scale(0.7)', opacity: '0.7', left: '0'},
                {transform: 'scale(1)', opacity: '1', left: '0'},
            ], {
                duration: 350,
                delay: 117,
                fill: 'forwards'
            })
            break
        case "backwards":
            replaced.animate([
                {transform: 'scale(0.7)', opacity: '0.7', left: 'calc(-100% - 1rem)'},
                {transform: 'scale(0.7)', opacity: '0.7', left: '0'},
                {transform: 'scale(1)', opacity: '1', left: '0'},
            ], {
                duration: 350,
                delay: 117,
                fill: 'forwards'
            })
            replacedParent.animate([
                {height: `${newel.offsetHeight}px`},
                {height: `${replaced.offsetHeight}px`}
            ], {
                duration: 350,
                delay: 0,
                fill: 'forwards'
            })
            newel.animate([
                {transform: 'scale(1)', opacity: '1', left: '0'},
                {transform: 'scale(0.7)', opacity: '0.7', left: '0'},
                {transform: 'scale(0.7)', opacity: '0.7', left: 'calc(100% + 1rem)'},
            ], {
                duration: 350,
                delay: 0,
                fill: 'forwards'
            })
            break
    }
}