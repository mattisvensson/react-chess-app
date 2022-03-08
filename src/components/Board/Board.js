import React, {useEffect, useRef, useState} from 'react';
import './Board.css';
import Tile from './Tile/Tile';
import Rules from '../Logic/Rules'
import movePiece from '../Logic/movePiece';
import grabPiece from '../Logic/grabPiece';
import dropPiece from '../Logic/dropPiece';
import executeMove from '../Logic/executeMove';
import resetBoard from '../Logic/resetBoard';


// TODO
// X complete movement of all pieces              
// X capturing pieces                             
//   check for valid moves
// X  -> tile is occupied                         
// X  -> passed tiles are occupied                
//    -> en passant
//    -> prevent king from moving into checks
//    -> check for pins
//   checkmate
//   stalemate
//   Pawn promotion
//   Add castling
//   add check
//   add board description
//   check if king can capture unprotected piece
//   tile highlighting
// X  -> possible Moves                           
// X  -> capturable pieces                        
//    -> last move
//   add sound effects
//   custom board position generator
//   game recording
//    -> able to click thorugh moves/game
//   timer
//   conect to chess api
//    -> play with bots
//    -> get openings
//    -> puzzles

function Board() {

    //Board axis
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

    //Get rules
    const rules = new Rules();

    // Pieces:
    // 1 = Pawn (white)
    // 2 = Knight (white)
    // 3 = Bishop (white)
    // 4 = Rook (white)
    // 5 = Queen (white)
    // 6 = King (white)
    // 11 = Pawn (black)
    // 12 = Knight (black)
    // 13 = Bishop (black)
    // 14 = Rook (black)
    // 15 = Queen (black)
    // 16 = King (black)
    const [position, setPosition] = useState([
        [14,12,13,15,16,13,12,14],
        [11,11,11,11,11,11,11,11],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1],
        [4,2,3,5,6,3,2,4],
    ])

    //Referencing the board
    const BoardRef = useRef(null);

    //Keep track of active piece
    const [activePiece, setActivePiece] = useState({
        isActive: false,
        piece: null,
        positionX: null,
        positionY: null,
        counter: 0
    });

    //keep track of the last move
    const [lastPiece, setLastPiece] = useState({
        oldPositionX: null,
        oldPositionY: null,
        newPositionX: null,
        newPositionY: null
    })

    // true = white's turn
    // false = black's turn
    const [playerTurn, setPlayerTurn] = useState(true);

    //Saves possible Tiles to move to when piece is grabbed
    const [possibleTiles, setPossibleTiles] = useState([]);

    //Saves possible piece captures when piece is grabbed
    const [possibleCaptures, setPossibleCaptures] = useState([])

    const [pieceIsDagged, setPieceIsDragged] = useState(false);


    

    //Check possible moves
    useEffect(() => {
        if (activePiece.isActive) {
            rules.checkPossibleMoves(activePiece.positionX, activePiece.positionY, activePiece.piece, position, playerTurn, setPossibleTiles, setPossibleCaptures);
        }
    }, [activePiece, position])


    console.log(pieceIsDagged)
    console.log(activePiece)


    


    //creating the board
    let board = [];
    for (let j = 0; j < verticalAxis.length; j++) {
        for (let i = 0; i < horizontalAxis.length; i++){
            const checkColor = j + i + 2;
            let image = undefined;
            let color = undefined;
            let isPossibleMove = false;
            let isPossibleCapture = false;
            let isHighlighted = false;

            //highlight possible Tiles
            for (let x = 0; x < possibleTiles.length; x++) {
                if (JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) {
                    isPossibleMove = true;
                }
            }

            //highlight pieces which can be captured
            for (let z = 0; z < possibleCaptures.length; z++) {
                if (JSON.stringify(possibleCaptures[z]) === JSON.stringify([j, i])) {
                    if ((playerTurn && position[j][i] > 8) || (!playerTurn && position[j][i] < 8)) {
                        isPossibleCapture = true;
                    }
                }
            }

            if ((activePiece.positionX === i && activePiece.positionY === j) || (lastPiece.oldPositionX === i && lastPiece.oldPositionY === j) || (lastPiece.newPositionX === i && lastPiece.newPositionY === j)) {
                isHighlighted = true;
            }

            switch (position[j][i]) {
                case 1: image = "p_w"; color = "white"; break;
                case 11: image = "p_b"; color = "black"; break;
                case 2: image = "n_w"; color = "white"; break;
                case 12: image = "n_b"; color = "black"; break;
                case 3: image = "b_w"; color = "white"; break;
                case 13: image = "b_b"; color = "black"; break;
                case 4: image = "r_w"; color = "white"; break;
                case 14: image = "r_b"; color = "black"; break;
                case 5: image = "q_w"; color = "white"; break;
                case 15: image = "q_b"; color = "black"; break;
                case 6: image = "k_w"; color = "white"; break;
                case 16: image = "k_b"; color = "black"; break;
                default: image = undefined; break;
            }

            board.push(<Tile key={`${j}, ${i}`} posX={verticalAxis[j]} posY={horizontalAxis[i]} image={`../../assets/images/${image}.png`} isPossibleMove={isPossibleMove} isPossibleCapture={isPossibleCapture} isHighlighted={isHighlighted} checkColor={checkColor} color={color}/>)
        }
    }


    return (
        <>
            <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e, BoardRef, activePiece, position, setPossibleTiles, setPossibleCaptures, setActivePiece, setPieceIsDragged)} onMouseMove={e => movePiece(e, activePiece, BoardRef, pieceIsDagged)} onMouseUp={e => dropPiece(e, BoardRef, activePiece, setActivePiece, setPossibleTiles, setPossibleCaptures)}>{board}</div>
            <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPossibleCaptures, setPlayerTurn)}>Reset Board</button>
        </>
    );
}

export default Board;
