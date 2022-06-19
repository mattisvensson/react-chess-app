import React, { useEffect, useState } from 'react';

import Timer from './Timer';

import './PlayerInfo.css'

function PlayerInfo (props) {

    const [number, setNumber] = useState({
        white: 0,
        black: 0
    })

    let pawnPlayer = props.team === "white" ? "./assets/images/pieces/p_w.png" : "./assets/images/pieces/p_b.png";

    let pawn = props.team === "white" ? "./assets/images/pieces/p_b.png" : "./assets/images/pieces/p_w.png";
    let knight = props.team === "white" ? "./assets/images/pieces/n_b.png" : "./assets/images/pieces/n_w.png";
    let bishop = props.team === "white" ? "./assets/images/pieces/b_b.png" : "./assets/images/pieces/b_w.png";
    let rook = props.team === "white" ? "./assets/images/pieces/r_b.png" : "./assets/images/pieces/r_w.png";
    let queen = props.team === "white" ? "./assets/images/pieces/q_b.png" : "./assets/images/pieces/q_w.png";

    let pawnValue = 1;
    let knightValue = 3;
    let bishopValue = 3;
    let rookValue = 5;
    let queenValue = 9;

    let captures = props.team === "white" ? props.pieceAdvantage.white : props.pieceAdvantage.black

    captures.sort(function(a, b) {
        return a - b;
    });


    let totalWhite = 0;
    let totalBlack = 0;

    useEffect(() => {

        for (let i = 0; i < props.pieceAdvantage.white.length; i++) {
            switch (props.pieceAdvantage.white[i]) {
                case 1:
                case 11: totalWhite =  totalWhite + pawnValue; break;
                case 2:
                case 12: totalWhite =  totalWhite + knightValue; break;
                case 3:
                case 13: totalWhite =  totalWhite + bishopValue; break;
                case 4:
                case 14: totalWhite =  totalWhite + rookValue; break;
                case 5:
                case 15: totalWhite =  totalWhite + queenValue; break;
            }
        }

        for (let i = 0; i < props.pieceAdvantage.black.length; i++) {
            switch (props.pieceAdvantage.black[i]) {
                case 1:
                case 11: totalBlack = totalBlack + pawnValue; break;
                case 2:
                case 12: totalBlack = totalBlack + knightValue; break;
                case 3:
                case 13: totalBlack = totalBlack + bishopValue; break;
                case 4:
                case 14: totalBlack = totalBlack + rookValue; break;
                case 5:
                case 15: totalBlack = totalBlack + queenValue; break;
            }
        }

        if (totalWhite > totalBlack) {
            const updateNumber = {
                black: "",
                white: totalWhite - totalBlack
            }
            setNumber(updateNumber)
        } else {
            const updateNumber = {
                white: "",
                black: totalBlack - totalWhite
            }
            setNumber(updateNumber)
        }

    }, [props.pieceAdvantage])


    return (
        <div key={props.playerNames} className='playerInfo'>
            <div className='player'>
                <img src={pawnPlayer}/>
                <p className='playerName'>{props.team === "white" ? props.playerNames.white : props.playerNames.black}</p>
                <div className='materialAdvantage'>
                    {captures.map((piece, index) => {

                        let displayPiece;

                        switch (piece) {
                            case 1:
                            case 11: displayPiece = pawn; break;
                            case 2:
                            case 12: displayPiece = knight; break;
                            case 3:
                            case 13: displayPiece = bishop; break;
                            case 4:
                            case 14: displayPiece = rook; break;
                            case 5:
                            case 15: displayPiece = queen; break;
                        }

                        return (
                                <img key={index} src={displayPiece}/>
                        )
                    })}
                    <span>{props.team === "white" && number.white > 0 ? "+" + number.white : ""}{props.team === "black" && number.black > 0 ? "+" + number.black : ""}</span>
                </div>
            </div>
            {props.playWithTimer && <Timer team={props.team} timer={props.timer} increment={props.increment}/>}
        </div>
    )
}

export default PlayerInfo