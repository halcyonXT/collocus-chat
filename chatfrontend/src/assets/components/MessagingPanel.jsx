import React from 'react';
import Message from './Message';
import { PhoneContext } from '../context/phoneContext';
import { SocketContext } from '../context/socketContext';
import UpperPanel from './UpperPanel';
import { UserContext } from '../context/userContext';
import { ChannelContext } from '../context/channelContext';
import ChannelModal from './ChannelModal';
import { useMutation, gql } from '@apollo/client';
import Modal from './Modal';
import ProfileModal from './ProfileModal';

import { ADD_MESSAGE } from '../api/api';

/******************************************************* */
function getCurrentDateString() {
    const currentDate = new Date();
    return `${formatDate(currentDate)} ${formatAMPM(currentDate)}`;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function formatAMPM(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}

// Example usage of getCurrentDateString:
function processDateString(dateString) {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    const isToday = currentDate.toDateString() === inputDate.toDateString();
    const isYesterday = new Date(currentDate - 86400000).toDateString() === inputDate.toDateString();

    if (isToday) {
        return `Today at ${getFormattedTime(inputDate)}`;
    } else if (isYesterday) {
        return `Yesterday at ${getFormattedTime(inputDate)}`;
    } else {
        return dateString;
    }
}

function getFormattedTime(date) {
    let hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours > 12 ? ~~(hours % 12) : hours
    return `${hours}:${minutes} ${ampm}`;
}
/**************************************************** */

let timer = null;
let ableToEmit = true;

export default function MessagingPanel(props) {

    const {user} = React.useContext(UserContext)
    const {isMobile} = React.useContext(PhoneContext) 
    const {socket} = React.useContext(SocketContext)
    const [messageInput, setMessageInput] = React.useState('')
    const [zoomLevel, setZoomLevel] = React.useState(100);
    const [messages, setMessages] = React.useState([])
    const [typing, setTyping] = React.useState([])
    const [channelModalOpen, setChannelModalOpen] = React.useState(false)
    const [profileModalOpen, setProfileModalOpen] = React.useState(false)
    let {focusedChannel, setFocusedChannel, extensiveChannelInfo, update} = React.useContext(ChannelContext)
    const [addMessage] = useMutation(ADD_MESSAGE);
    const messagesRef = React.useRef(null)

    const addNewMessage = async (REQ_ID, REQ_SENDER, REQ_TIMESTAMP, REQ_CONTENT, REQ_IMAGE) => {
        return await addMessage({ variables: { id: REQ_ID, sender: REQ_SENDER, timestamp: REQ_TIMESTAMP, content: REQ_CONTENT, image: REQ_IMAGE } });
    };

    const changeChannels = (id) => {
        setFocusedChannel(id)
    }

    React.useEffect(() => {
        if (focusedChannel) {
            setMessages(extensiveChannelInfo.messages)
        }
    }, [extensiveChannelInfo])

    React.useEffect(() => {
        reheight()

        const handleResize = () => {
            const currentZoomLevel = (window.innerWidth / window.outerWidth) * 100;
            setZoomLevel(currentZoomLevel);
          };
      
          window.addEventListener('resize', handleResize);
      
        socket.on("message", msg => {
            setMessages(prev => [...prev, msg])
        })

        socket.on("startTyping", info => {
            setTyping(prev => [...prev, {name: info.name, id: info.id}])
        })

        socket.on("endTyping", info => {
            setTyping(prev => prev.filter(item => item.id !== info.id))
        })

        socket.on("newMember", id => {
            if (id !== user.id) {
                update.members()
            }
        })

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const renderMessages = (() => {
        let arr = []
        const templateMessage = (item, chain = "none") => {
            return (<Message
                name={item.sender?.username}
                timestamp={processDateString(item.timestamp)}
                image={item.sender?.profilePicture}
                content={item.content}
                chain={chain}
            />)
        }
        for (let i=0, currentID = messages.length === 0 ? null : messages[0].sender?._id, currentIDcount = 1; i < messages.length; i++) {
            if (messages[i+1]?.sender?._id == currentID) {
                if (currentIDcount == 1) {
                    arr.push(templateMessage(messages[i], "top"))
                } else {
                    arr.push(templateMessage(messages[i], "middle"))
                }
                ++currentIDcount
            } else if (currentIDcount > 1) {
                arr.push(templateMessage(messages[i], "bottom"))
                currentID = messages[i+1]?.sender?._id
                currentIDcount = 1
            } else {
                arr.push(templateMessage(messages[i]))
                currentID = messages[i+1]?.sender?._id
                currentIDcount = 1
            }
        }
        return arr
    })(); 


    const handleSendMessage = async (e) => {
        try {
            e.preventDefault();
        } catch (ex) {}
        if (!messageInput) {return}
        socket.emit('chatMessage', ({
            sender: {...user, _id: user.id},
            timestamp: getCurrentDateString(),
            content: messageInput
        }));
        let m = await addNewMessage(focusedChannel, user.id, getCurrentDateString(), messageInput, user.profilePicture)
        setMessageInput('');
        reheight()
    }

    const handleChange = (e) => {
        clearTimeout(timer)
        if (ableToEmit) {
            socket.emit("startTyping", {
                name: user.username,
                id: user.id
            })
            ableToEmit = false
        }
        timer = setTimeout(() => {
            ableToEmit = true
            socket.emit("endTyping", {
                name: user.username,
                id: user.id
            })
        }, 3000)
        setMessageInput(e.target.value)
    }

    const detectKey = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(e)
        }
        reheight()
    }

    React.useEffect(() => {
        reheight()
    }, [messageInput, zoomLevel])

    const reheight = () => {
        let el = document.querySelector('.main-input')
        let pointer = document.querySelector('.filler-pointer')
        el.style.height = '1px'
        document.querySelector('.bottom-filler').style.height = `${el.scrollHeight + 35}px`
        document.querySelector('.bottom-filler').style.minHeight = `min(${el.scrollHeight + 35}px, 22.5dvh)`
        el.style.height = `${el.scrollHeight}px`
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }


    return (
        <>
            {
                channelModalOpen
                &&
                <Modal tether={channelModalOpen} setTether={setChannelModalOpen}>
                    <ChannelModal/>
                </Modal>
            }
            {
                profileModalOpen
                &&
                <Modal setTether={setProfileModalOpen}>
                    <ProfileModal/>
                </Modal>
            }
            <div className={`w-full relative max-w-full md:w-[calc(100%-18rem)] md:max-w-[calc(100%-18rem)] flex flex-col justify-end h-full`}>
                <UpperPanel setProfileModalOpen={setProfileModalOpen} setChannelModalOpen={setChannelModalOpen} changeChannels={changeChannels}/>
                <div ref={messagesRef} className='overflow-y-scroll overflow-x-hidden flex-1 w-full p-[3%] px-[1%] md:p-[1%] md:px-8 box-border flex justify-start flex-col pb-0 md:pb-0'>
                    <div className='w-full grow'></div>
                    {
                        focusedChannel
                        ?
                        renderMessages
                        :
                        <div className='w-full min-w-full flex flex-col justify-center items-center mb-8'>
                            <div className='text-600 quicksand text-2xl'>
                                Welcome to
                            </div>
                            <div className='text-500 ysab font-bold text-3xl tracking-[0.05em]'>
                                COLLOCUS
                            </div>
                            <div className='text-600 quicksand text-2xl'>
                                Select a channel to start chatting in
                            </div>
                        </div>
                    }
                    <div className='bottom-filler w-full max-h-[21vh]'></div>
                </div>
                
                <div className='filler-pointer absolute right-0 bottom-0 w-full min-h-[7%] h-max max-h-[15rem] bg-[linear-gradient(0deg,var(--950),transparent)] flex justify-center align-end box-border p-2'>
                    <div className='bg-950 md:w-[98%] py-1 w-full h-[85%] border border-700 rounded-[1vh] box-border mt-[0.5%] mb-4 px-6 md:px-4 flex justify-start items-center'>
                        <form onSubmit={handleSendMessage} className='form-input grow h-max'>
                            <textarea className={`
                                main-input 
                                p-[0.3%]
                                ${isMobile ? "text-base" : "text-lg"}
                                ${!focusedChannel && 'cursor-not-allowed pointer-events-none'}
                                shadow-inner
                                pl-0
                                min-h-full 
                                max-h-[19vh] 
                                h-7 
                                resize-none 
                                overflow-y-auto 
                                w-full 
                                border-none 
                                bg-transparent 
                                quicksand 
                                grow 
                                text-300 
                                placeholder:text-600 
                                focus:border-300
                                font-medium
                                outline-none 
                                flex justify-start items-center`}
                            placeholder={focusedChannel ? `Message channel ${extensiveChannelInfo.name}` : `Select a channel to chat`} 
                            spellCheck="false"
                            value={messageInput}
                            onChange={handleChange}
                            onInput={reheight}
                            onKeyDown={detectKey}></textarea>
                        </form>
                        {
                            typing.length > 0
                            &&
                            <div className='absolute bottom-[0.07rem] text-sm ysab font-light text-400 flex'>
                                <div className='flex gap-2 animate-pulse'>
                                    ●●●
                                </div>
                                &nbsp;
                                <span className='font-semibold'>
                                    {typing.map(item => `${item.name}`).join(", ")}
                                </span>
                                &nbsp;{typing.length === 1 ? "is " : "are "}typing
                            </div>
                        }
                        <div className={`h-9 duration-200 aspect-square ${messageInput ? "fill-400" : "fill-600"} hover:fill-300 grid place-items-center cursor-pointer`} onClick={handleSendMessage}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="85%" viewBox="0 -960 960 960"><path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

/**
 * <Message
                    name="Big length name truly this is a huge ass name"
                    timestamp="Today at 4:54 PM"
                    image="https://i.ibb.co/1qqM328/IMG-0634.jpg"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu. Arcu dui vivamus arcu felis. Magna fermentum iaculis eu non diam phasellus. Sagittis aliquam malesuada bibendum arcu vitae. Ipsum nunc aliquet bibendum enim. Urna porttitor rhoncus dolor purus non. Urna id volutpat lacus laoreet non curabitur gravida arcu. Lacus laoreet non curabitur gravida arcu ac tortor dignissim. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Iaculis at erat pellentesque adipiscing commodo. Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Quisque id diam vel quam elementum. Lacus viverra vitae congue eu consequat. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Aliquam vestibulum morbi blandit cursus risus at ultrices mi."
                />
                <Message
                    name="Big length name truly this is a huge ass name"
                    timestamp="Today at 4:54 PM"
                    image="https://i.ibb.co/1qqM328/IMG-0634.jpg"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu. Arcu dui vivamus arcu felis. Magna fermentum iaculis eu non diam phasellus. Sagittis aliquam malesuada bibendum arcu vitae. Ipsum nunc aliquet bibendum enim. Urna porttitor rhoncus dolor purus non. Urna id volutpat lacus laoreet non curabitur gravida arcu. Lacus laoreet non curabitur gravida arcu ac tortor dignissim. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Iaculis at erat pellentesque adipiscing commodo. Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Quisque id diam vel quam elementum. Lacus viverra vitae congue eu consequat. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Aliquam vestibulum morbi blandit cursus risus at ultrices mi."
                />
                <Message
                    name="Big length name truly this is a huge ass name"
                    timestamp="Today at 4:54 PM"
                    image="https://i.ibb.co/1qqM328/IMG-0634.jpg"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu. Arcu dui vivamus arcu felis. Magna fermentum iaculis eu non diam phasellus. Sagittis aliquam malesuada bibendum arcu vitae. Ipsum nunc aliquet bibendum enim. Urna porttitor rhoncus dolor purus non. Urna id volutpat lacus laoreet non curabitur gravida arcu. Lacus laoreet non curabitur gravida arcu ac tortor dignissim. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Iaculis at erat pellentesque adipiscing commodo. Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Quisque id diam vel quam elementum. Lacus viverra vitae congue eu consequat. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Aliquam vestibulum morbi blandit cursus risus at ultrices mi."
                />
                <Message
                    name="Big length name truly this is a huge asss name"
                    timestamp="Today at 4:54 PM"
                    image="https://i.ibb.co/1qqM328/IMG-0634.jpg"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu. Arcu dui vivamus arcu felis. Magna fermentum iaculis eu non diam phasellus. Sagittis aliquam malesuada bibendum arcu vitae. Ipsum nunc aliquet bibendum enim. Urna porttitor rhoncus dolor purus non. Urna id volutpat lacus laoreet non curabitur gravida arcu. Lacus laoreet non curabitur gravida arcu ac tortor dignissim. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Iaculis at erat pellentesque adipiscing commodo. Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Quisque id diam vel quam elementum. Lacus viverra vitae congue eu consequat. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Aliquam vestibulum morbi blandit cursus risus at ultrices mi."
                />
 */