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
            <button className={`${(props.positionList.length > 1) && (index >= 1) ? "" : "inactive"}`} onClick={e => prevMove()}>Previous</button>
            <button className={`${(props.positionList.length > 1) && (index + 1 < props.positionList.length) ? "" : "inactive"}`} onClick={e => nextMove()}>Next</button>
        </div>
    )
}

export default ViewMoves;