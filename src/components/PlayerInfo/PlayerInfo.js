import React, { useState, useEffect, useRef } from 'react';

import Timer from './Timer';

import './PlayerInfo.css'

function PlayerInfo (props) {



    return (
        <div className='playerInfo'>
            <p>{props.team === "white" ? props.playerNames.white : props.playerNames.black}</p>
            <div className='timer'>
                <Timer team={props.team} timer={props.timer}/>
            </div>
        </div>
    )
}

export default PlayerInfo