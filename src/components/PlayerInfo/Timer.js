import React from 'react';

function Timer (props) {


    return (
        <p className='timer'>
            <span className='increment'>
                +{props.increment / 1000}s
            </span>
            <span className='time'>
                {props.timer}
            </span>
        </p>
    )
}

export default Timer