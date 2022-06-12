import React, {useState, useEffect} from 'react';

import './GameInfo.css'

import ViewMoves from './viewMoves/ViewMoves';
import resetBoard from '../Logic/resetBoard';
import moveRow from './moveRow/moveRow';

function GameInfo (props) {

    const [minutes, setMinutes]  = useState(0);
    const [increment, setIncrement] = useState(0)

    function setCustomTimer () {

    }

    function gameStarted () {
        return (
            <>
                {/* {props.gameStatus ? <button onClick={e => props.pauseTimer()}>Pause Timer</button> : <button onClick={e => props.startTimer()}>Continue</button>} */}
                <div className='moves'>
                    <div className='moveList'>
                        {props.moveList.map((move, index) => {
                            console.log()
                            return (
                                <div key={index}>
                                    {move}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='cycleMoves'>
                    <ViewMoves playerTurn={props.playerTurn} positionList={props.positionList} setPosition={props.setPosition} setActivePiece={props.setActivePiece}/>
                </div>
            </>
        )
    }

    function gameSettings () {
        return (
            <div className='gameSettings'>
                <div className='setTime'>
                    <button onClick={e => props.setStartTime(30, 10)}>30 | 10</button>
                    <button onClick={e => props.setStartTime(15, 10)}>15 | 10</button>
                    <button onClick={e => props.setStartTime(10, 5)}>10 | 5</button>
                    <button onClick={e => props.setStartTime(10, 0)}>10 | 0</button>
                    <button onClick={e => props.setStartTime(5, 3)}>5 | 3</button>
                    <button onClick={e => props.setStartTime(5, 0)}>5 | 0</button>
                    <button onClick={e => props.setStartTime(3, 1)}>3 | 1</button>
                    <button onClick={e => props.setStartTime(1, 0)}>1 | 0</button>
                    <input type="text" placeholder='minutes' onChange={e => setMinutes(e.target.value)}></input>
                    <input type="text" placeholder='increment' onChange={e => setIncrement(e.target.value)}></input>
                    <button onClick={e => props.setStartTime(minutes, increment)}>Set</button>
                    <button onClick={e => props.setPlayWithTimer(false)}>Without Clock</button>
                </div>
                <button onClick={(event) => { props.setGameStatus(true); props.startTimer();}}>Play</button>
            </div>
        )
    }

    return (
        <div id="GameInfo">
            {props.gameStatus ? gameStarted() : gameSettings()}
            {/* <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPlayerTurn, setCastle, setPlayerIsInCheck, setGameOver, setPositionList)}>Reset Board</button> */}
        </div>
    )
}

export default GameInfo;