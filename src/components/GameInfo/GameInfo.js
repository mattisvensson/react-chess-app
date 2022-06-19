import React, {useState, useEffect} from 'react';

import './GameInfo.css'

import ViewMoves from './viewMoves/ViewMoves';
import resetBoard from '../Logic/resetBoard';
import moveRow from './moveRow/moveRow';

function GameInfo (props) {

    const [minutes, setMinutes]  = useState(0);
    const [increment, setIncrement] = useState(0)

    function gameStarted () {
        return (
            <>
                <div className='moves'>
                    <h4>Moves</h4>
                    <div className='moveList'>
                        {props.moveList.map((move, index) => {
                            // console.log(index)
                            return (
                                <div key={index}>
                                    <span>{move}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='cycleMoves'>
                    <ViewMoves playerTurn={props.playerTurn} positionList={props.positionList} setPosition={props.setPosition} setActivePiece={props.setActivePiece}/>
                </div>
                <div>
                    <button>End game</button>
                </div>
                {/* <div>
                    <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPlayerTurn, setCastle, setPlayerIsInCheck, setGameOver, setPositionList)}>Reset Board</button>
                </div> */}
            </>
        )
    }

    function gameEnded () {
        return <div>Game over</div>
    }

    function gameSettings () {
        return (
            <>
                <div className='setTime'>
                    <h4>Time</h4>
                    <div className="buttons">
                        <button onClick={e => props.setStartTime(30, 10)}>30 | 10</button>
                        <button onClick={e => props.setStartTime(15, 10)}>15 | 10</button>
                        <button onClick={e => props.setStartTime(10, 5)}>10 | 5</button>
                        <button onClick={e => props.setStartTime(10, 0)}>10 | 0</button>
                        <button onClick={e => props.setStartTime(5, 3)}>5 | 3</button>
                        <button onClick={e => props.setStartTime(5, 0)}>5 | 0</button>
                        <button onClick={e => props.setStartTime(3, 1)}>3 | 1</button>
                        <button onClick={e => props.setStartTime(1, 0)}>1 | 0</button>
                        <button onClick={e => props.setPlayWithTimer(false)}>&infin;</button>
                    </div>
                    <div className='input'>
                        <input type="number" placeholder='minutes' max="60" onChange={e => setMinutes(e.target.value)}></input>
                        <input type="number" placeholder='increment' max="60" onChange={e => setIncrement(e.target.value)}></input>
                        <button onClick={e => props.setStartTime(minutes, increment)}>Set</button>
                    </div>
                </div>
                <div className='setSettings'>
                    <h4>Game Settings</h4>
                    <div>
                        <input type="checkbox" name="rotateBoard"/><label htmlFor="rotateBoard">Rotate board after move</label>
                    </div>
                    <div>
                        <input type="checkbox" name="redoMove"/><label htmlFor="redoMove">Take back move</label>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div id="GameInfo">
            {props.gameStatus ? gameStarted() : gameSettings()}
        </div>
    )
}

export default GameInfo;