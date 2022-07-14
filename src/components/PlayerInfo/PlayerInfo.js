import React, { useEffect, useState } from 'react';
import Timer from './Timer';
import './PlayerInfo.css'

function PlayerInfo (props) {

    let playerColor = props.team === "white" ? "w" : "b";
    let pawnPlayer = `./assets/images/pieces/p_${playerColor}.png`;

    const [materialCount, setMaterialCount] = useState({
        white: 0,
        black: 0
    })

    const [capturesWhite, setCapturesWhite] = useState([])
    const [capturesBlack, setCapturesBlack] = useState([])

    useEffect(() => {

        //display captures pieces
        let counter = {
            white: {
                pawn: 0,
                knight: 0,
                bishop: 0,
                rook: 0,
                queen: 0,
            }, 
            black: {
                pawn: 0,
                knight: 0,
                bishop: 0,
                rook: 0,
                queen: 0,
            }
        }

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                switch (props.position[y][x]) {
                    case 1: counter.white.pawn++; break;
                    case 2: counter.white.knight++; break;
                    case 3: counter.white.bishop++; break;
                    case 4: counter.white.rook++; break;
                    case 5: counter.white.queen++; break;
                    case 11: counter.black.pawn++; break;
                    case 12: counter.black.knight++; break;
                    case 13: counter.black.bishop++; break;
                    case 14: counter.black.rook++; break;
                    case 15: counter.black.queen++; break;
                }
            }
        }
    
        let whiteCapturesCache = []
        let blackCapturesCache = []
    
        if (counter.white.pawn < 8) addCaptures(1, 8 - counter.white.pawn, "white")
        if (counter.white.knight < 2) addCaptures(2, 2 - counter.white.knight, "white")
        if (counter.white.bishop < 2) addCaptures(3, 2 - counter.white.bishop, "white")
        if (counter.white.rook < 2) addCaptures(4, 2 - counter.white.rook, "white")
        if (counter.white.queen < 1) addCaptures(5, 1 - counter.white.queen, "white")
        if (counter.black.pawn < 8) addCaptures(11, 8 - counter.black.pawn, "black")
        if (counter.black.knight < 2) addCaptures(12, 2 - counter.black.knight, "black")
        if (counter.black.bishop < 2) addCaptures(13, 2 - counter.black.bishop, "black")
        if (counter.black.rook < 2) addCaptures(14, 2 - counter.black.rook, "black")
        if (counter.black.queen < 1) addCaptures(15, 1 - counter.black.queen, "black")

        function addCaptures (piece, ammount, color) {
            for (let i = 0; i < ammount; i++) {
                if (color === "white") {
                    whiteCapturesCache.push(piece)
                } else {
                    blackCapturesCache.push(piece)
                }
            } 
        }

        setCapturesBlack(blackCapturesCache)
        setCapturesWhite(whiteCapturesCache)


        //display material advantage
        let totalWhite = 0;
        let totalBlack = 0;

        let pawnValue = 1;
        let knightValue = 3;
        let bishopValue = 3;
        let rookValue = 5;
        let queenValue = 9;
        

        for (let i = 0; i < whiteCapturesCache.length; i++) {
            switch (whiteCapturesCache[i]) {
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

        for (let i = 0; i < blackCapturesCache.length; i++) {
            switch (blackCapturesCache[i]) {
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
            const updateCount = {
                white: "",
                black: totalWhite - totalBlack
            }
            setMaterialCount(updateCount)
        } else {
            const updateCount = {
                black: "",
                white: totalBlack - totalWhite
            }
            setMaterialCount(updateCount)
        }

    }, [props.playerTurn])

    let captures = props.team === "white" ? capturesBlack : capturesWhite

    return (
        <div key={props.playerNames} className='playerInfo'>
            <div className='player'>
                <img src={pawnPlayer}/>
                <p className='playerName'>{props.team === "white" ? props.playerNames.white : props.playerNames.black}</p>
                <div className='materialAdvantage'>
                    {captures.map((piece, index) => {
                        let displayPiece;

                        let pieceColor = props.team === "white" ? "b" : "w";

                        switch (piece) {
                            case 1:
                            case 11: displayPiece = `./assets/images/pieces/p_${pieceColor}.png`; break;
                            case 2:
                            case 12: displayPiece = `./assets/images/pieces/n_${pieceColor}.png`; break;
                            case 3:
                            case 13: displayPiece = `./assets/images/pieces/b_${pieceColor}.png`; break;
                            case 4:
                            case 14: displayPiece = `./assets/images/pieces/r_${pieceColor}.png`; break;
                            case 5:
                            case 15: displayPiece = `./assets/images/pieces/q_${pieceColor}.png`; break;
                        }

                        return (
                                <img key={index} src={displayPiece}/>
                        )
                    })}
                    <span>
                        {props.team === "white" && materialCount.white > 0 && "+" + materialCount.white}
                        {props.team === "black" && materialCount.black > 0 && "+" + materialCount.black}
                    </span>
                </div>
            </div>
            {props.playWithTimer && <Timer team={props.team} timerWhite={props.timerWhite} timerBlack={props.timerBlack} increment={props.increment}/>}
        </div>
    )
}

export default PlayerInfo