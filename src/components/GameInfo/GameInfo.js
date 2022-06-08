import React, {useState, useEffect} from 'react';

import './GameInfo.css'

import ViewMoves from './viewMoves/ViewMoves';
import resetBoard from '../Logic/resetBoard';
import moveRow from './moveRow/moveRow';

function GameInfo (props) {

    const [moveCounter, setMoveCounter] = useState(0)

    
    console.log(props.moveList.length % 2)
    useEffect(() => {

    })
    // props.moveList.length

    return (
        <div id="GameInfo">
            <div className='pgn'>
                <div className='moveCounter'>
                    {moveCounter.map()}
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
            {/* <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPlayerTurn, setCastle, setPlayerIsInCheck, setGameOver, setPositionList)}>Reset Board</button> */}
            <ViewMoves playerTurn={props.playerTurn} positionList={props.positionList} setPosition={props.setPosition}/>
        </div>
    )
}

export default GameInfo;