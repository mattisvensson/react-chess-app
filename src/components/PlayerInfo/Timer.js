import React from 'react';

function Timer (props) {

    let timer = props.team === "white" ? props.timerWhite : props.timerBlack


    return (
        <p className='timer'>
            <span className='increment'>
                +{props.increment / 1000}s
            </span>
            <span className='time'>
                {timer}
            </span>
        </p>
    )
}

export default Timer