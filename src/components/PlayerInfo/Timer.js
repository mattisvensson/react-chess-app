import React from 'react';

function Timer (props) {

    let h;
    let m;
    let s;

    if (props.team === "white") {
        h = props.timer.white.hours;
        m = props.timer.white.minutes;
        s = props.timer.white.seconds;
    } else {
        h = props.timer.black.hours;
        m = props.timer.black.minutes;
        s = props.timer.black.seconds;
    }

    return (
        <p>
            <span>
                {h}
            </span>
            :
            <span>
                {m}
            </span>
            :
            <span>
                {s}
            </span>
        </p>
    )
}

export default Timer