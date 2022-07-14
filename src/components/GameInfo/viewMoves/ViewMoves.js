import React, { useState, useEffect } from 'react';

import './ViewMoves.css';

import audioMoveFile from '../../../sounds/move.mp3';
const audioMove = new Audio(audioMoveFile)

function ViewMoves (props) {

    const [index, setIndex] = useState(0)

    useEffect(() => {
        setIndex(props.positionList.length)
    }, [props.playerTurn])

    function prevMove () {
        if (index >= 1) {
            audioMove.play()
            props.setPosition(props.positionList[index - 1])
            setIndex(prev => prev - 1);
        }
    }

    function nextMove () {
        if (index + 1 < props.positionList.length) {
            audioMove.play()
            setIndex(prev => prev + 1);
            props.setPosition(props.positionList[index + 1])
        } 
    }

    return (
        <div id="ViewMoves">
            <button>
                <svg height="48" width="48"><path d="M11.55 36.35V11.5h3.65v24.85Zm22.9 0L22.2 24.1l12.25-12.25 2.6 2.6-9.65 9.65 9.65 9.65Z"/></svg>
            </button>
            <button className={`${(props.positionList.length > 1) && (index >= 1) ? "" : "inactive"}`} onClick={e => prevMove()}>
                <svg height="48" width="48"><path d="M28.1 36.45 15.55 23.9 28.1 11.35l2.6 2.6-9.95 9.95 9.95 9.95Z"/></svg>
            </button>
            <button className={`${(props.positionList.length > 1) && (index + 1 < props.positionList.length) ? "" : "inactive"}`} onClick={e => nextMove()}>
                <svg height="48" width="48"><path d="m18.75 36.45-2.6-2.6 9.95-9.95-9.95-9.95 2.6-2.6L31.3 23.9Z"/></svg>
            </button>
            <button>
                <svg height="48" width="48"><path d="m13.55 36.25-2.6-2.6 9.7-9.7-9.7-9.7 2.6-2.6 12.3 12.3Zm19.3.15V11.55h3.65V36.4Z"/></svg>
            </button>
        </div>
    )
}

export default ViewMoves;