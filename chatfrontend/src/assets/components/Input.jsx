import React from 'react'

export default function Input(props) {
    const valueRef = React.useRef(props.tether)
    valueRef.current = props.tether

    React.useEffect(() => {

        const movePlaceholder = () => {
            let target = document.querySelector(`.escaping-${props.id}`)
            target.style.transform = 'translateY(-1.15rem) translateX(0.2rem)'
            target.style.fontSize = '10px'
            target.style.color = 'var(--600)'
        }

        const normalPlaceholder = () => {
            let target = document.querySelector(`.escaping-${props.id}`)
            if (!valueRef.current) {
                target.style.transform = 'translateY(0rem) translateX(0rem)'
                target.style.fontSize = '16px'
            }
            target.style.color = 'var(--700)'
        }

        document.querySelector(`#${props.id}`).addEventListener("focus", movePlaceholder)
        document.querySelector(`#${props.id}`).addEventListener("blur", normalPlaceholder)

        return () => {
            try {
                document.querySelector(`#${props.id}`).removeEventListener("focus", movePlaceholder)
                document.querySelector(`#${props.id}`).removeEventListener("blur", normalPlaceholder)
            } catch (err) {}
        }
    }, [])

    return (
        <>
            <div className='relative w-full h-max flex items-center overflow-visible py-1'>
                <input 
                    id={props.id}
                    value={props.tether}
                    onChange={props.callback}
                    type={props.type ? props.visibilityTether ? "text" : props.type : "text"}
                    className='w-full change-autofill rounded-lg text-lg quicksand overflow-hidden bg-950 outline-none border border-700 box-border p-2 py-1 pr-[2.2rem] placeholder:text-700 text-600 duration-150 focus:border-600'
                />
                <div className={`escaping-${props.id} leading-none text-base px-1 absolute ml-1 bg-950 text-700 quicksand pointer-events-none duration-100 ease-out`}>
                    {props.name}
                </div>
            </div>
        </>
    )
}
