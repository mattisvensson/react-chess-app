import React, { useState, useEffect, useRef } from 'react';

import Timer from './Timer';

import './PlayerInfo.css'

function PlayerInfo (props) {



    return (
        <div className='playerInfo'>
            <p className='playerName'>{props.team === "white" ? props.playerNames.white : props.playerNames.black}</p>
            {props.playWithTimer && <Timer team={props.team} timer={props.timer} increment={props.increment}/>}
        </div>
    )
}

export default PlayerInfo