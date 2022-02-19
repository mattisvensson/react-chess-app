import React, {useRef, useState} from 'react';
import './Board.css';
import Tile from '../Tile/Tile';
import Rules from '../Rules/Rules'


// TODO
// complete movement of all pieces - done
// capturing pieces - done
// check for valid moves
//  -> tile is occupied - done
//  -> passed tiles are occupied
//  -> en passant
//  -> prevent king from moving into checks
//  -> check for pins
// checkmate
// stalemate
// Pawn promotion
// Add castling
// add check
// add board description
// check if king can capture unprotected piece
// tile highlighting
// sound


const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

function Board() {

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

    const BoardRef = useRef(null);

    const [activePiece, setActivePiece] = useState({
        isActive: false,
        piece: 0,
        positionX: null,
        positionY: null
    });

    // true = white's turn
    // false = black's turn
    const [playerTurn, setPlayerTurn] = useState(true);


    function grabPiece (e) {
        if (e.target.classList.contains("piece")) {

            const mouseX = e.clientX - 40;
            const mouseY = e.clientY - 40;

            e.target.style.position = "absolute";
            e.target.style.left = mouseX + "px";
            e.target.style.top = mouseY + "px";

            const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
            const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

            const updatePiece = {
                ...activePiece,
                isActive: e.target,
                piece: position[currentY][currentX],
                positionX: currentX,
                positionY: currentY
            }
            setActivePiece(updatePiece)
        }
    }

    function movePiece (e) {

        const mouseX = e.clientX - 40;
        const mouseY = e.clientY - 40;

        const minX = BoardRef.current.offsetLeft;
        const maxX = BoardRef.current.offsetLeft + 800;
        const minY = BoardRef.current.offsetTop;
        const maxY = BoardRef.current.offsetTop + 800;

        if (activePiece.isActive) {

            activePiece.isActive.style.position = "absolute";
            activePiece.isActive.style.left = mouseX + "px";
            activePiece.isActive.style.top = mouseY + "px";

            if (mouseX < minX) {activePiece.isActive.style.left = minX - 20 + "px";}
            if (mouseX + 60 > maxX) {activePiece.isActive.style.left = maxX - 70 + "px";}
            if (mouseY < minY) {activePiece.isActive.style.top = minY - 10 + "px";}
            if (mouseY + 70 > maxY) {activePiece.isActive.style.top = maxY - 70 + "px";}
        }

    }

    function dropPiece (e) {
        if (activePiece.isActive && BoardRef) {

            const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
            const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

            // const validMove = true;
            const validMove = rules.checkMove(activePiece.positionX, activePiece.positionY, x, y, activePiece.piece, playerTurn, position);

            if (validMove) {
                const newPosition = [...position];
                newPosition[activePiece.positionY][activePiece.positionX] = 0;
                newPosition[y][x] = activePiece.piece;
                setPosition(newPosition);
    
                const updatePiece = {
                    ...activePiece,
                    isActive: null,
                    piece: 0,
                    positionX: null,
                    positionY: null
                }
                setActivePiece(updatePiece)
                setPlayerTurn(prev => !prev)
            } else {    
                activePiece.isActive.style.position = "static";
                activePiece.isActive.style.left = "unset";
                activePiece.isActive.style.top = "unset";

                const newPosition = [...position];
                setPosition(newPosition);

                const updatePiece = {
                    ...activePiece,
                    isActive: null,
                    piece: 0,
                    positionX: null,
                    positionY: null
                }
                setActivePiece(updatePiece)
            }
        }
    }


    let board = [];
    
    for (let j = 0 ; j < verticalAxis.length; j++) {
        for (let i = 0; i < horizontalAxis.length; i++){
            const checkColor = j + i + 2;
            let image = undefined;

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

            board.push(<Tile key={`${j}, ${i}`} image={`../../assets/images/${image}.png`} checkColor={checkColor}/>)
        }
    }


    return (
        <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)}>{board}</div>
    );
}

export default Board;
