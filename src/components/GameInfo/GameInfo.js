import React, {useState, useEffect} from 'react';

import './GameInfo.css'

import moveRow from './moveRow/moveRow';

function GameInfo (props) {

    const [minutes, setMinutes]  = useState(0);
    const [increment, setIncrement] = useState(0);
    const [playerWhite, setPlayerWhite] = useState("");
    const [playerBlack, setPlayerBlack] = useState("");

    const [index, setIndex] = useState(0)

    function setNames () {
        const updateNames = {
            white: playerWhite.length > 0 ? playerWhite : "White",
            black: playerBlack.length > 0 ? playerBlack : "Black"
        }
        props.setPlayerNames(updateNames)
    }


    function addTime (value, position) {
        if (value < 61 && value >= 1) {
            position === "minutes" ? setMinutes(Math.floor(value)) : setIncrement(Math.floor(value))
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
            reason: "Draw due to mutual agreement",
            winner: false
        }
        props.setGameOver(updateGameOver)
        props.pauseTimer()
    }


    //cycle moves
    useEffect(() => {
        setIndex(props.positionList.length)
    }, [props.playerTurn])


    function goToMove (indicator) {

        if (props.gameOver.gameOver) {
            const updateGameOver = {
                ...props.gameOver,
                gameOver: false
            }
            props.setGameOver(updateGameOver)
        }

        let positionData;

        switch (indicator) {
            case "minus": 
                if (index < 1) break;
                positionData = props.positionList[index - 1];
                setIndex(prev => prev - 1)
                break;
            case "plus": 
                if (index + 1 >= props.positionList.length) break;
                positionData = props.positionList[index + 1];
                setIndex(prev => prev + 1)
                break;
            case "first": 
                if (index < 1) break;
                positionData = props.positionList[0];
                setIndex(0)
                break;
            case "last": 
                if (index >= props.positionList.length - 1) break;
                positionData = props.positionList[props.positionList.length - 1];
                setIndex(props.positionList.length - 1)
                break;
            default:
                positionData = props.positionList[indicator + 1];
                setIndex(indicator + 1)
                break;
        }


        if (positionData) {

            props.setPossibleTiles([])
            props.setPossibleTilesAfterCheck([])
            props.setPossibleKingTilesAfterCheck([])

            props.setPosition(positionData.position)

            const updateLastMove = {
                oldPositionX: positionData.tiles.oldX,
                oldPositionY: positionData.tiles.oldY,
                newPositionX: positionData.tiles.newX,
                newPositionY: positionData.tiles.newY
            }
            props.setLastMove(updateLastMove)

            props.setActivePiece(props.initialActivePiece)

            props.playSound && props.audioMove.play()
        }
    }
    

    function gameStarted () {
        return (
            <>
                <div className='moves'>
                    <h4>Moves</h4>
                    <div className='moveList'>
                        {props.moveList.map((move, index) => {
                            return (
                                <div onClick={() => goToMove(index)} key={index}>
                                    <span>{move}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div id="ViewMoves">
                        <button onClick={() => goToMove("first")}>
                            <svg height="48" width="48"><path d="M11.55 36.35V11.5h3.65v24.85Zm22.9 0L22.2 24.1l12.25-12.25 2.6 2.6-9.65 9.65 9.65 9.65Z"/></svg>
                        </button>
                        <button className={`${(props.positionList.length > 1) && (index >= 1) ? "" : "inactive"}`} onClick={e => goToMove("minus")}>
                            <svg height="48" width="48"><path d="M28.1 36.45 15.55 23.9 28.1 11.35l2.6 2.6-9.95 9.95 9.95 9.95Z"/></svg>
                        </button>
                        <button className={`${(props.positionList.length > 1) && (index + 1 < props.positionList.length) ? "" : "inactive"}`} onClick={e => goToMove("plus")}>
                            <svg height="48" width="48"><path d="m18.75 36.45-2.6-2.6 9.95-9.95-9.95-9.95 2.6-2.6L31.3 23.9Z"/></svg>
                        </button>
                        <button onClick={() => goToMove("last")}>
                            <svg height="48" width="48"><path d="m13.55 36.25-2.6-2.6 9.7-9.7-9.7-9.7 2.6-2.6 12.3 12.3Zm19.3.15V11.55h3.65V36.4Z"/></svg>
                        </button>
                    </div>
                </div>
                {props.gameOver.gameOver ?
                    <>
                        <div>
                            <p>{props.gameOver.winner && props.gameOver.winner}</p>
                            <p>{props.gameOver.reason}</p>
                        </div>
                        <div>
                            <button>Copy PGN</button>
                            <button>Start new Game</button>
                        </div>   
                    </>
                :
                    <div className='endGame'>
                        <button className='surrender'>
                            <svg height="48" width="48"><path fill="white" d="M10 42V8h17.15l.95 4.3H40v18.5H27.2l-.95-4.25H13V42Z"/></svg>
                        </button>
                        <button className='draw' onClick={() => drawGame()}>Draw</button>
                        <button className='draw' onClick={() => props.resetBoard()}>Quit</button>
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