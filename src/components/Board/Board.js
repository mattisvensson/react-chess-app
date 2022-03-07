import React, {useEffect, useRef, useState} from 'react';
import './Board.css';
import Tile from '../Tile/Tile';
import Rules from '../Rules/Rules'


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
        piece: 0,
        positionX: null,
        positionY: null
    });

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

    //grabbing the piece
    function grabPiece (e) {

        if (e.target === activePiece.isActive) {

            const updatePiece = {
                ...activePiece,
                isActive: false,
            }
            setActivePiece(updatePiece)

            setPossibleTiles([]);
            setPossibleCaptures([])

        } else if (e.target.classList.contains("piece")) {

            //Reset possible Tiles and captures
            setPossibleTiles([]);
            setPossibleCaptures([])
        
            //get coordinates of mouse
            const mouseX = e.clientX - 40;
            const mouseY = e.clientY - 40;

            //set piece position to mouse position
            e.target.style.position = "absolute";
            e.target.style.left = mouseX + "px";
            e.target.style.top = mouseY + "px";

            //get tile on which the piece was standing
            const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
            const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

            //set active piece
            const updatePiece = {
                ...activePiece,
                isActive: e.target,
                piece: position[currentY][currentX],
                positionX: currentX,
                positionY: currentY
            }
            setActivePiece(updatePiece)

            setPieceIsDragged(true)

        } else if (activePiece.isActive) {
            
            const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
            const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

            executeMove(x, y)

        }
    }
    

    //Check possible moves
    useEffect(() => {
        if (activePiece.isActive) {
            rules.checkPossibleMoves(activePiece.positionX, activePiece.positionY, activePiece.piece, position, playerTurn, setPossibleTiles, setPossibleCaptures);
        }
    }, [activePiece, position])

    //move piece
    function movePiece (e) {

        if (pieceIsDagged) {

            //get coordinates of mouse
            const mouseX = e.clientX - 40;
            const mouseY = e.clientY - 40;

            //get borders of the board
            const minX = BoardRef.current.offsetLeft;
            const maxX = BoardRef.current.offsetLeft + 800;
            const minY = BoardRef.current.offsetTop;
            const maxY = BoardRef.current.offsetTop + 800;

            if (activePiece.isActive && pieceIsDagged) {

                //set piece position to mouse position
                activePiece.isActive.style.position = "absolute";
                activePiece.isActive.style.left = mouseX + "px";
                activePiece.isActive.style.top = mouseY + "px";

                //stop piece from following the mouse if mouse is outside of the board
                if (mouseX < minX) {activePiece.isActive.style.left = minX - 20 + "px";}
                if (mouseX + 60 > maxX) {activePiece.isActive.style.left = maxX - 70 + "px";}
                if (mouseY < minY) {activePiece.isActive.style.top = minY - 10 + "px";}
                if (mouseY + 70 > maxY) {activePiece.isActive.style.top = maxY - 70 + "px";}
            }
        }
    }

    function dropPiece (e) {
        
        console.log(possibleTiles)
        console.log(possibleCaptures)

        if (activePiece.isActive && BoardRef) {

            const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
            const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

            executeMove(x, y);

        }
    }

    function executeMove (x, y) {
        
        let match = false;
        for (let i = 0; i < possibleTiles.length; i++) {
            if (JSON.stringify(possibleTiles[i]) === JSON.stringify([y, x])) {
                match = true;
                break;
            }
        }
        for (let i = 0; i < possibleCaptures.length; i++) {
            if (JSON.stringify(possibleCaptures[i]) === JSON.stringify([y, x])) {
                if ((playerTurn && position[y][x] > 8) || (!playerTurn && position[y][x] < 8)) {
                    match = true;
                    break;
                }
            }
        }
        
        if (match) {
            
            const newPosition = [...position];
            newPosition[activePiece.positionY][activePiece.positionX] = 0;
            newPosition[y][x] = activePiece.piece;
            setPosition(newPosition);

            setPlayerTurn(prev => !prev)

            //Reset possible Tiles
            setPossibleTiles([]);
            setPossibleCaptures([])

            const updateLastPiece = {
                ...lastPiece, 
                oldPositionX: activePiece.positionX,
                oldPositionY: activePiece.positionY,
                newPositionX: x,
                newPositionY: y
            }
            setLastPiece(updateLastPiece)

            const updatePiece = {
                ...activePiece,
                isActive: false,
            }
            setActivePiece(updatePiece)

        }      

        activePiece.isActive.style.position = "static";
        activePiece.isActive.style.left = "unset";
        activePiece.isActive.style.top = "unset";

        setPieceIsDragged(false)

    }

    let board = [];
    
    for (let j = 0; j < verticalAxis.length; j++) {
        for (let i = 0; i < horizontalAxis.length; i++){
            const checkColor = j + i + 2;
            let image = undefined;
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
                case 1: image = "p_w"; break;
                case 11: image = "p_b"; break;
                case 2: image = "n_w"; break;
                case 12: image = "n_b"; break;
                case 3: image = "b_w"; break;
                case 13: image = "b_b"; break;
                case 4: image = "r_w"; break;
                case 14: image = "r_b"; break;
                case 5: image = "q_w"; break;
                case 15: image = "q_b"; break;
                case 6: image = "k_w"; break;
                case 16: image = "k_b"; break;
                default: image = undefined; break;
            }

            board.push(<Tile key={`${j}, ${i}`} posX={verticalAxis[j]} posY={horizontalAxis[i]} image={`../../assets/images/${image}.png`} isPossibleMove={isPossibleMove} isPossibleCapture={isPossibleCapture} isHighlighted={isHighlighted} checkColor={checkColor}/>)
        }
    }

    return (
        <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)}>{board}</div>
    );
}

export default Board;
