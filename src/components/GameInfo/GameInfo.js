import React, {useState, useEffect} from 'react';

import './GameInfo.css'

import ViewMoves from './viewMoves/ViewMoves';
import resetBoard from '../Logic/resetBoard';
import moveRow from './moveRow/moveRow';

function GameInfo (props) {

    console.log(props.gameStatus)

    function gameStarted () {
        return (
            <>
                {props.gameStatus ? <button onClick={e => props.startTimer()}>Start Game</button> : <button onClick={e => props.pauseTimer()}>Pause Timer</button>}
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
                <form>
                    <input type="checkbox"/><label>Time</label>
                </form>
                <button onClick={(event) => { props.setGameStatus(prev => !prev); props.startTimer();}}>Play</button>
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