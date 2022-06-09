import React, {useState, useEffect} from 'react';

import './GameInfo.css'

import ViewMoves from './viewMoves/ViewMoves';
import resetBoard from '../Logic/resetBoard';
import moveRow from './moveRow/moveRow';

function GameInfo (props) {

    const [moveCounter, setMoveCounter] = useState(0)

    function startGame () {
        props.startTimer()
    }


    function pgn () {

        return (
            <div className='pgn'>
                {props.timerStatus ? <button onClick={e => props.continueTimer()}>Continue</button> : <button onClick={e => props.pauseTimer()}>Pause</button>}
                <div className='moveCounter'>
                </div>
                <div>
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
        )
    }

    function gameSettings () {
        return (
            <div className='gameSettings'>
                <button onClick={(event) => { props.setGameStatus(prev => !prev); startGame();}}>Play</button>
            </div>
        )
    }

    return (
        <div id="GameInfo">
            {props.gameStatus ? pgn() : gameSettings()}
            {/* <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPlayerTurn, setCastle, setPlayerIsInCheck, setGameOver, setPositionList)}>Reset Board</button> */}
            <ViewMoves playerTurn={props.playerTurn} positionList={props.positionList} setPosition={props.setPosition} setActivePiece={props.setActivePiece}/>
        </div>
    )
}

export default GameInfo;