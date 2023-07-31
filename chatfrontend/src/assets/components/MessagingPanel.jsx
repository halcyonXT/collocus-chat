import React from 'react';
import Message from './Message';
import { PhoneContext } from '../context/phoneContext';
import { SocketContext } from '../context/socketContext';
import UpperPanel from './UpperPanel';
import { UserContext } from '../context/userContext';
import { ChannelContext } from '../context/channelContext';
import ChannelModal from './ChannelModal';
import { useMutation, gql } from '@apollo/client';

const ADD_MESSAGE = gql`
  mutation AddMessage($id: ID!, $sender: ID!, $timestamp: String!, $content: String!, $image: String) {
    addMessage(id: $id, sender: $sender, timestamp: $timestamp, content: $content, image: $image) {
      status
      message
    }
  }
`;

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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
}
/**************************************************** */

export default function MessagingPanel(props) {

    const {user} = React.useContext(UserContext)
    const {isMobile} = React.useContext(PhoneContext) 
    const {socket} = React.useContext(SocketContext)
    const [messageInput, setMessageInput] = React.useState('')
    const [zoomLevel, setZoomLevel] = React.useState(100);
    const [messages, setMessages] = React.useState([])
    const [channelModalOpen, setChannelModalOpen] = React.useState(false)
    let {focusedChannel, setFocusedChannel, extensiveChannelInfo} = React.useContext(ChannelContext)
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


          return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, [])

    const renderMessages = (() => {
        let arr = []
        console.log(messages)
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
        console.log(focusedChannel, user.id, getCurrentDateString(), messageInput, user.profilePicture)
        let m = await addNewMessage(focusedChannel, user.id, getCurrentDateString(), messageInput, user.profilePicture)
        console.log(m)
        setMessageInput('');
        reheight()
    }

    const handleChange = (e) => {
        
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
        el.style.height = '1px'
        document.querySelector('.bottom-filler').style.height = `${el.scrollHeight + 30}px`
        document.querySelector('.bottom-filler').style.minHeight = `min(${el.scrollHeight + 30}px, 21dvh)`
        el.style.height = `${el.scrollHeight}px`
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }

    return (
        <>
            {
                channelModalOpen
                &&
                <ChannelModal setChannelModalOpen={setChannelModalOpen}/>
            }
            <div className={`w-full relative max-w-full md:w-[calc(100%-18rem)] md:max-w-[calc(100%-18rem)] flex flex-col justify-end h-full`}>
                <UpperPanel setChannelModalOpen={setChannelModalOpen} changeChannels={changeChannels}/>
                <div ref={messagesRef} className='overflow-y-scroll overflow-x-hidden flex-1 w-full p-[3%] px-[1%] md:p-[1%] md:px-8 box-border flex justify-start flex-col pb-0 md:pb-0'>
                    <div className='w-full grow'></div>
                    {
                        renderMessages
                    }
                    <div className='bottom-filler w-full max-h-[21vh]'></div>
                </div>
                
                <div className='absolute right-0 bottom-0 w-full min-h-[7%] h-max max-h-[15rem] bg-[linear-gradient(0deg,#0f172a,transparent)] grid place-items-center box-border p-2'>
                    <div className='bg-slate-950 md:w-[98%] w-full h-[90%] border border-slate-700 rounded-[1vh] box-border my-[0.5%] py-1 px-6 md:px-4 flex justify-start items-center'>
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
                                overflow-y-hidden 
                                w-full 
                                border-none 
                                bg-transparent 
                                quicksand 
                                grow 
                                text-slate-300 
                                placeholder:text-slate-600 
                                focus:border-slate-300
                                outline-none 
                                flex justify-start items-center`}
                            placeholder={focusedChannel ? `Message channel ${focusedChannel}` : `Select a channel to chat`} 
                            spellCheck="false"
                            value={messageInput}
                            onChange={handleChange}
                            onInput={reheight}
                            onKeyDown={detectKey}></textarea>
                        </form>
                        <div className={`h-9 duration-200 aspect-square ${messageInput ? "fill-slate-400" : "fill-slate-600"} hover:fill-slate-300 grid place-items-center cursor-pointer`} onClick={handleSendMessage}>
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