import React, {useState, useEffect} from 'react';

import './GameInfo.css'

import ViewMoves from './viewMoves/ViewMoves';
import moveRow from './moveRow/moveRow';

function GameInfo (props) {

    const [minutes, setMinutes]  = useState(0);
    const [increment, setIncrement] = useState(0);
    const [playerWhite, setPlayerWhite] = useState("");
    const [playerBlack, setPlayerBlack] = useState("");

    function setNames () {
        const updateNames = {
            white: playerWhite.length > 0 ? playerWhite : "White",
            black: playerBlack.length > 0 ? playerBlack : "Black"
        }
        props.setPlayerNames(updateNames)
    }


    function addTime (value, position) {
        if (value < 61 && value > 0) {
            position === "minutes" ? setMinutes(value) : setIncrement(value)
        } else if (value > 60) {
            position === "minutes" ? setMinutes(60) : setIncrement(60)
        } else {
            position === "minutes" ? setMinutes(1) : setIncrement(1)
        }
    }

    function continueGame () {
        props.setGameStatus(true)
        props.setFoundSavedGame(false)
        props.setAllowPieceSelection(true)
    }

    function drawGame () {
        const updateGameOver = {
            gameOver: true,
            reason: "mutual agreement",
            winner: "draw"
        }
        props.setGameOver(updateGameOver)
        props.pauseTimer()
    }
    

    function gameStarted () {
        return (
            <>
                <div className='moves'>
                    <h4>Moves</h4>
                    <div className='moveList'>
                        {props.moveList.map((move, index) => {
                            return (
                                <div key={index}>
                                    <span>{move}</span>
                                </div>
                            )
                        })}
                    </div>
                    <ViewMoves playerTurn={props.playerTurn} positionList={props.positionList} setPosition={props.setPosition}/>
                </div>
                {props.gameOver.gameOver ?
                    <div>
                        <button>Download PGN</button>
                        <button>Save Game</button>
                        <button>Start new Game</button>
                    </div>   
                :
                    <div className='endGame'>
                        <button className='surrender'>
                            <svg height="48" width="48"><path fill="white" d="M10 42V8h17.15l.95 4.3H40v18.5H27.2l-.95-4.25H13V42Z"/></svg>
                        </button>
                        <button className='draw' onClick={() => drawGame()}>Draw</button>
                        <button className='draw' onClick={() => props.resetBoard()}>Quit Game</button>
                        <button className='surrender'>
                            <svg height="48" width="48"><path fill="#000000" d="M10 42V8h17.15l.95 4.3H40v18.5H27.2l-.95-4.25H13V42Z"/></svg>
                        </button>
                    </div>
                }
            </>
        )
    }


    function gameSettings () {
        return (
            <>
                <div className='setPlayerNames'>
                    <h4>Player names</h4>
                    <div>
                        <input type="text" maxLength="20" minLength="1" placeholder='White' onChange={(e) => setPlayerWhite(e.target.value)}></input>
                        <input type="text" maxLength="20" minLength="1" placeholder='Black' onChange={(e) => setPlayerBlack(e.target.value)}></input>
                        <button onClick={() => setNames()}>Set</button>
                    </div>
                </div>
                <div className='setTime'>
                    <h4>Time</h4>
                    <div className="buttons">
                        <button onClick={() => props.setStartTime(30, 10)}>30 | 10</button>
                        <button onClick={() => props.setStartTime(15, 10)}>15 | 10</button>
                        <button onClick={() => props.setStartTime(10, 5)}>10 | 5</button>
                        <button onClick={() => props.setStartTime(10, 0)}>10 | 0</button>
                        <button onClick={() => props.setStartTime(5, 3)}>5 | 3</button>
                        <button onClick={() => props.setStartTime(5, 0)}>5 | 0</button>
                        <button onClick={() => props.setStartTime(3, 1)}>3 | 1</button>
                        <button onClick={() => props.setStartTime(1, 0)}>1 | 0</button>
                        <button onClick={() => props.setPlayWithTimer(false)}>&infin;</button>
                    </div>
                    <div className='input'>
                        <input type="number" placeholder='minutes' max="60" min="1" onChange={e => addTime(e.target.value, "minutes")}></input>
                        <input type="number" placeholder='increment' max="60" min="1" onChange={e => addTime(e.target.value, "increment")}></input>
                        <button onClick={() => props.setStartTime(minutes, increment)}>Set</button>
                    </div>
                </div>
                <div className='setSettings'>
                    <h4>Game Settings</h4>
                    <div>
                        <input id="rotateBoard" type="checkbox" name="rotateBoard" checked={props.switchBoard} onChange={() => props.setSwitchBoard(prev => !prev)}/><label htmlFor="rotateBoard">Rotate board after move</label>
                    </div>
                    {/* <div>
                        <input id="redoMove" type="checkbox" name="redoMove"/><label htmlFor="redoMove">Undo last move</label>
                    </div> */}
                    <div>
                        <input id="saveSettings" type="checkbox" name="saveSettings" checked={props.saveGame} onChange={() => props.setSaveGame(prev => !prev)}/><label htmlFor="saveSettings">Save game and settings</label>     
                        <div className='tooltip'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M9.25 14h1.5V9h-1.5ZM10 7.5q.312 0 .531-.219.219-.219.219-.531 0-.312-.219-.531Q10.312 6 10 6q-.312 0-.531.219-.219.219-.219.531 0 .312.219.531.219.219.531.219ZM10 18q-1.646 0-3.104-.625-1.458-.625-2.552-1.719t-1.719-2.552Q2 11.646 2 10q0-1.667.625-3.115.625-1.447 1.719-2.541Q5.438 3.25 6.896 2.625T10 2q1.667 0 3.115.625 1.447.625 2.541 1.719 1.094 1.094 1.719 2.541Q18 8.333 18 10q0 1.646-.625 3.104-.625 1.458-1.719 2.552t-2.541 1.719Q11.667 18 10 18Zm0-1.5q2.708 0 4.604-1.896T16.5 10q0-2.708-1.896-4.604T10 3.5q-2.708 0-4.604 1.896T3.5 10q0 2.708 1.896 4.604T10 16.5Zm0-6.5Z"/></svg>
                            <span className='tooltipcontent'>Your game is automatically saved to local storage after each move. If you refresh the page or come back later, you can still continue your game.</span>
                        </div>
                    </div>
                    <div>
                        <input id="hideTiles" type="checkbox" name="saveSettings" checked={props.showPossibleTiles} onChange={() => props.setShowPossibleTiles(prev => !prev)}/><label htmlFor="hideTiles">Show possible tiles</label>
                    </div>
                    <div>
                        <input id="muteSound" type="checkbox" name="saveSettings" checked={props.playSound} onChange={() => props.setPlaySound(prev => !prev)}/><label htmlFor="muteSound">Play sound</label>
                    </div>
                </div>
            </>
        )
    }

    if (props.foundSavedGame) {
        return (
            <aside id="GameInfo">
                <div className='continueGame'>
                    <button onClick={() => continueGame()}>continue game</button>
                    <span>or</span> 
                    <button onClick={() => props.resetBoard()}>start a new game</button>
                </div>
            </aside>
        )
    }

    return (
        <aside id="GameInfo">
            {props.gameStatus ? gameStarted() : gameSettings()}
        </aside>
    )
}

export default GameInfo;