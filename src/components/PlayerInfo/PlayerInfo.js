import React, { useState, useEffect } from 'react';

import Timer from './Timer';

import './PlayerInfo.css'

function PlayerInfo (props) {

    const [timer, setTimer] = useState({
        white: {
            hours: "00",
            minutes: "00",
            seconds: "00"
        },
        black: {
            hours: "00",
            minutes: "00",
            seconds: "00"
        }
    })

    let test = 0;
    setInterval(() => {
        test++
    }, 1000)


    let startingMinutes = 10;
    let time = startingMinutes * 60
    useEffect(() => {

        const updateTimer = {
            ...timer,
            white: {
                minutes: Math.floor(time / 60),
                seconds: time % 60
            }
        }
        setTimer(updateTimer)
        time--
    }, [test])

    return (
        <div className='playerInfo'>
            <p>{props.team === "white" ? props.playerNames.white : props.playerNames.black}</p>
            <div className='timer'>
                <Timer team={props.team} timer={timer}/>
            </div>
        </div>
    )
}

export default PlayerInfo