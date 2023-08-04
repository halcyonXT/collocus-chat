import React from 'react'

let timer;

export default function SidebarProfile(props) {
    const copyToClipboard = () => navigator.clipboard.writeText(props.id);

    const [hovered, setHovered] = React.useState(false)
    const [clicked, setClicked] = React.useState(false)

    const handleCopyLink = () => {
        clearTimeout(timer)
        setClicked(true)
        copyToClipboard()

        timer = setTimeout(() => {
            setClicked(false)
        }, 3500)
    }

    if (!props.svg) {return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className='w-full py-1 flex cursor-pointer items-center select-none mb-2 justify-start gap-2 duration-150 rounded-full box-content hover:bg-900 h-6'>
            <img src={props.image} className='h-full rounded-full ml-1 aspect-square'></img>
            <span className='grow ml-2 quicksand overflow-hidden whitespace-nowrap text-ellipsis text-400 leading-5 text-base'>
                {props.name}
            </span>
            {
                hovered &&
                <>
                    <div className='min-h-full aspect-square grid place-items-center fill-400 hover:fill-300 duration-150'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="85%" className='float-right grow' viewBox="0 -960 960 960"><path d="M240-399h313v-60H240v60Zm0-130h480v-60H240v60Zm0-130h480v-60H240v60ZM80-80v-740q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H240L80-80Zm134-220h606v-520H140v600l74-80Zm-74 0v-520 520Z"/></svg>
                    </div>
                    <div className='min-h-full aspect-square mr-2 grid place-items-center fill-400 hover:fill-300 duration-150'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="85%" className='float-right grow' viewBox="0 -960 960 960"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/></svg>
                    </div>
                </>
            }
        </div>
    )} else {return (
        <div onClick={handleCopyLink} className={`w-full py-1 flex cursor-pointer items-center mb-2 justify-start gap-2 duration-150 rounded-full box-content ${clicked ? 'bg-green-500' : 'hover:bg-900'} h-6 fill-500 hover:fill-300 text-500 hover:text-300`}>
            <div className='h-full aspect-square ml-2'>
                {
                    clicked
                    ?
                    <svg xmlns="http://www.w3.org/2000/svg" height="100%" className='fill-100' viewBox="0 -960 960 960"><path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>
                    :
                    props.svg
                }
            </div>
            <span className={`grow ml-2 quicksand overflow-hidden whitespace-nowrap text-ellipsis ${clicked ? 'text-100' : 'text-400'} leading-5 text-base`}>
                {
                    clicked
                    ?
                    "Copied channel ID"
                    :
                    props.name
                }
            </span>
        </div>
    )

    }
}