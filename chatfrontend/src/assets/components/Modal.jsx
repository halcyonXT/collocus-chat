import React from 'react'




function Modal(props) {
    
    const cancel = (e, isLegitimate = false) => {
        if (!isLegitimate) {
            console.log(e.target)
            if (!e.target.classList.contains('cancel-bg')) {
                return
            }
        }
        document.querySelector('#open-modal-content').animate([
            {opacity: 1, transform: 'scale(1)'},
            {opacity: 0, transform: 'scale(0.9)'}
        ], {
            duration: 100,
            fill: 'forwards',
            delay: 0
        })
        document.querySelector('.modal-background').animate([
            {backdropFilter: "blur(3px)"},
            {backdropFilter: "blur(0px)"}
        ], {
            duration: 150,
            fill: 'forwards',
            delay: 0
        })
        document.querySelector('.open-modal').animate([
            {transform: 'scaleX(1)'},
            {transform: 'scaleX(0)'}
        ], {
            duration: 200,
            delay: 100,
            easing: 'ease-in',
            fill: 'forwards'
        })
        setTimeout(() => {
            props.setTether(false)
        }, 300)
    }

    

    return (
        <div onClick={(e) => cancel(e)} className='absolute modal-background top-0 left-0 z-[1] w-full h-full grid place-items-center bg-black bg-opacity-0 cancel-bg'>
            <div className='open-modal overflow-hidden w-96 border border-500 bg-950 max-h-[80vh] max-w-[90vw] font-medium ysab text-base text-300 rounded-lg shadow-md shadow-950 p-4 box-content h-max'>
                <div id='open-modal-content' className='open-modal-content relative duration-100 w-full h-max'>
                    <svg onClick={(e) => cancel(e, true)} className='absolute z-50 -top-2 duration-100 cursor-pointer -right-2 fill-500 hover:fill-300' xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
                    {
                        props.children
                    }
                </div>
            </div>
        </div>
    )
}

export default Modal

/*
 * Modal.useTransition = (props) => {
        const runTransition = (oldElementID, newElement, direction) => {
            const target = document.querySelector(`#${oldElementID}`)
            const targetParent = target.parentElement
            const newRef = React.useRef(newElement)
            targetParent.appendChild(newRef.current)
            newRef.current.style.position = 'absolute'
            newRef.current.style.left = '100%'
            newRef.current.style.top = '0%'
            target.animate([
                {transform: 'scale(1)', opacity: 1, marginLeft: '0'},
                {transform: 'scale(0.7)', opacity: '0.7', marginLeft: '0'},
                {transform: 'scale(0.7)', opacity: '0.7', marginLeft: '-100%'}
            ],{
                duration: 350,
                delay: 0,
                fill: 'forwards',
            })
            newRef.current.animate([
                {transform: 'scale(0.7)', opacity: '0.7', left: '100%'},
                {transform: 'scale(0.7)', opacity: '0.7', left: '0'},
                {transform: 'scale(1)', opacity: '1', left: '0'}
            ], {
                duration: 350,
                delay: 150,
                fill: 'forwards'  
            })
            targetParent.animate([
                { minHeight: `${target.clientHeight}px`, maxHeight: `${target.clientHeight}px` },
                { minHeight: `${newRef.current.offsetHeight}px`, maxHeight: `${newRef.current.offsetHeight}px`  }
            ], {
                duration: 400,
                delay: 0,
                fill: 'forwards'
            })
            setTimeout(() => {
                newRef.current.style.position = 'static'
            }, 500)
        }
        return {runTransition}
    }
 */
