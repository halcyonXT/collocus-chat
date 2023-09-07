import React from 'react'
import samplePfp1 from '/sample1.webp'
import samplePfp2 from '/sample2.webp'
import samplePfp3 from '/sample3.webp'
import samplePfp4 from '/sample4.webp'
import UpperPanel from './UpperPanel'
import Message from './Message'
import { PhoneContext } from '../context/phoneContext'

function getCurrentTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 12);
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
  
    return `${hours}:${paddedMinutes} ${amPm}`;
  }

function addMinutesToTime(timeString, offset) {
    const [time, amPm] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hours24 = hours % 12;
    if (amPm === 'PM') {
      hours24 += 12;
    }
    const totalMinutes = hours24 * 60 + minutes + offset;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    let newHours12 = newHours % 12 || 12;
    const paddedMinutes = newMinutes.toString().padStart(2, '0');
    const newAmPm = newHours < 12 ? 'AM' : 'PM';
  
    return `${newHours12}:${paddedMinutes} ${newAmPm}`;
}

function isElementScrolledToBottom(element) {
    return element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
  }

const FOLLOWUP_MESSAGES = [
    {sender: "A", offset: 1, content: "Perfect! I'll do some research on destinations and share them with you all. Let's plan a group chat to discuss further and finalize the details."},
    {sender: "B", offset: 2, content: "Sounds like a plan! Looking forward to it. Thanks for taking the initiative Alex."},
    {sender: "C", offset: 3, content: "Thanks, Alex! You're the best. Your enthusiasm for planning trips always brings a lot of excitement to the process."},
    {sender: "D", offset: 4, content: "Agreed! Can't wait to catch up and have a great time. I'm sure it'll be a trip to remember."},
    {sender: "A", offset: 5, content: "No problem, guys! I'm excited too. We'll have an amazing trip! Check out the previously visited places from my profile."},
    {sender: "B", offset: 9, content: "Wow, these places look amazing! It's going to be tough to choose. Each one has its unique charm and attractions."},
    {sender: "C", offset: 10, content: "I know, right? I'm already dreaming about those beaches and lush mountains. Deciding on one destination won't be easy."},
    {sender: "D", offset: 11, content: "Haha, me too! We should start narrowing down the options. Maybe we could vote on our top three choices and then make a final decision from there"},
    {sender: "A", offset: 12, content: "Absolutely. Let's discuss it more in our next chat. I have to run for now, but I'm looking forward to our planning session."},
    {sender: "B", offset: 13, content: "Same here, got some errands to run. Catch you guys later!"},
    {sender: "C", offset: 14, content: "Okay, talk to you all later. Have a great day!"},
    {sender: "D", offset: 15, content: "See you all later. Looking forward to our next chat. Bye!"},

]

const TIME_BASIS = getCurrentTime()
let userWasAtBottom = true

export default function LoggedOutPage() {
    const {isMobile} = React.useContext(PhoneContext)
    const [renderedMessages, setRenderedMessages] = React.useState([])
    const [time, setTime] = React.useState(0)
    const [newMessages, setNewMessages] = React.useState(false)
    const messagesRef = React.useRef(null)

    React.useEffect(() => {
        let el = document.querySelector('.main-input')
        let pointer = document.querySelector('.filler-pointer')
        el.style.height = '1px'
        document.querySelector('.bottom-filler').style.height = `${el.scrollHeight + 35}px`
        document.querySelector('.bottom-filler').style.minHeight = `min(${el.scrollHeight + 35}px, 22.5dvh)`
        el.style.height = `${el.scrollHeight}px`
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;


        setInterval(() => {
            setTime(prev => prev + 1)
        }, 5000);

        const handleResize = () => {
            const currentZoomLevel = (window.innerWidth / window.outerWidth) * 100;
            setZoomLevel(currentZoomLevel);
          };
      
          window.addEventListener('resize', handleResize);
      
          return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, [])

    React.useEffect(() => {
        userWasAtBottom = isElementScrolledToBottom(document.querySelector("#messages-wrapper"))
        if (time < 16) {
            setRenderedMessages(prev => {
                let arr = [...prev]
                for (let message of FOLLOWUP_MESSAGES) {
                    if (message.offset === time) {
                        arr.push(<Message
                            name={message.sender === "A" ? "Alexander" : message.sender === "B" ? "Phoebe" : message.sender === "C" ? "Joseph" : "Stefan"}
                            timestamp={`Today at ${addMinutesToTime(getCurrentTime(), 12)}`}
                            image={message.sender === "A" ? samplePfp1 : message.sender === "B" ? samplePfp2 : message.sender === "C" ? samplePfp3 : samplePfp4}
                            content={message.content}
                        />)
                    }
                }
                return arr
            })
        }
    }, [time])

    React.useEffect(() => {
        if (userWasAtBottom) {
            let el = document.querySelector('.main-input')
            let elf = document.querySelector('.form-input')
            el.style.height = '1px'
            elf.height = `${el.scrollHeight}px`
            el.style.height = `${el.scrollHeight}px`
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        } else {
            setNewMessages(true)
        }
    }, [renderedMessages])

    React.useEffect(() => {
        if (null) {
            if (newMessages) {
                if (isElementScrolledToBottom(document.querySelector("#messages-wrapper"))) {
                    setNewMessages(false)
                }
            }
        }
    }, [messagesRef.current])

    return (
        <>
            <div className='flex-1 flex flex-col justify-end h-full'>
            <UpperPanel disabled={true}/>
            <div ref={messagesRef} id="messages-wrapper" className='overflow-y-scroll relative overflow-x-hidden flex-1 w-full p-[3%] px-[1%] md:p-[1%] md:px-8 box-border flex justify-start flex-col pb-0 md:pb-0'>
                <div className='w-full grow'></div>
                <Message
                    name="Alexander"
                    timestamp={`Today at ${TIME_BASIS}`}
                    image={samplePfp1}
                    content="Hey everyone, how's everyone doing today?"
                />
                <Message
                    name="Phoebe"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 2)}`}
                    image={samplePfp2}
                    content="Hi Alex! I'm doing great, thanks for asking. Just finished my morning workout. It was an intense session, but I feel energized for the day ahead. I've been trying to stay consistent with my workouts, and it's been paying off. My fitness goals are slowly coming into focus, and it's quite fulfilling to see progress."
                />
                <Message
                    name="Joseph"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 3)}`}
                    image={samplePfp3}
                    content="Hey guys! I'm doing well too. A little tired from work, but hanging in there."
                />
                <Message
                    name="Stefan"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 5)}`}
                    image={samplePfp4}
                    content="Hello all! Glad to hear you're doing fine. I just got back from a short vacation, feeling refreshed!"
                />
                <Message
                    name="Alexander"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 6)}`}
                    image={samplePfp1}
                    content="That's awesome! Where did you go?"
                />
                <Message
                    name="Stefan"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 8)}`}
                    image={samplePfp4}
                    content="I went to a beautiful beach resort. The weather was perfect! The sunsets by the ocean were so mesmerizing, and I enjoyed spending quality time with friends and family. The resort had numerous activities like water sports, hiking trails, and even yoga classes. It was a well-rounded experience that allowed me to unwind and create unforgettable memories."
                />
                <Message
                    name="Phoebe"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 9)}`}
                    image={samplePfp2}
                    content="Oh, I'm so jealous! I could use a vacation like that."
                />
                <Message
                    name="Joseph"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 10)}`}
                    image={samplePfp3}
                    content="Same here! I could use a break from all the workload. Sometimes I feel like I'm juggling too many things, and it's challenging to find time for myself. But hearing about your vacation inspires me to plan something similar soon. I believe it's crucial to invest in self-care and take time to rejuvenate our minds and bodies."
                />
                <Message
                    name="Alexander"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 10)}`}
                    image={samplePfp1}
                    content="Well, we could plan a trip together sometime. It would be fun!"
                />
                <Message
                    name="Phoebe"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 11)}`}
                    image={samplePfp2}
                    content="That sounds like a great idea. We should definitely plan it."
                />
                <Message
                    name="Stefan"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 11)}`}
                    image={samplePfp4}
                    content="Count me in! Let's start looking at some options."
                />
                <Message
                    name="Joseph"
                    timestamp={`Today at ${addMinutesToTime(TIME_BASIS, 12)}`}
                    image={samplePfp3}
                    content="I'm up for it too! It'll be nice to relax and have some fun together. Exploring new places and having adventures with friends is always a great way to break away from the routine."
                />
                {
                    renderedMessages
                }
            </div>
            <div className='w-full min-h-[7%] h-max max-h-[15rem] border-700 grid place-items-center box-border p-2 relative'>
                {
                    newMessages
                    &&
                    <div className='absolute right-[calc(50%+1.5rem)] -top-16 rounded-md h-12 aspect-square shadow-sm grid place-items-center bg-950 border border-500 animate-bounce fill-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="80%" viewBox="0 -960 960 960"><path d="M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z"/></svg>
                    </div>
                }
                <div className='bottom-filler w-full max-h-[21vh]'></div>
                <div className='filler-pointer absolute right-0 bottom-0 w-full min-h-[7%] h-max max-h-[15rem] bg-[linear-gradient(0deg,var(--950),transparent)] flex justify-center align-end box-border p-2'>
                    <div className='bg-950 md:w-[98%] py-1 w-full h-[85%] border border-800 rounded-[1vh] box-border mt-[0.5%] mb-4 px-6 md:px-4 flex justify-start items-center'>
                        <form className='form-input grow h-max'>
                            <textarea disabled className={`
                                main-input 
                                p-[0.3%]
                                ${isMobile ? "text-base" : "text-lg"}
                                cursor-not-allowed pointer-events-none
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
                                text-600
                                placeholder:text-700 
                                focus:border-300
                                font-medium
                                outline-none 
                                flex justify-start items-center`}
                            placeholder={`Join Collocus to start chatting`}></textarea>
                        </form>
                        <div className={`h-9 duration-200 aspect-square fill-700 hover:fill-300 grid place-items-center cursor-pointer`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="85%" viewBox="0 -960 960 960"><path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}