import React from 'react';
import Message from './Message';
import { PhoneContext } from '../context/phoneContext';
import { SocketContext } from '../context/socketContext';
import UpperPanel from './UpperPanel';

export default function MessagingPanel(props) {

    const {isMobile} = React.useContext(PhoneContext) 
    const {socket} = React.useContext(SocketContext)
    const [messageInput, setMessageInput] = React.useState('')
    const [zoomLevel, setZoomLevel] = React.useState(100);

    const messagesRef = React.useRef(null)

    React.useEffect(() => {
        let el = document.querySelector('.main-input')
        let elf = document.querySelector('.form-input')
        el.style.height = '1px'
        elf.height = `${el.scrollHeight}px`
        el.style.height = `${el.scrollHeight}px`
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

        const handleResize = () => {
            const currentZoomLevel = (window.innerWidth / window.outerWidth) * 100;
            setZoomLevel(currentZoomLevel);
          };
      
          window.addEventListener('resize', handleResize);
      
          return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, [])

    const handleSendMessage = (e) => {
        try {
            e.preventDefault();
        } catch (ex) {}

        if (!messageInput) {return}

        setMessageInput('');

        socket.emit('chatMessage', messageInput);
    }

    const handleChange = (e) => {
        
        setMessageInput(e.target.value)
    }

    const detectKey = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(e)
        }
    }

    React.useEffect(() => {
        let el = document.querySelector('.main-input')
        let elf = document.querySelector('.form-input')
        el.style.height = '1px'
        elf.height = `${el.scrollHeight}px`
        el.style.height = `${el.scrollHeight}px`
    }, [messageInput, zoomLevel])

    return (
        <div className='flex-1 flex flex-col justify-end h-full'>
            <UpperPanel/>
            <div ref={messagesRef} className='overflow-y-scroll overflow-x-hidden flex-1 w-full p-[3%] px-[1%] md:p-[1%] md:px-8 box-border flex justify-start flex-col pb-0 md:pb-0'>
                <div className='w-full grow'></div>
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
            </div>
            <div className='w-full min-h-[7%] h-max max-h-[15rem] bg-slate-950 border-t border-slate-700 grid place-items-center box-border p-2'>
                <div className='md:w-[98%] w-full h-[90%] border border-slate-700 rounded-[1vh] box-border my-[0.5%] px-[3%] md:px-[1%] flex justify-start items-center'>
                    <form onSubmit={handleSendMessage} className='form-input grow h-max'>
                        <textarea className={`
                            main-input 
                            p-[0.3%]
                            ${isMobile ? "text-base" : "text-lg"}
                            pl-0
                            min-h-full 
                            max-h-[20vh] 
                            h-max 
                            resize-none 
                            overflow-y-hidden 
                            w-full 
                            border-none 
                            bg-transparent 
                            quicksand 
                            grow 
                            text-slate-400 
                            placeholder:text-slate-600 
                            focus:border-slate-300
                            outline-none 
                            flex justify-start items-center`}
                        placeholder='Enter your message here' 
                        spellCheck="false"
                        value={messageInput}
                        onChange={handleChange}
                        onKeyDown={detectKey}></textarea>
                    </form>
                    <div className={`h-9 duration-200 aspect-square ${messageInput ? "fill-slate-400" : "fill-slate-600"} hover:fill-slate-300 grid place-items-center cursor-pointer`} onClick={handleSendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="85%" viewBox="0 -960 960 960"><path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    )
}