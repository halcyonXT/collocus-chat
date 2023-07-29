import React from 'react'

export default function SidebarProfile(props) {

    const [hovered, setHovered] = React.useState(false)

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className='w-full py-1 flex cursor-pointer items-center select-none mb-2 justify-start gap-2 duration-150 rounded-full box-content hover:bg-slate-900 h-5'>
            <img src={props.image} className='h-full rounded-full ml-1 aspect-square'></img>
            <span className='grow quicksand overflow-hidden whitespace-nowrap text-ellipsis text-slate-400 leading-5 text-[14px]'>
                {props.name}
            </span>
            {
                hovered &&
                <>
                    <div className='min-h-full aspect-square grid place-items-center fill-slate-400 hover:fill-slate-300 duration-150'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="85%" className='float-right grow' viewBox="0 -960 960 960"><path d="M240-399h313v-60H240v60Zm0-130h480v-60H240v60Zm0-130h480v-60H240v60ZM80-80v-740q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H240L80-80Zm134-220h606v-520H140v600l74-80Zm-74 0v-520 520Z"/></svg>
                    </div>
                    <div className='min-h-full aspect-square mr-2 grid place-items-center fill-slate-400 hover:fill-slate-300 duration-150'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="85%" className='float-right grow' viewBox="0 -960 960 960"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/></svg>
                    </div>
                </>
            }
        </div>
    )
}